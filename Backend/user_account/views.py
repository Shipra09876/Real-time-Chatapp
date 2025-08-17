from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from user_account.serializers import *
from django.contrib.auth import authenticate
from user_account.renderers import UserRenderer
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
import logging
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view


# to generate the token manually 
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegister(APIView):
    renderer_classes = [UserRenderer]
    permission_classes=[AllowAny]
    def post(self,request,format=None):
        serializer=UserRegisterationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user=serializer.save()   
            token=get_tokens_for_user(user)  

            return Response({"token":token,"tokens":user.tokens, 'msg':'Registration successfully'},status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class UserLogin(APIView):
    renderer_classes = [UserRenderer]
    permission_classes=[AllowAny]
    def post(self,request,format=None):
        serializer=UserLoginSerializers(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email=serializer.data.get('email')
            password=serializer.data.get('password')
            user=authenticate(email=email,password=password)

            if user is not None:
                token=get_tokens_for_user(user)
                user_data=UserLoginSerializers(user).data
                return Response({"token":token,"user": user_data, 'msg':"login successfully" },status=status.HTTP_200_OK)
            else:
                return Response({'error':{'non_field_errors':['email and password are not Valid']}},status=status.HTTP_400_BAD_REQUEST) 
            
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

# to get the profile by token  

logger = logging.getLogger(__name__)
class UserProfileView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def get(self,request,format=None):
        serializer=UserProfileSerializer(request.user)
        return Response(serializer.data,status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class UserChangePasswordView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]

    def post(self,request,format=None):
        serializer=UserChangePasswordSerializer(data=request.data,context={'user':request.user})

        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'password change successfully'},status=status.HTTP_200_OK)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class SendPasswordResetEmailView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[AllowAny]
    def post(self,request,format=None):
        serializer=SendPasswordResetEmailSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'Password Reset Email link send successfully , please check email'},status=status.HTTP_200_OK)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    
class UserPasswordResetView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[AllowAny]

    def post(self,request,uid,token,format=None):
        serializer=UserResetPasswordSerializers(data=request.data,context={'uid':uid,'token':token})

        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'Password Reset successfully'},status=status.HTTP_200_OK)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]

    def post(self,request,format=None,):
        serializer=UserLogoutSerializer(data=request.data)

        if serializer.is_valid():
            try:
                refresh_token=serializer.validated_data['refresh']
                token=RefreshToken(refresh_token)

                token.blacklist()

                return Response({'msg':'Logout Successful'},status=status.HTTP_200_OK)
            
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_205_RESET_CONTENT)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)  
    
    