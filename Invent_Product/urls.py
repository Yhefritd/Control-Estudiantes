from django.contrib import admin
from django.urls import path
from Invent_Product import views 

urlpatterns = [
    path('admin/', admin.site.urls),  # Agrega esta línea para habilitar el panel de administración
    path('', views.index, name='index'),  # Definimos la ruta principal
]
