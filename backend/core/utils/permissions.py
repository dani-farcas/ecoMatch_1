# 📁 core/utils/permissions.py

from functools import wraps
from rest_framework.response import Response
from rest_framework import status

# 🛡️ Decorator zur Rollenprüfung (Client / Provider / ...), erlaubt immer Superuser-Zugriff
def role_required(required_role):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            user = request.user
            # Superuser dürfen immer zugreifen
            if user.is_authenticated and (getattr(user, f'is_{required_role}', False) or user.is_superuser):
                return view_func(request, *args, **kwargs)
            return Response({'detail': 'Zugriff verweigert'}, status=status.HTTP_403_FORBIDDEN)
        return _wrapped_view
    return decorator
