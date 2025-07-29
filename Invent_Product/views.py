from django.shortcuts import render
from .models import Categoria  # Asegúrate de importar tu modelo Categoria
from django.http import JsonResponse
from .models import Producto

def index(request):
    categorias = Categoria.objects.all()  # Obtener todas las categorías desde la base de datos
    return render(request, 'index.html', {'categorias': categorias})

def productos_por_categoria(request):
    categoria_nombre = request.GET.get('categoria')  # Obtener la categoría desde la URL
    productos = Producto.objects.filter(categoria__nombre_categoria=categoria_nombre)
    
    # Convertir los productos a un formato que pueda ser procesado por JavaScript
    product_data = list(productos.values('nombre_producto', 'precio', 'stock', 'categoria__nombre_categoria'))
    
    # Devolver los productos como respuesta JSON
    return JsonResponse({'products': product_data})
