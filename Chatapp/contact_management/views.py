from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Friendrequest , Friendship,Blocklist,ChatRoom,Message,Notifications,ChatAIModel
from .serializers import FriendRequestSerializer , FriendshipSerializer,BlockListSerializer,ChatRoomSerializer,MessageSerializer,ChatAISerializer
from user_account.models import User
from user_account.renderers import UserRenderer
from django.db.models import Q
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.parsers import MultiPartParser, FormParser


# send friend request
class SendFriendRequestView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]

    def post(self,request):
        sender=request.user
        receiver_id = request.data.get('receiver_id')

        if not receiver_id:
            return Response({"error":"Receiver ID is required"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            receiver=User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({"error":"Receiver not found"},status=status.HTTP_400_BAD_REQUEST)

        if sender==receiver:
            return Response({"error":"Can't send friend request to yourself"},status=status.HTTP_400_BAD_REQUEST)
        
        # Check if request already exists
        if Friendrequest.objects.filter(sender=sender,receiver=receiver,is_pending=True).exists():
            return Response({"error":"Friend request already sent"},status=status.HTTP_400_BAD_REQUEST)
        
        friend_request = Friendrequest.objects.create(sender=sender, receiver=receiver)

        send_notifications_to_user(
            sender=sender,
            receiver=receiver,
            notif_type="friend request",
            content=f"{sender.username} sent you a friend request."
        )
        

        return Response(FriendRequestSerializer(friend_request).data, status=status.HTTP_201_CREATED)

# view pending friend request 
class ViewFriendRequestView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]

    def get(self,request):
        pending_request=Friendrequest.objects.filter(receiver=request.user,is_pending=True)
        serializers=FriendRequestSerializer(pending_request,many=True)

        return Response(serializers.data)

# Accept/Reject Friend Request
class RespondFriendRequestView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]

    def post(self,request,request_id):
        try:
            friend_request=Friendrequest.objects.get(id=request_id,receiver=request.user, is_pending=True)
        except Friendrequest.DoesNotExist:
            return Response({"error":"Friend request not found"},status=status.HTTP_400_BAD_REQUEST)
        
        action=request.data.get("action")
        if action=="accept":
            friend_request.is_accepted=True
            friend_request.is_pending=False
            friend_request.save()

            Friendship.objects.create(user1=friend_request.sender,user2=friend_request.receiver)

            send_notifications_to_user(
                sender=request.user,
                receiver=friend_request.sender,
                notif_type="friend requested accepted!",
                content=f"{request.user.username} accept the friend request"
            )

            return Response({"message":"Friend request accepted"},status=status.HTTP_200_OK)
        
        elif action=="reject":
            friend_request.is_rejected=True
            friend_request.is_pending=False
            friend_request.save()

            send_notifications_to_user(
                sender=request.user,
                receiver=friend_request.sender,
                notif_type="friend requested rejected!",
                content=f"{request.user.username} rejected the friend request"
            )

            return Response({"message":"Friend request rejected"},status=status.HTTP_200_OK)
        else:
            return Response({"error":"Invalid action"},status=status.HTTP_400_BAD_REQUEST)

# View Friends List
'''
Fetch all friendships where the logged-in user is either user1 or user2.

Iterate over the friendships:

If user1 is the logged-in user, add user2 (the friend) to the list.

If user2 is the logged-in user, add user1 (the friend) to the list.

Serialize the friend list using UserSerializer instead of FriendshipSerializer, so only user details (not the whole friendship object) are returned.
'''
class FriendListView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]

    def get(self,request):
        friendships=Friendship.objects.filter(user1=request.user)| Friendship.objects.filter(user2=request.user)
        friendList={}

        for friendship in friendships:
            if friendship.user1==request.user:
                friendList[friendship.user2.id]={ 
                    "id": friendship.user2.id,
                    "username": friendship.user2.username
                }
            else:
                friendList[friendship.user2.id]={
                    "id": friendship.user1.id,
                    "username": friendship.user1.username
                }
        
        unique_friends=list(friendList.values())
        print("unique friends",unique_friends)

        serializer=FriendshipSerializer(friendships,many=True)
        return Response(unique_friends)


# Block Friend 
class BlockUserView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]

    def post(self,request):
        block_user_id=request.data.get('block_user_id')
        try:
            blocked_user=User.objects.get(id=block_user_id)
            # Remove from friends if they are friend 
            Friendship.objects.filter(
                (Q(user1=request.user) & Q(user2=blocked_user)) |
                (Q(user2=request.user) & Q(user1=blocked_user))
            ).delete()

            # add to block list 
            block,create=Blocklist.objects.get_or_create(blocker=request.user,blocked=blocked_user)
            serializer=BlockListSerializer(block)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({"error":"User does not exist"},status=status.HTTP_400_BAD_REQUEST)

