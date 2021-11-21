from django.urls import path
from . import views


urlpatterns = [
    path('test',views.test,name='test'),
    path('response',views.response,name='response'),
    path('login',views.iniciar_sesion,name='login'),
    path('logout',views.cerrar_sesion,name='logout'),
    path('register',views.registro,name='register'),
    path('get-asignaturas',views.get_asignaturas,name='get-asignaturas')
]