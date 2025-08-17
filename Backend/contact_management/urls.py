from django.contrib import admin
from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainSlidingView,
    TokenRefreshSlidingView,
)

router=DefaultRouter()
router.register(r'chat-room/private',PrivateChatRoomView,basename="private_chat_room")
router.register(r'chat-room/group',GroupChatRoomView,basename='Group_chat_room')
router.register(r'chat-room/group/invite',GroupInviteView,basename='Group_chat_room_invite')

urlpatterns = [
    path('friend-request/',SendFriendRequestView.as_view(),name='send_friend_request'),
    path('friend-request/view/',ViewFriendRequestView.as_view(),name='friend_request_view'),
    path('friend-requests/respond/<int:request_id>/',RespondFriendRequestView.as_view(),name='respond_friend_request'),
    path('friends/',FriendListView.as_view(),name='send_friend_request'),
    path('friends/<int:friend_id>/', RemoveFriendView.as_view(), name='remove_friend'),
    
    path('block-user/', BlockUserView.as_view(), name='block_user'),
    path('blocked-users/', BlockedUserListView.as_view(), name='blocked_users'),
    path('block-requests/respond/',RespondToBlock.as_view(),name='block user response'),
    
    path('find-friend/', FindFriendView.as_view(), name='find_friend'),
    path('add-friend/', AddFriendView.as_view(), name='add_friend'),
    
    path('chat-room/message/<int:room_id>/',ChatRoomMessagesView.as_view(),name='fetch_mesaage'),
    path('chat-room/send/<int:room_id>/',SendMessageView.as_view(),name='send message'),
    path('chat/<int:room_id>/media/',MediaUploadView.as_view(),name='media upload'),


    path('', include(router.urls)),
    path('token/', TokenObtainSlidingView.as_view(), name='token_obtain'),
    path('token/refresh/', TokenRefreshSlidingView.as_view(), name='token_refresh'),
    
    path('chat_ai/',ChatAI.as_view(),name="AI-Chat"),
    path("token_balance/",TokenBalanceAPI.as_view(),name="token-balance"),
    path("chat_ai_history/",AIChatHistory.as_view(),name="AI-chat-history"),

]


