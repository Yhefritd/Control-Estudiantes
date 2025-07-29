from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),  # Agrega esta línea para habilitar el panel de administración
    path('', include('Invent_Product.urls'))
]