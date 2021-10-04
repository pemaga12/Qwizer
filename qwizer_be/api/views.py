from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.


@api_view(['GET'])
def test(request):
    quiz = { 
        'password': 'cursoeda2122',
        'questions':[
            {
            'id': 1 ,
            'question':'En colas, nosotros solo podemos acceder al...',
            'options': ['Al elementos que nosotros queremos.','Primer y último elemento.'],
            'answer': 1
            }
        ]
    }
    return Response(quiz)