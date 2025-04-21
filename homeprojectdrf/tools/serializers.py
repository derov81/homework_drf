from  . models import Tool
from rest_framework import serializers
from .models import SliderImage
from django.contrib.auth.models import User
from .models import Feedback
from .models import Product, Order, OrderItem

class ToolSeralizer(serializers.ModelSerializer):
    image_url = serializers.ImageField(required=False)
    product_id = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True, required=False)

    class Meta:
        model = Tool
        fields = '__all__'  # Включает 'price' только если оно явно указано в fields, иначе добавь сюда

    def get_product_id(self, obj):
        try:
            return obj.product.id
        except:
            return None

    def create(self, validated_data):
        price = validated_data.pop('price', None)
        tool = Tool.objects.create(**validated_data)
        if price is not None:
            Product.objects.create(
                tool=tool,
                name=tool.brand_tool,
                price=price
            )
        return tool

class SliderImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SliderImage
        fields = ['__all__']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'date_joined']


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'





