from django.conf import settings
from django.core.mail import send_mail,EmailMessage
import uuid

class util:
    @staticmethod
    def send_email(data):
        email=EmailMessage(
            subject=data['subject'],
            body=data['body'],
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[data['to_email']]
        )

        email.send()
