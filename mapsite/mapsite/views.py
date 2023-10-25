import json

from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
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

@api_view(['GET'])
def check_login(request):
    if request.method == "GET":
        if request.user.is_authenticated:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def register_user(request):
    if request.method == "POST":
        #print(request.body)
        # Decode JSON data from the request body
        request_data = json.loads(request.body.decode('utf-8'))

        username = request_data.get("username")
        password1 = request_data.get("password1")
        password2 = request_data.get("password2")
        email = request_data.get("email")
        #form = UserCreationForm(request.POST)

        """
        # Get all usernames
        usernames = User.objects.values_list('username', flat=True)
        # Get all emails
        emails = User.objects.values_list('email', flat=True)
        print(usernames)
        print(emails)
        if form.is_valid():
            print('utrolig')
            form.save()
            return Response('Registration successful', status=status.HTTP_201_CREATED)

        """
        if password1 != password2:
            print('Passwords do not match')
            return Response('Passwords do not match', status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            print('Username already exists')
            return Response('Username already exists', status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            print('Email already exists')
            return Response('Email already exists', status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, email=email, password=password1)
        user.save()
        return Response('Registration successful', status=status.HTTP_201_CREATED)



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

          
@api_view(['GET'])
def send_json(request):
    if request.method == "GET":
        f = open('geoJSON/finalJson.json')
        data = json.load(f)
        return JsonResponse(data, status=status.HTTP_200_OK)

@api_view(['POST'])
def predict_materials(request):
    if request.method == "POST":
        # Decode JSON data from the request body
        request_data = json.loads(request.body.decode('utf-8'))

        # Load JSON data
        with open('train.json', 'r') as file:
            data = json.load(file)
            df = pd.DataFrame(data["data"])