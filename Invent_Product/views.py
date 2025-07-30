
from django.shortcuts import render
from django.http import JsonResponse
from .models import Categoria, Producto
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

@csrf_exempt
@require_POST
def eliminar_producto(request, producto_id):
    try:
        producto = Producto.objects.get(id=producto_id)
        producto.delete()
        return JsonResponse({'success': True})
    except Producto.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Producto no encontrado'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

def index(request):
    categorias = Categoria.objects.all()
    return render(request, 'index.html', {'categorias': categorias})

def productos_por_categoria(request):
    categoria_nombre = request.GET.get('categoria')
    productos = Producto.objects.filter(categoria__nombre_categoria=categoria_nombre)
    product_data = [
        {
            'id': p.id,
            'nombre_producto': p.nombre_producto,
            'precio': float(p.precio),
            'stock': p.stock,
            'categoria__nombre_categoria': p.categoria.nombre_categoria
        }
        for p in productos
    ]
    return JsonResponse({'products': product_data})

def buscar_producto(request):
    nombre = request.GET.get('nombre', '')
    productos = Producto.objects.filter(nombre_producto__icontains=nombre)
    product_data = [
        {
            'id': p.id,
            'nombre_producto': p.nombre_producto,
            'precio': float(p.precio),
            'stock': p.stock,
            'categoria__nombre_categoria': p.categoria.nombre_categoria
        }
        for p in productos
    ]
    return JsonResponse({'products': product_data})

@csrf_exempt
def agregar_producto(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        nombre = data.get('nombre_producto')
        categoria_nombre = data.get('categoria')
        stock = int(data.get('stock'))
        precio = float(data.get('precio'))
        categoria = Categoria.objects.get(nombre_categoria=categoria_nombre)
        producto = Producto.objects.create(
            nombre_producto=nombre,
            categoria=categoria,
            stock=stock,
            precio=precio
        )
        return JsonResponse({'success': True, 'id': producto.id})
    return JsonResponse({'success': False}, status=400)

@csrf_exempt
def editar_producto(request, producto_id):
    if request.method in ['POST', 'PUT']:
        try:
            data = json.loads(request.body)
            nombre = data.get('nombre_producto')
            categoria_nombre = data.get('categoria')
            stock = int(data.get('stock'))
            precio = float(data.get('precio'))
            producto = Producto.objects.get(id=producto_id)
            categoria = Categoria.objects.get(nombre_categoria=categoria_nombre)
            producto.nombre_producto = nombre
            producto.categoria = categoria
            producto.stock = stock
            producto.precio = precio
            producto.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Método no permitido'}, status=405)

