from django.contrib import admin
from django.urls import path , include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import register_user
from . views import ToolViewSet
from .views import SliderImageListCreate, SliderImageDelete
from .views import UserListView, UserDetailView


router = routers.DefaultRouter()
router.register('tools', ToolViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('auth/', include('rest_framework.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register'),
    path('images/', SliderImageListCreate.as_view(), name='image-list'),
    path('images/<int:pk>/', SliderImageDelete.as_view(), name='image-delete'),

# API для работы с пользователями
    path('users/', UserListView.as_view(), name='user-list'),  # Получение списка пользователей
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),  # Детали пользователя (редактирование/удаление)

]