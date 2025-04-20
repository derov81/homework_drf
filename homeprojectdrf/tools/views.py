import django_filters
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from  . models import Tool
from .serializers import ToolSeralizer
from rest_framework import viewsets
from rest_framework import filters
from .permissions import CustomPermission
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework import generics
from .models import SliderImage
from .serializers import SliderImageSerializer
from .serializers import UserSerializer
from django.contrib.auth.models import User
from .models import Feedback
from .serializers import FeedbackSerializer
from django.core.mail import EmailMessage, send_mail
from .models import Product, Order, OrderItem
from .serializers import ProductSerializer, OrderSerializer



class ToolViewSet(viewsets.ModelViewSet):
    queryset = Tool.objects.all()
    serializer_class = ToolSeralizer
    permission_classes = [CustomPermission]
    filter_backends = [filters.SearchFilter]  #[filters.OrderingFilter]
    #filterset_class = ToolFilter
    search_fields = ['__all__']


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({'message': 'Это защищенный эндпоинт'})


@api_view(['POST'])
@permission_classes([AllowAny])  # Разрешаем доступ без аутентификации
def register_user(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if not username or not password:
            return Response(
                {'detail': 'Пожалуйста, укажите имя пользователя и пароль'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверяем, существует ли пользователь
        if User.objects.filter(username=username).exists():
            return Response(
                {'detail': 'Пользователь с таким именем уже существует'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Создаем нового пользователя
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )

        return Response(
            {'detail': 'Пользователь успешно создан'},
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {'detail': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

class SliderImageListCreate(generics.ListCreateAPIView):
    queryset = SliderImage.objects.all()
    serializer_class = SliderImageSerializer

class SliderImageDelete(generics.DestroyAPIView):
    queryset = SliderImage.objects.all()
    serializer_class = SliderImageSerializer


# Список пользователей
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [CustomPermission]

# Работа с конкретным пользователем (просмотр, редактирование, удаление)
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [CustomPermission]


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all().order_by('-create_at')
    serializer_class = FeedbackSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]

    def perform_create(self, serializer):
        feedback = serializer.save()
        send_mail(
            subject="Новая заявка",
            message=feedback.message,
            from_email="maniprutby@gmail.com",
            recipient_list=["maniprutby@gmail.com"],
            fail_silently=False,
        )

    def perform_update(self, serializer):
        feedback = serializer.save()

        # Отправка email, если есть сообщение от админа
        if feedback.status == 'answered' and feedback.email:
            subject = "Ответ на ваш запрос"
            body = feedback.reply_message or "Ваш запрос рассмотрен."

            email = EmailMessage(subject, body, 'maniprutby@gmail.com', [feedback.email])
            if feedback.reply_attachment:
                email.attach_file(feedback.reply_attachment.path)
            try:
                email.send(fail_silently=False)
            except Exception as e:
                print("Ошибка отправки письма:", e)

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class OrderViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        order, created = Order.objects.get_or_create(user=request.user, is_ordered=False)
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    def create(self, request):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        order, _ = Order.objects.get_or_create(user=request.user, is_ordered=False)

        # Добавляем товар
        item, created = OrderItem.objects.get_or_create(order=order, product_id=product_id)
        if not created:
            item.quantity += quantity
        item.save()

        return Response({"message": "Товар добавлен в корзину"}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        # Оформить заказ
        order = Order.objects.filter(user=request.user, is_ordered=False).first()
        if order:
            order.is_ordered = True
            order.save()
            return Response({"message": "Заказ оформлен"})
        return Response({"error": "Корзина пуста"}, status=status.HTTP_400_BAD_REQUEST)

