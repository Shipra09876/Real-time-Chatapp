from channels.consumer import SyncConsumer
from channels.consumer import AsyncConsumer
from time import sleep
import asyncio,json
from asgiref.sync import async_to_sync
from channels.exceptions import StopConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message,ChatRoom,Notifications
from django.contrib.auth import get_user_model
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async

User = get_user_model()

channel_layer = get_channel_layer()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f"chat_{self.room_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    @staticmethod
    async def get_user(email):
        try:
            user = await User.objects.filter(email=email).afirst()
            if not user:
                print(f"User not found with email: {email}")
            return user
        except Exception as e:
            print("Error in get_user:", e)
            return None

    @staticmethod
    async def save_message(sender, message, room_id):
        room = await ChatRoom.objects.filter(id=room_id).afirst()
        receiver = await room.participants.exclude(id=sender.id).afirst()
        return await Message.objects.acreate(
            sender=sender,
            receiver=receiver,
            room=room,
            content=message
        )


    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            print("Received data:", data)  # Debugging
            message = data.get('message')
            sender_username = data.get('sender') or self.scope["user"].username

            
            # Save message to DB
            sender = await self.get_user(sender_username)
            if sender is None:
                print("Sender user not found. Aborting message save.")
                return
            new_message = await self.save_message(sender, message, self.room_id)
            print("New message",new_message)
            # Send message to WebSocket
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": new_message.content,
                    "sender": sender.username,
                    "receiver": new_message.receiver.username,
                    "timestamp": str(new_message.timestamp)
                }
            )
            print("Sent to group:", self.room_group_name)

        except Exception as e:
            print("Error in receive:", e)
            print("Raw text_data:", text_data)

    async def chat_message(self, event):
        print("broadcast to websocket",event)
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
            "receiver": event["receiver"],
            "timestamp": event["timestamp"],
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def notify_user(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
            "room": event["room"]
        }))

import logging
logger = logging.getLogger(__name__)
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
            self.user = self.scope['user']
            if self.user:
                self.group_name = f"notifications_{self.user.id}"
                print(f"User scope ID: {self.user.id}, Group name: notifications_{self.user.id}")

                await self.channel_layer.group_add(
                    self.group_name,
                    self.channel_name
                )
                await self.accept()
                await self.send(text_data=json.dumps({
                    "type": "connection_success",
                    "message": "WebSocket connected!"
                }))

            else:
                await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
            )


    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)

        if data.get('type') == 'mark_read':
            await self.mark_notification_read(data['notification_id'])

    async def send_notification(self,event):
        print("Consumer received event:", event)
        await self.send(text_data=json.dumps({
        'type': 'send_notification',
        'sender': event.get('sender'), 
        'notification_type': event.get('notification_type'),
        'content': event.get('content'),
        'timestamp': event.get('timestamp')
    }))
        
    
    @database_sync_to_async
    def mark_notification_read(self,notif_id):
        try:
            notif=Notifications.objects.get(id=notif_id, receiver=self.user)
            notif.is_read=True
            notif.save()
        except Notifications.DoesNotExist:
            pass

    async def notify_user(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
            "room": event["room"]
        }))

