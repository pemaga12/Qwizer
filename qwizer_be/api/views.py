from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

from Crypto.Cipher import AES                           #Usado para cifrar el test
from Crypto.Random import get_random_bytes
import hashlib
#Para pasar quiz a string
import json
import codecs
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
    
    quizString = json.dumps(quiz)
    #Hay que hacer que el texto se pueda enviar en bloques de 16 bytes, sino no funciona
    message = pad_message(quizString)
    #Proceso de generación de la key a partir del password
    password = b'cursoeda2122'
    key = hashlib.sha256(password).digest()
    print(key)
    mode = AES.MODE_CBC
    #Utilizamos un IV
    IV = b'This is an IV456'
    cipher = AES.new(key, mode, IV)
    encrypted_message = cipher.encrypt(message.encode())
   
    return Response(encrypted_message)

def pad_message(message):
    
    while len(message) % 16 != 0:
        message = message + " "
    return message