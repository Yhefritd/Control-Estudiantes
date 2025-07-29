from django.db import models


# Aca creamos las tablas para la base de datos

class Categoria(models.Model):
    nombre_categoria = models.CharField(max_length=100) 
    def __str__(self):
        return self.nombre_categoria

class Producto(models.Model):
    nombre_producto = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits= 10, decimal_places= 2)
    stock = models.PositiveIntegerField()
    categoria = models.ForeignKey(Categoria, on_delete= models.CASCADE) 
    def __str__(self):
        return self.nombre_producto +' > ' + self.categoria.nombre_categoria

class Proveedor(models.Model):
    nombre_proveedor = models.CharField(max_length=100)
    telefono_proveedor = models.CharField(max_length=9)
    direccion = models.TextField()
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    def __str__(self):
        return self.nombre_proveedor + ' - ' + self.producto.nombre_producto

class Cliente(models.Model):
    nombre_cliente = models.CharField(max_length=100)
    correo = models.EmailField()
    telefono_cliente = models.CharField(max_length=9)
    def __str__(self):
        return self.nombre_cliente
    
class Venta(models.Model):
    fecha_venta = models.DateTimeField(auto_now_add=True)
    cantidad = models.PositiveIntegerField()
    total = models.DecimalField(max_digits= 10, decimal_places=2)
    producto = models.ForeignKey(Producto, on_delete= models.CASCADE)
    cliente = models.ForeignKey(Cliente, on_delete= models.CASCADE)
    def __str__(self):
        return self.producto.nombre_producto + ' > '+ self.cliente.nombre_cliente 