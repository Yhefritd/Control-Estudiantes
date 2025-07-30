from django.urls import path
from Invent_Product import views

urlpatterns = [
    path('', views.index, name='index'),  # Ruta para la página principal
    path('productos_categoria/', views.productos_por_categoria, name='productos_por_categoria'),  # Filtrado por categoría
    path('buscar_producto/', views.buscar_producto, name='buscar_producto'),  # Buscar un producto
    path('agregar_producto/', views.agregar_producto, name='agregar_producto'),  # Agregar un nuevo producto
    path('editar_producto/<int:producto_id>/', views.editar_producto, name='editar_producto'),  # Editar producto
    path('eliminar_producto/<int:producto_id>/', views.eliminar_producto, name='eliminar_producto'),  # Eliminar producto
]
