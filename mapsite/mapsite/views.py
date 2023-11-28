import json
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
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


# Function to verify if user is logged in
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
        # Decode JSON data from the request body
        request_data = json.loads(request.body.decode("utf-8"))

        username = request_data.get("username")
        password1 = request_data.get("password1")
        password2 = request_data.get("password2")
        email = request_data.get("email")

        # Some manual checks to make sure the user is valid
        if password1 != password2:
            print("Passordene er ikke like")
            return Response(
                "Passwords do not match", status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(username=username).exists():
            print("Det finnes allerede en bruker med dette brukernavnet")
            return Response(
                "Username already exists", status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(email=email).exists():
            print("Det finnes allerede en bruker med denne eposten")
            return Response("Email already exists", status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(
            username=username, email=email, password=password1
        )
        # Add user to database
        user.save()
        return Response("Registration successful", status=status.HTTP_201_CREATED)


# Function to log out user
@api_view(["GET"])
def sign_out(request):
    if request.method == "GET":
        logout(request)
        return Response(status=status.HTTP_200_OK)


# Function to log in user
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
            messages.success(request, f"Hei {username.title()}, velkommen tilbake!")
            return Response(status=status.HTTP_200_OK)

        else:
            # form is not valid or user is not authenticated
            return Response(status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST", "GET"])
def submit_waste_report(request):
    if request.method == "POST":
        # Decode JSON data from the request body
        request_data = json.loads(request.body.decode("utf-8"))
        # Save as json file
        with open('common/util/waste_report_template.json', 'w') as outfile:
            json.dump(request_data, outfile, indent=4)

        # Save report to database
        # waste_report = WasteReport(report=request_data)
        # waste_report.save()

        # Since a new report has been saved, we should train the model again
        # First retrieve all reports from the database
        waste_reports = list(WasteReport.objects.all())
        reports = []
        # Transform reports to a list of dictionaries
        for waste_report in waste_reports:
            reports.append(waste_report.report)
        # Train the model
        train_waste_report(reports)
        # Predict material usage for all buildings
        # Save predictions to mapdata file
        save_predicted_material_usage()
    return Response(status=status.HTTP_200_OK)

# Method for creating and sending a waste report draft to the frontend
@api_view(["POST"])
def generate_waste_report(request):
    # Get features from request body
    request_data = json.loads(request.body.decode("utf-8"))
    # Get predictions for the building
    material_df = predict_waste_report([request_data])
    # Load Json file of waste report template
    generated_waste_report = json.load(open("common/util/waste_report_template.json"))
    # Add request data to waste report
    generated_waste_report['property']['bnr'] = request_data['bnr']
    generated_waste_report['property']['area'] = request_data['area']
    generated_waste_report['property']['stories'] = request_data['stories']
    generated_waste_report['property']['building_year'] = request_data['building_year']
    material_df = material_df.astype(float)
    # Add material data to waste report
    for col in material_df.columns:
        material_value = material_df[col].values[0]
        # Round to 2 decimals
        material_value = round(material_value, 2)
        # Get types of data from splitting column name
        # This enables easy addition of new material types in the future
        waste_type = col.split('_')[0]
        material_type = col.split('_')[1]
        waste_or_recycled = col.split('_')[2]
        generated_waste_report[waste_type][material_type][waste_or_recycled]['amount'] = material_value
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

# This function was used to save locally generated waste reports to the database
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
