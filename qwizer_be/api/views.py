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

from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from .models import Cuestionarios, PerteneceACuestionario, User #cogemos el modelo de usuario autenticado

from .models import Asignaturas,EsAlumno,Imparte, Cuestionarios, User, Preguntas, PerteneceACuestionario, OpcionesTest, RespuestasTest, RespuestasTexto

from rest_framework.permissions import IsAuthenticated


import yaml

# Create your views here.

"""
Llega un json:
{
    "email": "pepe@gmail.com",
   "password": "1234"
}
{"email": "admin@admin.com", "password": "admin"}
"""
@api_view(['POST'])
def iniciar_sesion(request):
    returnValue = ''
    info = request.data
    correo = info['email']
    print(correo)
    contra = info['password']
    print(contra)
    user = authenticate(username=correo, password=contra)
    print(user)
    if user is not None:
        login(request, user)
        token, _ = Token.objects.get_or_create(user=user)
        tokenvalue = "Token" + " "+ token.key
        returnValue = {
            "respuesta" : "ok login",
            "username" : correo,
            "token" : token.key,
            "rol" : user.role,
            "token" : tokenvalue
        }
        print(user.role)
        
        # Redirect to a success page.
    else:
        # Return an 'invalid login' error message.
        returnValue = {"respuesta" : "invalid login"}


    

    return Response(returnValue)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_asignaturas(request):
    listaAsignaturas = []
    listaIds = []
    identif = str(request.user.id)
    role = str(request.user.role)
    print(role)

    if role == 'student':
        listaIdAsignaturas = EsAlumno.objects.filter(idAlumno_id=identif)
        for idAsignartura in listaIdAsignaturas:
            nombre = Asignaturas.objects.get(id=idAsignartura.idAsignatura_id)
            listaAsignaturas.append(nombre.asignatura)
            listaIds.append(idAsignartura.idAsignatura_id)
        
    elif role == 'teacher':
        listaIdAsignaturas = Imparte.objects.filter(idProfesor_id=identif)
        for idAsignartura in listaIdAsignaturas:
            nombre = Asignaturas.objects.get(id=idAsignartura.idAsignatura_id)
            listaAsignaturas.append(nombre.asignatura)
            listaIds.append(idAsignartura.idAsignatura_id)
    else:
        return Response('El admin no tiene ninguna asignatura')

    

    return Response({'asignaturas':listaAsignaturas, 'idAsignaturas': listaIds})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cuestionarios(request):
    listaCuestionarios = []
    identif = str(request.user.id)
    role = str(request.user.role)
    print(role)
    nombreAsignatura = str(request.asignatura)
    asignatura = Asignaturas.objects.get(asignatura=nombreAsignatura)
    idAsignatura = asignatura.id
    
    if role == 'student':
        listaIdCuestionarios = Cuestionarios.objects.filter(idAsignartura_id = idAsignatura)
        for cuestionario in listaIdCuestionarios:
            nombre = cuestionario.titulo
            listaCuestionarios.append(nombre)
        
    elif role == 'teacher':
        listaIdCuestionarios = Cuestionarios.objects.filter(idAsignartura_id = idAsignatura)
        for cuestionario in listaIdCuestionarios:
            nombre = cuestionario.titulo
            listaCuestionarios.append(nombre)
    else:
        return Response('El admin no tiene ningun test')

    
    print(listaCuestionarios)
    return Response({'cuestionarios':listaCuestionarios})




@api_view(['GET'])
@permission_classes([IsAuthenticated])
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

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def upload(request):
    try:
        yamlplscomeon = yaml.load(request.data["fichero_yaml"],Loader=yaml.FullLoader)
    except:
        content = {
            'inserted' : 'false',
            'message': 'Error: El cuestionario está mal formado. Por favor, revisa que lo hayas escrito bien.'         
        }
        return Response(content)  
    #1. Generamos el test 
    title = yamlplscomeon["cuestionario"]["titulo"]
    idAs = 1
    idPr = 1
    nPreg = yamlplscomeon["cuestionario"]["nPreguntas"]
    sec = yamlplscomeon["cuestionario"]["secuencial"]
    durat = yamlplscomeon["cuestionario"]["duracion"]
    asignatura = Asignaturas.objects.get(id=idAs)
    profesor = User.objects.get(id = idPr)
    cuestionario = Cuestionarios(titulo=title, nPreguntas=nPreg, secuencial=sec, idAsignatura=asignatura, idProfesor=profesor, duracion=durat)
    try:
        cuestionario.save()  
    except:
        content = {
            'inserted' : 'false',
            'message': 'Error: El cuestionario ya existe'         
        }
        return Response(content)  
    #Obtenemos el id del cuestionario que acabamos de crear y empezamos a guardar las preguntas. Si existen simplemente se las añadimos al cuestionario
    cuestionario = Cuestionarios.objects.get(titulo=title, nPreguntas=nPreg, secuencial=sec, idAsignatura=asignatura, idProfesor=profesor, duracion=durat)
    cuestionario.id
    preguntas = yamlplscomeon["cuestionario"]["preguntas"]
    i = 0
    for q in preguntas:
        print(q["tipo"])
        encontrado = 1
        try:
            pregunta = Preguntas.objects.get(tipoPregunta=q["tipo"], pregunta = q["pregunta"])
        except:
            print("No se ha encontrado la pregunta")
            encontrado = 0
        if encontrado == 0: 
            pregunta = Preguntas(tipoPregunta=q["tipo"], pregunta = q["pregunta"])
            pregunta.save()
            pregunta = Preguntas.objects.get(tipoPregunta=q["tipo"], pregunta = q["pregunta"])
            pertenece = PerteneceACuestionario(nQuestion = i, puntosAcierto = q["punt_positiva"], puntosFallo=q["punt_negativa"], idCuestionario = cuestionario, idPregunta = pregunta)
            pertenece.save()

        else:
            print("La pregunta ya existe")
            #Guarda la pregunta que ha encontrado en el la tabla
            pertenece = PerteneceACuestionario(nQuestion = i, puntosAcierto = q["punt_positiva"], puntosFallo=q["punt_negativa"], idCuestionario = cuestionario, idPregunta = pregunta)
            pertenece.save()
        #Guardamos las opciones
        if(q["tipo"] == "test"):
            j = 0
            opciones = q["opciones"]
            for o in opciones:
                opcion = OpcionesTest(opcion = o, idPregunta = pregunta)
                opcion.save()
                if j == q["op_correcta"]:
                    respuesta = RespuestasTest(idOpcion = opcion, idPregunta = pregunta)
                    respuesta.save()
                j += 1
        elif q["tipo"] == "text":
            respuestaText = RespuestasTexto(respuesta = q["opciones"], idPregunta = pregunta)
        i += 1
        content = {
            'inserted' : 'true',
            'message': 'El cuestionario se ha insertado correctamente'         
        }
       
    return Response(content)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
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