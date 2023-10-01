import json

from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views import generic
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


def index(request):
    print("testing")
    return HttpResponse("Current logged in user is " + request.user.username + ".")


@api_view(['POST'])
def register_user(request):
    if request.method == "POST":
        # Decode JSON data from the request body
        request_data = json.loads(request.body.decode('utf-8'))

        username = request_data.get("username")
        password = request_data.get("password")
        email = request_data.get("email")

        if username and password and email:
            # Create user
            user = User.objects.create_user(username, email, password)
            user.save()
            return Response(status=status.HTTP_201_CREATED)

        else:
            # form is not valid or user is not authenticated
            return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def sign_out(request):
    if request.method == "GET":
        logout(request)
        return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
def sign_in(request):
    print('test')
    if request.method == "POST":
        # Decode JSON data from the request body
        request_data = json.loads(request.body.decode('utf-8'))

        username = request_data.get("username")
        password = request_data.get("password")
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            messages.success(request, f'Hi {username.title()}, welcome back!')
            return Response(status=status.HTTP_200_OK)

        else:
            # form is not valid or user is not authenticated
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class SignUpView(generic.CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"
