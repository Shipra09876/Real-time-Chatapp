from django.db import models
from user_account.models import User
from django.conf import settings

# Create your models here.
User=settings.AUTH_USER_MODEL

class Friendrequest(models.Model):
    sender=models.ForeignKey(User,related_name='send_request',on_delete=models.CASCADE)
    receiver=models.ForeignKey(User,related_name='received_request',on_delete=models.CASCADE)
    created_at=models.DateTimeField(auto_now_add=True)
    is_accepted=models.BooleanField(default=False)
    is_rejected=models.BooleanField(default=False)
    is_pending= models.BooleanField(default=True)

    def __str__(self) -> str:
        return f'Friend request from {self.sender} to {self.receiver}'

class Friendship(models.Model):
    user1=models.ForeignKey(User,related_name='friendship_initiated',on_delete=models.CASCADE)
    user2=models.ForeignKey(User,related_name='friendship_received',on_delete=models.CASCADE)
    created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user1','user2'], name='unique_friendship')
        ]

    def save(self, *args, **kwargs):
        # Always store smaller user ID as user1
        if self.user1.id > self.user2.id:
            self.user1, self.user2 = self.user2, self.user1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Friendhsip between {self.user1.email} and {self.user2.email}"

class Blocklist(models.Model):
    blocker=models.ForeignKey(User,related_name='blocked_users',on_delete=models.CASCADE)
    blocked=models.ForeignKey(User,related_name='blocked_by',on_delete=models.CASCADE)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.blocker.email} blocked {self.blocked.email}"

class ChatRoom(models.Model):
    name=models.CharField(max_length=100)
    is_group=models.BooleanField(default=False)
    participants=models.ManyToManyField(User,related_name="chat_rooms")

class Message(models.Model):
    sender=models.ForeignKey(User,on_delete=models.CASCADE,related_name="sent_messages")
    receiver=models.ForeignKey(User,on_delete=models.CASCADE,related_name="received_messages")
    room=models.ForeignKey(ChatRoom,on_delete=models.CASCADE,related_name="room_messages")
    media=models.FileField(upload_to='Chat_media/',blank=True,null=True)
    timestamp=models.DateTimeField(auto_now_add=True)
    content=models.TextField()

    def __str__(self):
        return f"{self.sender}: {self.content} "

class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Notifications(models.Model):
    NOTIFICATION_TYPE = (
        ('message','Message'),
        ('friend request', 'Friend request'),
        ('friend_accept', 'Friend Request Accepted'),
        ('online', 'User online'),
        ('offline', 'User offline'),
    )

    sender = models.ForeignKey(User, related_name='sender_notifications', on_delete=models.CASCADE)

    receiver=models.ForeignKey(User, null=True, blank=True , on_delete= models.SET_NULL)

    notifications_type=models.CharField(max_length=20, choices=NOTIFICATION_TYPE)
    
    content=models.TextField(blank=True)
    is_read=models.BooleanField(default=False)
    timestamp=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.notifications_type} from {self.sender} to {self.receiver} " 

class ChatAIModel(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="Chat_AI")
    message=models.TextField()
    response=models.TextField()
    timestamp=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} at {self.timestamp}"