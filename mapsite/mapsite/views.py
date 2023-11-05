import json
import pandas as pd
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
from common.util.utility_functions import (
    predict_waste_report,
    train_waste_report,
    save_predicted_material_usage,
    handle_float32,
)
from mapsite.models import WasteReport


def index(request):
    print("testing")
    return HttpResponse("Current logged in user is " + request.user.username + ".")


@api_view(["GET"])
def check_login(request):
    if request.method == "GET":
        if request.user.is_authenticated:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
def register_user(request):
    if request.method == "POST":
        # print(request.body)
        # Decode JSON data from the request body
        request_data = json.loads(request.body.decode("utf-8"))

        username = request_data.get("username")
        password1 = request_data.get("password1")
        password2 = request_data.get("password2")
        email = request_data.get("email")
        # form = UserCreationForm(request.POST)

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
            print("Passwords do not match")
            return Response(
                "Passwords do not match", status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(username=username).exists():
            print("Username already exists")
            return Response(
                "Username already exists", status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(email=email).exists():
            print("Email already exists")
            return Response("Email already exists", status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(
            username=username, email=email, password=password1
        )
        user.save()
        return Response("Registration successful", status=status.HTTP_201_CREATED)


@api_view(["GET"])
def sign_out(request):
    if request.method == "GET":
        logout(request)
        return Response(status=status.HTTP_200_OK)


@api_view(["POST"])
def sign_in(request):
    print("test")
    if request.method == "POST":
        # Decode JSON data from the request body
        request_data = json.loads(request.body.decode("utf-8"))

        username = request_data.get("username")
        password = request_data.get("password")
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            messages.success(request, f"Hi {username.title()}, welcome back!")
            return Response(status=status.HTTP_200_OK)

        else:
            # form is not valid or user is not authenticated
            return Response(status=status.HTTP_401_UNAUTHORIZED)


@api_view(["GET"])
def send_json(request):
    if request.method == "GET":
        f = open("geoJSON/finalJson.json")
        data = json.load(f)
        return JsonResponse(data, status=status.HTTP_200_OK)


@api_view(["POST", "GET"])
def submit_waste_report(request):
    if request.method == "POST":
        # Decode JSON data from the request body
        request_data = json.loads(request.body.decode("utf-8"))
        # Save report to database
        waste_report = WasteReport(report=request_data)
        waste_report.save()

        # Since a new report has been saved, we should train the model again
        # First retrieve all reports from the database
        reports = list(WasteReport.objects.all())
        # Train the model
        train_waste_report(reports)
        # Predict material usage for all buildings
        # predictions = predict_waste_report()
        # Save predictions to mapdata file
        save_predicted_material_usage()

    if request.method == "GET":
        # Since a new report has been saved, we should train the model again
        # First retrieve all reports from the database
        waste_reports = list(WasteReport.objects.all())
        # Print a report
        # Create a list of all reports
        reports = []
        for waste_report in waste_reports:
            reports.append(waste_report.report)

        # Train the model
        train_waste_report(reports)
        # Predict material usage for all buildings
        # predictions = predict_waste_report()
        # Save predictions to mapdata file
        save_predicted_material_usage()
    return Response(status=status.HTTP_200_OK)


@api_view(["POST"])
def generate_waste_report(request):
    # Get features from request body
    request_data = json.loads(request.body.decode("utf-8"))
    material_df = predict_waste_report(request_data)
    # Load Json file of waste report template
    generated_waste_report = json.load(open("common/util/waste_report_template.json"))
    pd.set_option('display.max_columns', None)
    # Add request data to waste report
    generated_waste_report['property']['bnr'] = request_data['bnr']
    generated_waste_report['property']['area'] = request_data['area']
    generated_waste_report['property']['stories'] = request_data['stories']
    generated_waste_report['property']['building_year'] = request_data['building_year']
    # Add material data to waste report
    for col in material_df.columns:
        material_value = material_df[col].values[0]
        waste_type = col.split('_')[0]
        material_type = col.split('_')[1]
        waste_or_recycled = col.split('_')[2]
        generated_waste_report[waste_type][material_type][waste_or_recycled] = material_value
        # Also add to the total amount of materials
        generated_waste_report[waste_type][material_type]['amountTotal'] += material_value
    # Send waste report back to frontend
    response = JsonResponse(
        generated_waste_report,
        safe=False,  # Use `safe=False` if `generated_waste_report` is not a dict
        status=200,
        json_dumps_params={'default': handle_float32}
    )
    return response


@api_view(["GET"])
def test_file_save(request):
    # save_predicted_material_usage("cool")
    # Get a waste report
    waste_report = WasteReport.objects.all()[0]
    # Print report
    print(waste_report.report[0])
    return Response(status=status.HTTP_200_OK)


@api_view(["GET"])
def generated_waste_reports_to_DB(request):
    for i in range(1, 736):
        filepath = r"D:\Users\Luka\Documents\Studie\MTDT-5.Semester\KundestyrtProsjekt\data\wasteReport\wasteReportGENERATED{j}.json".format(
            j=str(i)
        )
        with open(filepath, "r") as file:
            data = json.load(file)
            waste_report = WasteReport(report=data)
            waste_report.save()

    return Response(status=status.HTTP_200_OK)