class RespondToBlock(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]

    def post(self,request):
        target_user_id=request.data.get('user_id')
        action=request.data.get('action')

        if  not target_user_id and not action:
            return Response({"error":"User id and action is required"},status=status.HTTP_400_BAD_REQUEST)
        
        try:
            target_user=User.objects.get(id=target_user_id)
        except User.DoesNotExist:
            return Response({"error":"User does not exist"},status=status.HTTP_404_NOT_FOUND)
        
        action=request.data.get('action')
        if action == 'block':
            block,created=Blocklist.objects.get_or_create(blocker=request.user,blocked=target_user)
            return Response({"message":"User blocked successfully"},status=status.HTTP_200_OK)
        
        elif action=='unblock':
            deleted=Blocklist.objects.filter(blocker=request.user,blocked=target_user)
            if deleted.exists():
                deleted.delete()
                return Response({"message":"User unblocked successfully"},status=status.HTTP_200_OK)
            else:
                return Response({'message':'user was not blocked'},status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"error":"Invalid action"},status=status.HTTP_400_BAD_REQUEST)

class BlockedUserListView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]

    def get(self,request):
        blocked_users=Blocklist.objects.filter(blocker=request.user)
        serializer=BlockListSerializer(blocked_users,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)


class RemoveFriendView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def delete(self, request, friend_id):
        user = request.user
        try:
            # Sort user ids like in the save() method
            user1_id = min(user.id, friend_id)
            user2_id = max(user.id, friend_id)

            friendship = Friendship.objects.get(user1_id=user1_id, user2_id=user2_id)
            friendship.delete()
            return Response({"detail": "Friend removed successfully"}, status=status.HTTP_200_OK)

        except Friendship.DoesNotExist:
            return Response({"error": "Friendship does not exist"}, status=status.HTTP_404_NOT_FOUND)

class AddFriendView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]

    def post(self,request):
        receiver_id=request.data.get('receiver_id')
        if receiver_id==request.user.id:
            return Response({"error":"Can't send friend request to yourself"},status=status.HTTP_400_BAD_REQUEST)
        
        receiver=User.objects.get(id=receiver_id)

        if Blocklist.objects.filter(blocker=receiver,blocked=request.user).exists():
            return Response({"error":"User has blocked you"},status=status.HTTP_403_FORBIDDEN)
        
        friend_request, created = Friendrequest.objects.get_or_create(
            sender=request.user, receiver=receiver, is_pending=True
        )

        if not created:
            return Response({"detail": "Friend request already sent"}, status=status.HTTP_200_OK)
        
        return Response({"detail": "Friend request sent"}, status=status.HTTP_201_CREATED)

class FindFriendView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]

    def get(self,request):
        query=request.query_params.get('query')
        if query:
            # Search by username or email, excluding blocked users
            blocked_users=Blocklist.objects.filter(blocker=request.user).values_list('blocked',flat=True)
            users = User.objects.exclude(id__in=blocked_users).filter(
                Q(username__icontains=query) | Q(email__icontains=query)
            )
            data = [{"id": user.id, "username": user.username, "email": user.email} for user in users]
            return Response(data, status=status.HTTP_200_OK)
        return Response({"error": "Query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

class PrivateChatRoomView(viewsets.ViewSet):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def create(self,request):
        print("reqst data",request.data)
        user1=request.user
        user2_id=request.data.get('user2_id')
        print("User 1, 2 id",user1.id,user2_id)
        try:
            user2=User.objects.get(id=user2_id)
            print("USer2",user2)
        except User.DoesNotExist:
            return Response ({"error":"User not found"},status=status.HTTP_404_NOT_FOUND)

        chatroom = ChatRoom.objects.filter(
            is_group=False,
            participants=user1
        ).filter(participants=user2).first()

        print("chatroom found",chatroom)

        if not chatroom:
            sorted_users= sorted([user1.id,user2_id])
            room_name=f"{sorted_users[0]}-{sorted_users[1]}"

            chatroom , created = ChatRoom.objects.get_or_create(name=room_name, is_group=False)

            print("chatroom created",created)
            
            if created:
                chatroom.participants.add(user1, user2)  
            # Add participants to ManyToManyField


        serializer=ChatRoomSerializer(chatroom)
        return Response(serializer.data,status=status.HTTP_200_OK)


class ChatRoomMessagesView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, room_id):
        chat_room = get_object_or_404(ChatRoom, id=room_id)
        messages = Message.objects.filter(room=chat_room).order_by('timestamp')

        print(f"chatroom : {chat_room} , message: {messages} ")

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    

class SendMessageView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,room_id):
        chatroom=get_object_or_404(ChatRoom,id=room_id)
        text=request.data.get("text")
        if not text:
            return Response({"error": "Message text is required"},status=status.HTTP_400_BAD_REQUEST)
        
        participants=chatroom.participants.exclude(id=request.user.id)
        if not participants.exists():
            return Response({"error":"No valid recepient found"},status=status.HTTP_400_BAD_REQUEST)

        print("participants",participants)
        
        receiver=participants.first()
        
        print(f"chatroom: {chatroom} ,sender { request.user},receiver :{receiver},content:{text}")

        message=Message.objects.create(
            room=chatroom, 
            sender=request.user,
            receiver=receiver,
            content=text
        )
        
        send_notifications_to_user(
            sender=request.user,
            receiver=receiver,
            notif_type="message",
            content=text
        )

        serializer=MessageSerializer(message)

        return Response(serializer.data,status=status.HTTP_200_OK)
    
