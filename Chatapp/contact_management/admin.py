from django.contrib import admin
from .models import Friendrequest,Friendship,Blocklist,ChatRoom,Message,Notifications,Feedback,ChatAIModel
# Register your models here.
@admin.register(Friendrequest)
class FriendrequestAdmin(admin.ModelAdmin):
    list_display=['sender','receiver','is_accepted','is_rejected','is_pending']
    search_fields=['sender__email','receiver__email']
    list_filter=['is_accepted','is_rejected','is_pending','created_at']

@admin.register(Friendship)
class FriendshipAdmin(admin.ModelAdmin):
    list_display=['user1','user2','created_at']
    search_fields=['user1__email','user2__email']
    list_filter=['created_at']

@admin.register(Blocklist)
class BlockedlistAdmin(admin.ModelAdmin):
    list_display=['blocker','blocked','created_at']
    search_fields=['bloacker__email','blocked__email']
    list_filter=['created_at']

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display=['id','name','is_group']
    search_fields=['is_group','name']

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display=['id','sender','receiver','room','timestamp','content']
    search_fields=['sender','receiver','room']

@admin.register(Notifications)
class NotificationsAdmin(admin.ModelAdmin):
    list_display=['id','sender','receiver','notifications_type','content','is_read','timestamp']
    search_fields=['sender','receiver']

@admin.register(ChatAIModel)
class ChatAIAdmin(admin.ModelAdmin):
    list_display=['user','message','response','timestamp']
    search_fields=['user']