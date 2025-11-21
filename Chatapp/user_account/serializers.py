from rest_framework import serializers
from user_account.models import User
from django.contrib.auth import get_user_model
from xml.dom import VALIDATION_ERR
import uuid
from django.utils.encoding import smart_str,force_bytes,DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .utils import util

User = get_user_model()

class UserRegisterationSerializer(serializers.ModelSerializer):
    password2=serializers.CharField(style={'input_type':'password'},write_only=True)
    class Meta:
        model=User
        fields=['username','email','first_name','last_name','password','password2','tc']
        extra_kwargs={
            'password':{'write_only':True}
        }


    def validate(self,attrs):
        password=attrs.get('password')
        password2=attrs.get('password2')
        if password!=password2:
            raise serializers.ValidationError('password and confirm password are not same')
        return attrs
    
    def create(self,validate_data):
        validate_data.pop("password2")
        user=User.objects.create_user(**validate_data)
        user.tokens=4000
        return user
    

class UserLoginSerializers(serializers.ModelSerializer):
    email=serializers.EmailField(max_length=100)
    class Meta:
        model=User
        fields=['id','email','password']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','first_name','last_name','profile_picture','email']

class UserChangePasswordSerializer(serializers.ModelSerializer):
    password=serializers.CharField(max_length=10,min_length=4,style={'input_type':'password'},write_only=True)
    password2=serializers.CharField(max_length=10,min_length=4,style={'input_type':'password'},write_only=True)

    class Meta:
        model=User
        fields=['password','password2']

    def validate(self, attrs):
        password=attrs.get('password')
        password2=attrs.get('password2')
        user=self.context.get('user')

        if password!=password2:
            raise serializers.ValidationError('password and confirm password does not match')

        user.set_password(password)
        user.save()
        return attrs
    

class SendPasswordResetEmailSerializer(serializers.ModelSerializer):
    email=serializers.EmailField(max_length=255)
    class Meta:
        model=User
        fields=['email']

    def validate(self, attrs):
        email=attrs.get('email')
        if User.objects.filter(email=email).exists():
            user=User.objects.get(email=email)
            uid=urlsafe_base64_encode(force_bytes(user.id))
            print('encoded uid',uid)
            token=PasswordResetTokenGenerator().make_token(user)
            print('generated token',token)
            link='http://localhost:3000/reset_password/'+uid+'/'+token
            print('password reset link',link)

            body='Click following to reset password '+link  
            data={
                'subject':"Reset Your Password",
                'body':body,
                'to_email':user.email
            }

            # send email
            util.send_email(data)
            return attrs
        else:
            raise VALIDATION_ERR('You are not registered user')


class UserResetPasswordSerializers(serializers.ModelSerializer):
    password=serializers.CharField(max_length=10,min_length=4,style={'input_type':'password'},write_only=True)
    password2=serializers.CharField(max_length=10,min_length=4,style={'input_type':'password'},write_only=True)

    class Meta:
        model=User
        fields=['password','password2']

    def validate(self, attrs):
        try:

            password=attrs.get('password')
            password2=attrs.get('password2')
            uid=self.context.get('uid')
            token=self.context.get('token')

            if password!=password2:
                raise serializers.ValidationError('password and confirm password does not match')
            
            id=smart_str(urlsafe_base64_decode(uid))
            user=User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user,token):
                raise VALIDATION_ERR('token is not valid or expired')
            
            user.set_password(password)
            user.save()
            return attrs
        
        except DjangoUnicodeDecodeError as identifier:
            PasswordResetTokenGenerator().check_token(user,token)
            raise VALIDATION_ERR('token is not valid or expired')
            

class UserLogoutSerializer(serializers.ModelSerializer):
    refresh=serializers.CharField()

    class Meta:
        model=User
        fields=['refresh']
    
    def validate(self, attrs):
        refresh=attrs.get('refresh')

        if not refresh:
            raise serializers.ValidationError('Refresh token is required for logout')
        
        return attrs
    