class MediaUploadView(APIView):
    permission_classes=[IsAuthenticated]
    parser_classes=(MultiPartParser,FormParser)
    def post(self,request,room_id,format=None):
        chatroom=get_object_or_404(ChatRoom,id=room_id)

        if not chatroom:
            return Response({"Error":"Chatroom not found"},status=status.HTTP_400_BAD_REQUEST)

        participants=chatroom.participants.exclude(id=request.user.id)

        if not participants.exists():
            return Response({"error":"Not valid receipent found "},status=status.HTTP_400_BAD_REQUEST)
        
        print("participants",participants)

        receiver=participants.first()
        media_file=request.FILES.get('media')

        print("media",media_file)

        if not media_file:
            return Response({"error":"Media file not found"},status=400)
        
        print(f"chatroom:{chatroom}, sender:{request.user} , receiver:{receiver}, media :{media_file}")

        message=Message.objects.create(
            room=chatroom,
            sender=request.user,
            receiver=receiver,
            media=media_file
        )

        send_notifications_to_user(
            sender=request.user,
            receiver=receiver,
            notif_type="media",
            content="media sent"
        )

        serializer=MessageSerializer(message)
        return Response(serializer.data,status=200)

class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        messages = Message.objects.filter(room_id=room_id).order_by('timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

class GroupChatRoomView(viewsets.ModelViewSet):
    def create(self,request):
        user=request.user
        room=ChatRoom.objects.create(name=request.data["name"],is_group=True)
        room.participants.add(user)
        serializer=ChatRoomSerializer(room)
        return Response(serializer.data,status=status.HTTP_201_CREATED)

class GroupInviteView(viewsets.ModelViewSet):
    def create(self, request, group_id):
        group_id=request.data.get("group_id")
        user_id = request.data.get("user_id")

        if not group_id or not user_id:
            return Response({"error": "group_id and user_id are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            group = ChatRoom.objects.get(id=group_id, is_group=True)
            user = User.objects.get(id=user_id)

            if request.user not in group.participants.all():
                return Response({"error": "Only group members can invite others."}, status=403)
            
            group.participants.add(user)
            return Response({"message": f"{user.username} added to group"}, status=200)
        
        except ChatRoom.DoesNotExist:
            return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class ChatAI(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request,format=None):
        message=request.data.get('message')

        if not message:
            return Response({
                "error":"message not recived"
            },status=status.HTTP_400_BAD_REQUEST)
        
        user=request.user

        if user.tokens<100:
            return Response({"error": "Not enough tokens"}, status=status.HTTP_403_FORBIDDEN)

        user.tokens-=100
        user.save()

        ai_response="This is AI response"

        ChatAIModel.objects.create(
            user=user,
            message=message,
            response=ai_response
        )

        return Response({
            "message":message,
            "response":ai_response,
            "remaining_tokens":user.tokens
        },status=status.HTTP_200_OK)

class TokenBalanceAPI(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        tokens=request.user.tokens
        return Response({
            "tokens":tokens,
        },status=status.HTTP_200_OK)

class AIChatHistory(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        chats=ChatAIModel.objects.filter(user=request.user).order_by('-timestamp')
        serializer=ChatAISerializer(chats, many=True)

        return Response(serializer.data,status=status.HTTP_200_OK)
    
import logging
logger = logging.getLogger(__name__)

def send_notifications_to_user(sender,receiver,notif_type,content):
    print("🔔 Sending notification...")
    print("Sender:", sender.username)
    print("Receiver:", receiver.username)


    try:
        channel_layer=get_channel_layer()

        notification= Notifications.objects.create(
            sender=sender,
            receiver=receiver,
            notification_type=notif_type,
            content=content
        )

        notification.save()

        logger.info(f"Notification created: {notification}")
        print(f"Notification created: {notification}")

    except Exception as e:
        logger.error(f"Error creating notification: {e}")
        print(f"Error creating notification: {e}")

    try:
        channel_layer = get_channel_layer()
        group_name = f"notifications_{receiver.id}"
        
        print("group name",group_name)

        # Sending notification to the group
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'send_notification',
                'sender': sender.username,
                'notification_type': notif_type,
                'content': content,
                'timestamp': notification.timestamp.isoformat()
            }
        )
        logger.info(f"Notification sent to group {group_name}")
        print(f"Notification sent to group {group_name}")
    except Exception as e:
        logger.error(f"Error sending notification: {e}")
        print(f"Error sending notification: {e}")


