from rest_framework import serializers
from .models import Friendrequest, Friendship , Blocklist,ChatRoom,Message,Notifications,ChatAIModel
from user_account.models import User

class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','email','first_name','last_name','profile_picture']

class FriendRequestSerializer(serializers.ModelSerializer):
    sender=UserSerializers(read_only=True)
    receiver=UserSerializers(read_only=True)

    class Meta:
        model=Friendrequest
        fields=['id','sender','receiver','created_at','is_accepted','is_rejected','is_pending']
    
class FriendshipSerializer(serializers.ModelSerializer):
    user1=UserSerializers(read_only=True)
    user2=UserSerializers(read_only=True)

    class Meta:
        model=Friendship
        fields=['id','user1','user2','created_at']

    
class BlockListSerializer(serializers.ModelSerializer):
    blocker=UserSerializers(read_only=True)
    blocked=UserSerializers(read_only=True)
    class Meta:
        model=Blocklist
        fields=['id','blocker','blocked','created_at']

class ChatRoomSerializer(serializers.ModelSerializer):
    participants=UserSerializers(many=True)
    is_group=serializers.BooleanField(read_only=True)

    class Meta:
        model=ChatRoom
        fields=['id','name','is_group','participants']

class MessageSerializer(serializers.ModelSerializer):
    sender=UserSerializers(read_only=True)
    receiver=UserSerializers(read_only=True)
    room=serializers.PrimaryKeyRelatedField(queryset=ChatRoom.objects.all())
    
    class Meta:
        model=Message
        fields=['id','sender','receiver','room','content','media','timestamp']
    
    def get_media_url(self, obj):
        if obj.media:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.media.url)
        return None

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model=Notifications
        fields='__all__'
    
class ChatAISerializer(serializers.ModelSerializer):
    class Meta:
        model=ChatAIModel
        fields='__all__'