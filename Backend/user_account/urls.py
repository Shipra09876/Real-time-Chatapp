from django.contrib import admin
from django.urls import path,include
from user_account.views import UserRegister,UserLogin,UserProfileView,UserChangePasswordView,SendPasswordResetEmailView,UserPasswordResetView,UserLogoutView
from rest_framework_simplejwt.views import (
    TokenObtainSlidingView,
    TokenRefreshSlidingView,
)

urlpatterns = [
    path('register/',UserRegister.as_view(),name='register'),
    path('login/',UserLogin.as_view(),name='login'),
    path('profile/',UserProfileView.as_view(),name='profile'),
    path('change_password/',UserChangePasswordView.as_view(),name='change_password'),
    path('send_reset_password_email/',SendPasswordResetEmailView.as_view(),name='send-reset-password-email'),
    path('reset_password/<str:uid>/<str:token>/',UserPasswordResetView.as_view(),name='reset-password'),
    path('logout/',UserLogoutView.as_view(),name='reset-password'),
    path('token/', TokenObtainSlidingView.as_view(), name='token_obtain'),
    path('token/refresh/', TokenRefreshSlidingView.as_view(), name='token_refresh'),

]

'''
send reset password -> reset password 
backend - /
frontend -  
'''


# 4 -> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoic2xpZGluZyIsImV4cCI6MTczMTY4OTI0NCwiaWF0IjoxNzMxNjg4OTQ0LCJqdGkiOiI5ZTUwYzBiMzVhNjU0MTBjYTg2ODhkYjQ0MTgzNzQ4YyIsInJlZnJlc2hfZXhwIjoxNzMxNzc1MzQ0LCJ1c2VyX2lkIjo0fQ.PYECbve_9xfXu7LXssXLqD4guVwGpOJsZB4KT0kjf8c