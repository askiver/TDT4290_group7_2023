from django.http import HttpResponse


def index(request):
    return HttpResponse("Current logged in user is " + request.user.username + ".")