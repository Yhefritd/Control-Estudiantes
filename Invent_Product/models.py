from django.db import models

# Aca creamos las tablas para la base de datos

class Categoria(models.Model):
    nombre_categoria = models.CharField(max_length=100) #Almacena cadenas de texto CharField

class Producto(models.Model):
    nombre_producto = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits= 10, decimal_places= 2)
    stock = models.PositiveIntegerField()
    categoria = models.ForeignKey(Categoria, on_delete= models.CASCADE) 

class Proveedor(models.Model):
    nombre_proveedor = models.CharField(max_length=100)
    contacto = models.CharField(max_length=100)
    direccion = models.TextField()
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)

class Cliente(models.Model):
    nombre_cliente = models.CharField(max_length=100)
    correo = models.EmailField()
    telefono = models.PositiveIntegerField()
    
class Venta(models.Model):
    fecha_venta = models.DateTimeField(auto_now_add=True)
    cantidad = models.PositiveIntegerField()
    total = models.DecimalField(max_digits= 10, decimal_places=2)
    producto = models.ForeignKey(Producto, on_delete= models.CASCADE)
    cliente = models.ForeignKey(Cliente, on_delete= models.CASCADE)
