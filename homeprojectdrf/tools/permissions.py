from rest_framework import permissions

class CustomPermission(permissions.BasePermission):
    def has_permission(self, request, view):    
        # Неавторизованные пользователи могут только читать (GET запросы)
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Для остальных методов требуется аутентификация
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Неавторизованные пользователи могут только читать
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Админы имеют полный доступ (включая удаление)
        if request.user.is_staff:
            return True
            
        # Авторизованные пользователи могут редактировать (PUT, PATCH)
        if request.method in ['PUT', 'PATCH']:
            return request.user.is_authenticated

        # Авторизованные пользователи is_staff могут редактировать (PUT, PATCH, DELETE)
        if request.method in ['PUT', 'PATCH', 'DELETE']:
            return request.user.is_staff
            
        # Запрещаем удаление для обычных пользователей
        if request.method in ['DELETE']:
            return False
            
        return False
