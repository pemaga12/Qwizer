from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

from Crypto.Cipher import AES                           #Usado para cifrar el test
from Crypto.Random import get_random_bytes
import hashlib
# Create your views here.


@api_view(['GET'])
def test(request):
    quiz = { 
        'password': '1234',
        'questions':[
            {
            'id': 1 ,
            'question':'En colas, nosotros solo podemos acceder al...',
            'options': ['Al elementos que nosotros queremos.','Primer y último elemento.'],
            'answer': 1
            },
            {
            'id': 2 ,
            'question':'En colas, nosotros solo podemos acceder al...',
            'options': ['Al elementos que nosotros queremos.','Primer y último elemento.'],
            'answer': 1
            }
        ]
    }
    # Proceso de generación de la key a partir del password
    password = 'cursoeda2122'.encode()
    key = hashlib.sha256(password).digest()
    mode = AES.MODE_CBC
    #Generacion de un IV aleatorio
    IV = get_random_bytes(AES.block_size)
    #Creación del objeto cypher
    cipher = AES.new(key, mode, IV)
    #return Response(IV + cipher.encrypt(quiz))

    return Response(quiz)