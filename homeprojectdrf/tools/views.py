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



# class ToolFilter(django_filters.FilterSet):
#     name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
#
#     class Meta:
#         model = Tool
#         fields = ['brand_tool']

#*************************************************************************************
class ToolViewSet(viewsets.ModelViewSet):
    queryset = Tool.objects.all()
    serializer_class = ToolSeralizer
    permission_classes = [CustomPermission]
    filter_backends = [filters.SearchFilter]  #[filters.OrderingFilter]
    #filterset_class = ToolFilter
    search_fields = ['__all__']

    # @action(detail=False, methods=['get'])
    # def search(self, request):
    #     name = request.query_params.get('brand_tool', None)
    #     tools = self.queryset
    #     if name:
    #         tools = tools.filter(name__icontains=name)
    #     serializer = self.get_serializer(tools, many=True)
    #     return Response(serializer.data)

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

