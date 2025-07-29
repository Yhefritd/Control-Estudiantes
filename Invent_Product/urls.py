from django.urls import path
from Invent_Product import views

urlpatterns = [
    path('', views.index, name='index'),
    path('productos_categoria/', views.productos_por_categoria, name='productos_por_categoria'),
]

