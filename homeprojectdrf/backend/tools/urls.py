from django.contrib import admin
from django.urls import path , include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import register_user
from . views import ToolViewSet
from .views import SliderImageListCreate, SliderImageDelete
from .views import UserListView, UserDetailView
from .views import FeedbackViewSet
from .views import ProductViewSet, OrderViewSet
from .views import UserCabinetView
from .views import GoogleLoginAPIView



router = routers.DefaultRouter()
router.register('tools', ToolViewSet)
router.register('feedback', FeedbackViewSet)
router.register('products', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
    #path('admin/', admin.site.urls),
    path('auth/', include('rest_framework.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register'),
    path('images/', SliderImageListCreate.as_view(), name='image-list'),
    path('images/<int:pk>/', SliderImageDelete.as_view(), name='image-delete'),

# API для работы с пользователями
    path('users/', UserListView.as_view(), name='user-list'),  # Получение списка пользователей
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),  # Детали пользователя (редактирование/удаление)
    path('cabinet/', UserCabinetView.as_view(), name='user-cabinet'),

    path('cart/', OrderViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('cart/checkout/', OrderViewSet.as_view({'post': 'post'})),
    path('cart/<int:product_id>/', OrderViewSet.delete_cart_item),
    path('cart/update/', OrderViewSet.as_view({'patch': 'update_quantity'})),

    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/', include('allauth.socialaccount.urls')),  # Google OAuth

    path("google-login/", GoogleLoginAPIView.as_view(), name="google-login"),
]