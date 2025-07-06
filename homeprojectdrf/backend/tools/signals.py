from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Tool, Product

# @receiver(post_save, sender=Tool)
# def create_product_for_tool(sender, instance, created, **kwargs):
#     """Создаём Product при создании нового Tool"""
#     if created:
#         # Создание связанного продукта
#         Product.objects.create(
#             tool=instance,
#             name=instance.brand_tool,
#             price=0
#         )