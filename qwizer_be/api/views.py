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
import base64
import binascii
# Create your views here.


@api_view(['GET'])
def test(request):
    quiz = { 
        'questions':[
            {
            'id': 1 ,
            'question':'En colas, nosotros solo podemos acceder al...',
            'type': 'test',
            'options': [{'id':10,'op':'Al elementos que nosotros queremos.'},
                        {'id':11,'op':'Primer y último elemento.'}],
            'answer': 1
            },
            {
            'id': 2 ,
            'question':'En colas, nosotros solo podemos acceder al...',
            'type': 'test',
            'options': [{'id':20,'op':'Al elementos que nosotros queremos.'},
                        {'id':21,'op':'Primer y último elemento.'}],
            'answer': 1
            },
            {
            'id': 3 ,
            'question':'De que curso es la asignatura de EDA? (Escribe la respuesta como texto)',
            'type': 'text',
            'answer': 'segundo curso'
            }
        ]
    }
    
    quizString = json.dumps(quiz)
    #Hay que hacer que el texto se pueda enviar en bloques de 16 bytes, sino no funciona
    message = _pad_string(quizString)
    #Proceso de generación de la key a partir del password
    password = b'1234'
    key = hashlib.sha256(password).digest()
    print("La key es: ", key.hex())
    mode = AES.MODE_CFB
    #Utilizamos un IV
    #in_iv = binascii.b2a_hex(IVorig)
    iv = get_random_bytes(16)
    in_iv = binascii.b2a_hex(iv)
    #print("El IV es: ", in_iv)
    cipher = AES.new(key, mode, iv, segment_size=128)
    encrypted = cipher.encrypt(message.encode())
    
    
    #Genero la respuesta
    content = {
        'password': key.hex(),
        'iv': in_iv,
        'encrypted_message': binascii.b2a_base64(encrypted).rstrip(),        
    }

    return Response(content)

def pad_message(message):
    
    while len(message) % 16 != 0:
        message = message + " "
    return message

def _pad_string(in_string):
    '''Pad an input string according to PKCS#7'''
    in_len = len(in_string)
    pad_size = 16 - (in_len % 16)
    return in_string.ljust(in_len + pad_size, chr(pad_size))
