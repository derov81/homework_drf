from django.db import models
from django.contrib.auth.models import User

class Tool(models.Model):
    brand_tool = models.CharField(max_length=60)
    type_tool = models.CharField(max_length=60)
    diametr = models.IntegerField()
    working_length_tool = models.IntegerField()
    length_tool = models.IntegerField()
    material_of_detail = models.CharField(max_length=60)
    material_of_tool = models.CharField(max_length=60)
    short_description = models.CharField(max_length=150, null=True)
    description = models.TextField(null=True)
    image_url = models.ImageField(upload_to='images', blank=True, null=True, default='images/nophoto.jpg')


    def __str__(self):
        return (f'{self.brand_tool}-{self.type_tool}-{self.diametr} | {self.working_length_tool}mm | {self.length_tool}mm'
                f'| {self.material_of_detail}| {self.material_of_tool}| {self.short_description}'
                f'| {self.description}| {self.image_url}')

class Feedback(models.Model):
    STATUS_CHOICES = [
        ('new', 'Новая'),
        ('answered', 'Отвечено'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    attachment = models.FileField(upload_to='attachments/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    reply_message = models.TextField(null=True, blank=True)
    reply_attachment = models.FileField(upload_to='replies/', null=True, blank=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.status})"

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', blank=True, null=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_ordered = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product.name} x{self.quantity}"


class SliderImage(models.Model):
    image = models.ImageField(upload_to='slider_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image {self.image} | {self.uploaded_at}"


