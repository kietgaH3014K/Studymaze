# from django.urls import path
# from .views import update_progress, get_progress_list, update_progress_status


# urlpatterns = [
#     path('update-progress/', update_progress, name='update_progress'),
#     path('progress/', get_progress_list, name='get_progress_list'),
#     path('progress/<int:pk>/update/', update_progress_status, name='update_progress_status'),
    
# ]

from django.urls import path
from .views import generate_learning_path, get_progress_list, update_progress_status

urlpatterns = [
    path('generate-learning-path/', generate_learning_path),  # POST
    path('progress/', get_progress_list),                     # GET
    path('progress/update/', update_progress_status),         # POST
]



