from  . models import Tool
from rest_framework import serializers
from .models import SliderImage
from django.contrib.auth.models import User
from .models import Feedback
from .models import Product, Order, OrderItem
from .models import UserProfile

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

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name', 'patronymic', 'birthdate']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        instance.email = validated_data.get('email', instance.email)
        instance.save()

        profile.first_name = profile_data.get('first_name', profile.first_name)
        profile.last_name = profile_data.get('last_name', profile.last_name)
        profile.patronymic = profile_data.get('patronymic', profile.patronymic)
        profile.birthdate = profile_data.get('birthdate', profile.birthdate)
        profile.save()

        return instance


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







