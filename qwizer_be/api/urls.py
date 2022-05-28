from django.urls import path
from . import views

urlpatterns = [
    path('test',views.test,name='test'),
    path('test-corrected',views.testCorrected,name='test-corrected'),
    path('response',views.response,name='response'),
    path('login',views.app_login,name='login'),
    path('logout',views.app_logout,name='logout'),
    path('register',views.registro,name='register'),
    path('get-subjects',views.get_subjects,name='get-subjects'),
    path('get-all-subjects',views.get_all_subjects,name='get-all-subjects'),
    path('get-quizzes', views.get_quizzes, name='get-quizzes'),
    path('get-subject-info', views.get_subject_info, name='get-subject-info'),
    path('get-quiz-info', views.get_quiz_info, name='get-quiz-info'),
    path('get-subject-questions', views.get_subject_questions, name='get-subject-questions'),
    path('upload', views.upload, name='upload'),
    path('upload-questions', views.upload_questions, name='upload-questions'),
    path('create-quiz', views.create_quiz, name='create-quiz'),
    path('get-quiz-grades', views.get_quiz_grades, name='get-quiz-grades'),
    path('delete-question', views.delete_question, name='delete-question'),
    path('update-question', views.update_question, name='update-question'),
    path('get-students', views.get_students, name='get-students'),
    path('enroll-students', views.enroll_students, name='enroll-students'),
    path('insert-qr', views.insert_qr, name='insert-qr'),
    path('get-hashes', views.get_hashes, name='get-hashes'),
]