from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
def index_views(request):
    return render(request,"index.html")

def login_views(request):
    return render(request,"login.html")

def register_views(request):
    return render(request,"register.html")