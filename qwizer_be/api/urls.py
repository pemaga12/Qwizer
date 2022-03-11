from django.urls import path
from . import views

urlpatterns = [
    path('test',views.test,name='test'),
    path('test-corrected',views.testCorrected,name='test-corrected'),
    path('response',views.response,name='response'),
    path('login',views.iniciar_sesion,name='login'),
    path('logout',views.cerrar_sesion,name='logout'),
    path('register',views.registro,name='register'),
    path('get-asignaturas',views.get_asignaturas,name='get-asignaturas'),
    path('get-all-asignaturas',views.get_all_asignaturas,name='get-all-asignaturas'),
    path('get-cuestionarios', views.get_cuestionarios, name='get-cuestionarios'),
    path('get-info-asignatura', views.get_info_asignatura, name='get-info-asignatura'),
    path('get-info-cuestionario', views.get_info_cuestionario, name='get-info-cuestionario'),
    path('get-preg-asignaturas', views.get_preg_asignatura, name='get-preg-asignaturas'),
    path('upload', views.upload, name='upload'),
    path('upload-questions', views.upload_questions, name='upload-questions'),
    path('crear-cuestionario', views.crear_cuestionario, name='crear-cuestionario'),
    path('get-notas-de-test', views.get_notas_de_test, name='get-notas-de-test'),
]