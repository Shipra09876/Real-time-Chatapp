"""
ASGI config for Chatapp project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os,django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack
import contact_management.routing       
from contact_management.middleware import TokenAuthMiddleware


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Chatapp.settings')
# print("DJANGO_SETTINGS_MODULE:", os.environ.get('DJANGO_SETTINGS_MODULE'))
django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    # Add WebSocket or other protocols here
    "websocket":TokenAuthMiddleware(
        URLRouter(
            contact_management.routing.websocket_urlpatterns
        )
    ),
})

# ASGI_APPLICATION = 'Chatapp.asgi.application'
