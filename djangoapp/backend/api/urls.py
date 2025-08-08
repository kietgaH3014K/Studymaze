# from django.urls import path
# from .views import update_progress, get_progress_list, update_progress_status


# urlpatterns = [
#     path('update-progress/', update_progress, name='update_progress'),
#     path('progress/', get_progress_list, name='get_progress_list'),
#     path('progress/<int:pk>/update/', update_progress_status, name='update_progress_status'),
    
# ]
from django.urls import path
from .views import register, me
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("auth/register/", register),
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/me/", me),
]




