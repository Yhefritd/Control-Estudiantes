# views.py
from django.shortcuts import render

# Vista principal para la página de inicio
def index(request):
    return render(request, 'index.html')  # Renderiza la plantilla index.html
