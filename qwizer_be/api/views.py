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

#-------------------------

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from .models import User #cogemos el modelo de usuario autenticado

from .models import Asignaturas,EsAlumno

# Create your views here.

"""
Llega un json:
{
    "email": "pepe@gmail.com",
   "password": "1234"
}
"""
@api_view(['POST'])
def iniciar_sesion(request):

    returnValue = 'Logged in'
    info = request.data
    correo = info['email']
    print(correo)
    contra = info['password']
    print(contra)
    user = authenticate(username=correo, password=contra)
    print(user)
    if user is not None:
        login(request, user)
        # Redirect to a success page.
    else:
        # Return an 'invalid login' error message.
        returnValue = 'Invalid login'

    return Response(returnValue)

@login_required
@api_view(['GET'])
def cerrar_sesion(request):
    logout(request)
    return Response('Logged out')


"""
{
    "email": "maria@gmail.com",
    "first_name": "Maria",
    "last_name": "Perez",
    "password": "1234"
}

"""
#registro
@api_view(['POST'])
def registro(request):
    
    if request.user.is_authenticated:
        return Response('Ya estas registrado')
    info = request.data
    user = User.objects.create_user(info['email'],info['first_name'],info['last_name'],info['password'])
    
    return Response('Registrado correctamente intenta logearte')

"""
{
    "asignaturas": [FAL,EDA,PCOM]
}

"""
#get_asignaturas
@login_required
@api_view(['GET'])
def get_asignaturas(request):
    listaAsignaturas = []
    identif = str(request.user.id)
    print(identif)
    listaIdAsignaturas = EsAlumno.objects.filter(idAlumno_id=identif)#.idAsignatura_id
    print(listaIdAsignaturas)
    for idAsignartura in listaIdAsignaturas:
        nombre = Asignaturas.objects.get(id=idAsignartura.idAsignatura_id)
        print(nombre.asignatura)
        listaAsignaturas.append(nombre.asignatura)

    return Response({'asignaturas':listaAsignaturas})



@login_required
@api_view(['GET'])
def test(request):
    quiz = { 
        'questions':[
            {
            'id': 1 ,
            'question':'En colas, nosotros solo podemos acceder al...',
            'type': 'test',
            'options': [{'id':10,'op':'Al elementos que nosotros queremos.'},
                        {'id':11,'op':'Primer y último elemento.'}]
            
            },
            {
            'id': 2 ,
            'question':'En colas, nosotros solo podemos acceder al...',
            'type': 'test',
            'options': [{'id':20,'op':'Al elementos que nosotros queremos.'},
                        {'id':21,'op':'Primer y último elemento.'}]
            
            },
            {
            'id': 3 ,
            'question':'De que curso es la asignatura de EDA? (Escribe la respuesta como texto)',
            'type': 'text'
            
            }
        ]
    }
    
    quizString = json.dumps(quiz)
    #Hay que hacer que el texto se pueda enviar en bloques de 16 bytes, sino no funciona
    message = _pad_string(quizString)
    #Proceso de generación de la key a partir del password
    password = b'1234'
    key = hashlib.sha256(password).digest()
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


@login_required
@api_view(['POST'])
def response(request):
    print(request.data)       
    return Response(request.data)
    
#-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def _pad_string(in_string):
    '''Pad an input string according to PKCS#7'''
    in_len = len(in_string)
    pad_size = 16 - (in_len % 16)
    return in_string.ljust(in_len + pad_size, chr(pad_size))


def decrypt(message, in_iv, in_key):
		'''
		Return encrypted string.
		@in_encrypted: Base64 encoded 
		@key: hexified key
		@iv: hexified iv
		'''
		key = binascii.a2b_hex(in_key)
		iv = binascii.a2b_hex(in_iv)
		aes = AES.new(key, AES.MODE_CFB, iv, segment_size=128)		
		
		decrypted = aes.decrypt(binascii.a2b_base64(message).rstrip())
		return _unpad_string(decrypted)

def _unpad_string(in_string):
		'''Remove the PKCS#7 padding from a text string'''
		in_len = len(in_string)
		pad_size = ord(in_string[-1])
		if pad_size > 16:
			raise ValueError('Input is not padded or padding is corrupt')
		return in_string[:in_len - pad_size]