from ast import If
from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

from Crypto.Cipher import AES                           #Usado para cifrar el test
from Crypto.Random import get_random_bytes
import hashlib
#Para pasar quiz a string

import binascii
from api.utils.cifrado import _pad_string,decrypt,_unpad_string

import json 

#-------------------------

from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from .models import Cuestionarios, PerteneceACuestionario, User #cogemos el modelo de usuario autenticado

from .models import Asignaturas,EsAlumno,Imparte, Cuestionarios, User
from .models import Preguntas, PerteneceACuestionario, OpcionesTest, Notas
from .models import RespuestasTest,RespuestasTexto,RespuestasEnviadasTest,RespuestasEnviadasText

from rest_framework.permissions import IsAuthenticated
from datetime import datetime


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
    "email": "profe@profe.es",
    "first_name": "Maria",
    "last_name": "Perez",
    "password": "1234",
    "role": "teacher"
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
    identif = request.user.id
    role = str(request.user.role)
    print(role)


    if role == 'student' or role == 'teacher':

        if role == 'student':
            listaIdAsignaturas = EsAlumno.objects.filter(idAlumno=identif).order_by('idAsignatura')
        elif role == 'teacher':
            listaIdAsignaturas = Imparte.objects.filter(idProfesor=identif).order_by('idAsignatura')
        
        for asignartura in listaIdAsignaturas:
            asignaturaJSON = {}
            asignaturaJSON["id"] = asignartura.idAsignatura.id
            asignaturaJSON["nombre"] = asignartura.idAsignatura.asignatura
            listaAsignaturas.append(asignaturaJSON)
        
    else:
        return Response('El admin no tiene ninguna asignatura')

    print(listaAsignaturas)
    return Response({'asignaturas':listaAsignaturas})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_all_asignaturas(request): #conseguir todas las asignaturas para el banco de preguntas
    listaAsignaturas = []
    #comprobar que es un profesor
    asignaturas = Asignaturas.objects.all()
    for asignatura in asignaturas:
        asig = {}
        asig["asignatura"] = asignatura.asignatura
        asig["id"] = asignatura.id
        listaAsignaturas.append(asig)

    return Response({'asignaturas':listaAsignaturas})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_cuestionarios(request):
    
    print(request)
    listaCuestionarios = []
    asignatura = Asignaturas.objects.get(id= request.data["idAsignatura"])
    
    cuestionarios = Cuestionarios.objects.filter(idAsignatura = request.data["idAsignatura"]).order_by('-fecha_cierre')
    idCuestionarios = []
    for cuestionario in cuestionarios:
        listaCuestionarios.append(cuestionario.titulo)
        idCuestionarios.append(cuestionario.id)
    return Response({'cuestionarios':listaCuestionarios, 'idCuestionarios': idCuestionarios})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_info_asignatura(request):
    current_user = request.user
    cuestionarios = Cuestionarios.objects.filter(idAsignatura = request.data["idAsignatura"])
    
    c = 0
    n = 0
    for cuestionario in cuestionarios:
        c += 1
        try:
            notas = Notas.objects.get(idAlumno = current_user.id, idCuestionario = cuestionario.id)
        except:
            print("No he encontrado nota")
            continue
        print("He encontrado una nota")
        n+=1
    p = c - n
    return Response({'nCuestionarios':c, 'nCorregidos':n, 'nPendientes': p})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_info_cuestionario(request):
    cuestionario = Cuestionarios.objects.get(id = request.data["idCuestionario"])
    duracion = cuestionario.duracion
    fechaApertura = cuestionario.fecha_apertura
    fechaCierre = cuestionario.fecha_cierre
    notaCuestionario = 0
    try:
        #-----
        #Corregir Un alumno solo puede tener una nota para un cuestionario, solo puede hacer un cuestionrio una vez
        #......
        nota = Notas.objects.get(idCuestionario = cuestionario, idAlumno = request.user) # <-- Salta excepcion si devuelve mas de uno
        corregido = 1
        notaCuestionario = nota.nota
    except:
        corregido = 0
    return Response({'duracion': duracion, 'formattedFechaApertura': fechaApertura.strftime("%d/%m/%Y, %H:%M:%S"), 
    'formattedFechaCierre': fechaCierre.strftime("%d/%m/%Y, %H:%M:%S"), "FechaApertura": fechaApertura, "FechaCierre": fechaCierre, 'corregido': corregido, 'nota': notaCuestionario})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def test(request):
    
    idCuestionario = request.data["idCuestionario"]
    cuestionario = Cuestionarios.objects.get(id = idCuestionario)
    pertenecen = PerteneceACuestionario.objects.filter(idCuestionario = cuestionario.id)
    
    questions = []
    for pertenece in pertenecen:
        pregunta = Preguntas.objects.get(id = pertenece.idPregunta.id)
        preguntaJSON = {}
        preguntaJSON["id"] = pregunta.id
        preguntaJSON["question"] = pregunta.pregunta
        preguntaJSON["type"] = pregunta.tipoPregunta 
        if pregunta.tipoPregunta == "test":
            opcionesLista = []
            opciones = OpcionesTest.objects.filter(idPregunta = pregunta.id)
            for opcion in opciones:
                opcionesJSON = {}
                opcionesJSON["id"] = opcion.id
                opcionesJSON["op"] = opcion.opcion
                opcionesLista.append(opcionesJSON)
            preguntaJSON["options"] = opcionesLista
        questions.append(preguntaJSON)

    messageJSON = {}
    messageJSON["questions"] = questions
    print(messageJSON)

    quizString = json.dumps(messageJSON)
    #Hay que hacer que el texto se pueda enviar en bloques de 16 bytes, sino no funciona
    message = _pad_string(quizString)
    #Proceso de generación de la key a partir del password
    #password = b'1234'
    password = bytes(cuestionario.password, 'utf-8')
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
        'formatted_fecha_apertura': cuestionario.fecha_apertura.strftime("%d/%m/%Y, %H:%M:%S"),
        'formatted_fecha_cierre': cuestionario.fecha_cierre.strftime("%d/%m/%Y, %H:%M:%S"),
        'fecha_cierre': cuestionario.fecha_apertura,
        'fecha_apertura': cuestionario.fecha_apertura
    }

    return Response(content)

""" 
    Conseguir test corregido (Revision)
    titulo:
    nota : 5
    questions:[
        {
            id:
            question:
            type: test
            options:[
                {
                    id:
                    op:
                },
                {
                    id:
                    op:
                }
            ],
            correct_op:
            user_op:
        },
        {
            id:
            question:
            type: text
            correct_op:
            user_op:
                
            ]
        },
    ]
"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def testCorrected(request):

    #---------------------------------
    # AQUI COMPROBAR SI LA PETICION LA ESTA HACIENDO EL ALUMNO O EL PROFE
    # Si es alumno: alumno = reques.user
    # Si es profe : pasar el id de alumno y conseguir el objecto de alumno de la BBDD
    #-----------------------------------
    if request.user.role == "student":
        alumno = request.user
    else:
        alumno = User.objects.get(id = request.data["idAlumno"])
    print(request.data)
    idCuestionario = request.data["idCuestionario"]
    cuestionario = Cuestionarios.objects.get(id = idCuestionario)
    pertenecen = PerteneceACuestionario.objects.filter(idCuestionario = cuestionario.id)
    notaObj = Notas.objects.get(idCuestionario = cuestionario, idAlumno = alumno)

    questions = []
    for pertenece in pertenecen:
        pregunta = pertenece.idPregunta
        preguntaJSON = {}
        preguntaJSON["id"] = pregunta.id
        preguntaJSON["question"] = pregunta.pregunta
        preguntaJSON["type"] = pregunta.tipoPregunta 
        if pregunta.tipoPregunta == "test":
            opcionesLista = []
            opciones = OpcionesTest.objects.filter(idPregunta = pregunta.id)
            for opcion in opciones:
                opcionesJSON = {}
                opcionesJSON["id"] = opcion.id
                opcionesJSON["op"] = opcion.opcion
                opcionesLista.append(opcionesJSON)
            preguntaJSON["options"] = opcionesLista
            preguntaJSON["correct_op"] = RespuestasTest.objects.get(idPregunta=pregunta).idOpcion.id
            preguntaJSON["user_op"] = RespuestasEnviadasTest.objects.get(idCuestionario=cuestionario,idAlumno=alumno,idPregunta=pregunta).idRespuesta.id
        if pregunta.tipoPregunta == "text":
            preguntaJSON["correct_op"] = RespuestasTexto.objects.get(idPregunta=pregunta).respuesta
            preguntaJSON["user_op"] = RespuestasEnviadasText.objects.get(idCuestionario=cuestionario,idAlumno=alumno,idPregunta=pregunta).Respuesta
        questions.append(preguntaJSON)

    messageJSON = {}
    messageJSON["titulo"] = cuestionario.titulo
    messageJSON["nota"] = int(notaObj.nota) #nota en decimal no se serializa bien en json
    messageJSON["questions"] = questions

    quizString = json.dumps(messageJSON)
    
    content = {
        'corrected_test': quizString, 
    }
    print(content)
    return Response(content)

"""
    Devuelve todas las preguntas de una asignatura para el banco de preguntas
"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_preg_asignatura(request):

    if str(request.user.role) == "student":
        content = {
            'inserted' : 'false',
            'message': 'Error:  debes de ser administrador o profesor.'         
        }
        return Response(content) 

    asignatura = Asignaturas.objects.get(id = int(request.data["idAsignatura"]))
    listaPreguntas = Preguntas.objects.filter(idAsignatura = asignatura)
    preguntas = []

    for pregunta in listaPreguntas:
        preguntaJSON = {}
        preguntaJSON["id"] = pregunta.id
        preguntaJSON["question"] = pregunta.pregunta
        preguntaJSON["type"] = pregunta.tipoPregunta 
        if pregunta.tipoPregunta == "test":
            opcionesLista = []
            opciones = OpcionesTest.objects.filter(idPregunta = pregunta.id)
            for opcion in opciones:
                opcionesJSON = {}
                opcionesJSON["id"] = opcion.id
                opcionesJSON["op"] = opcion.opcion
                opcionesLista.append(opcionesJSON)
            preguntaJSON["options"] = opcionesLista
            preguntaJSON["correct_op"] = RespuestasTest.objects.get(idPregunta = pregunta).idOpcion.id
        if pregunta.tipoPregunta == "text":
            preguntaJSON["correct_op"] = RespuestasTexto.objects.get(idPregunta = pregunta).respuesta
        preguntas.append(preguntaJSON)

    messageJSON = {}
    messageJSON["preguntas"] = preguntas
    print(messageJSON)

    return Response(messageJSON)


"""
    Llega el siguiente JSON:
    {
        testName: 'ewew', 

        testPass: 'ewe', 

        testSubject: 1, 

        secuencial: 0, 

        fechaApertura: '2022-03-02T20:14'

        fechaCierre: "2022-03-03T20:14"

        questionIdList: [7]
    }
"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_cuestionario(request):

    if str(request.user.role) == "student":
        content = {
            'inserted' : 'false',
            'message': 'Error: Para poder crear tests debes de ser administrador o profesor.'         
        }
        return Response(content) 
    
    profesor = request.user 

    cuestionarioData = request.data

    title = cuestionarioData["testName"]
    passw = cuestionarioData["testPass"]
    idAsignatura = cuestionarioData["testSubject"]
    sec =  cuestionarioData["secuencial"]
    durat = cuestionarioData["testDuration"]

    fecha_apertura = cuestionarioData["fechaApertura"]
    date_time_apertura = datetime.fromtimestamp(fecha_apertura/1000)

    fecha_cierre = cuestionarioData["fechaCierre"]
    date_time_cierre = datetime.fromtimestamp(fecha_cierre/1000)

    listaPreguntas = cuestionarioData["questionList"]
    
    try:
        asignatura = Asignaturas.objects.get(id=idAsignatura)
    except:
        content = {
            'inserted' : 'false',
            'message': 'Error: La asignatura no existe!'         
        }
        return Response(content) 

    
    cuestionario = Cuestionarios(titulo=title, nPreguntas=len(listaPreguntas), secuencial=sec, idAsignatura=asignatura, idProfesor=profesor, duracion=durat, password=passw, fecha_cierre = date_time_cierre, fecha_apertura = date_time_apertura)
    
    try:
        cuestionario.save()  
    except:
        content = {
            'inserted' : 'false',
            'message': 'Error: El cuestionario ya existe'         
        }
        return Response(content)


    i = 0
    for preguntas in listaPreguntas:

        pregunta = Preguntas(id=preguntas["id"])

        pertenece = PerteneceACuestionario(nQuestion = i, puntosAcierto = preguntas["punt_positiva"], puntosFallo=preguntas["punt_negativa"], idCuestionario = cuestionario, idPregunta = pregunta)
        pertenece.save()

        i += 1
        
               
    content = {
        'inserted' : 'true',
        'message': 'El cuestionario se ha insertado correctamente'         
    }

    return Response(content)


#Un profesor solo puede subir tests de una asignatura que matricule
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload(request):
    if str(request.user.role) == "student":
        content = {
            'inserted' : 'false',
            'message': 'Error: Para poder crear tests debes de ser administrador o profesor.'         
        }
        return Response(content) 

    try:
        yamlplscomeon = yaml.load(request.data["fichero_yaml"],Loader=yaml.FullLoader)
    except:
        content = {
            'inserted' : 'false',
            'message': 'Error: El cuestionario está mal formado. Por favor, revisa que lo hayas escrito bien.'         
        }
        return Response(content)  
    #1. Generamos el test 
    fecha_apertura = yamlplscomeon["cuestionario"]["fecha_apertura"]
    passw = yamlplscomeon["cuestionario"]["password"]
    date_time_apertura = datetime.strptime(fecha_apertura, '%y/%m/%d %H:%M:%S')
    fecha_cierre = yamlplscomeon["cuestionario"]["fecha_cierre"]
    date_time_cierre = datetime.strptime(fecha_cierre, '%y/%m/%d %H:%M:%S')
    title = yamlplscomeon["cuestionario"]["titulo"]
    nombreAsig = yamlplscomeon["cuestionario"]["asignatura"]
    profesor = request.user
    sec = yamlplscomeon["cuestionario"]["secuencial"]
    durat = yamlplscomeon["cuestionario"]["duracion"]
    try:
        asignatura = Asignaturas.objects.get(asignatura=nombreAsig)
    except:
        content = {
            'inserted' : 'false',
            'message': 'Error: La asignatura no existe!'         
        }
        return Response(content) 

    cuestionario = Cuestionarios(titulo=title, secuencial=sec, idAsignatura=asignatura, idProfesor=profesor, duracion=durat, password=passw, fecha_cierre = date_time_cierre, fecha_apertura = date_time_apertura)
    try:
        cuestionario.save()  
    except:
        content = {
            'inserted' : 'false',
            'message': 'Error: El cuestionario ya existe'         
        }
        return Response(content)  
    

    preguntas = yamlplscomeon["cuestionario"]["preguntas"]
    i = 0
    
    for q in preguntas:
        print(q["tipo"])
         
        try:
            pregunta = Preguntas(tipoPregunta=q["tipo"], pregunta = q["pregunta"], idAsignatura = asignatura, titulo=q["titulo"])
            pregunta.save()
        except:
            pregunta = Preguntas.objects.get(tipoPregunta=q["tipo"], pregunta = q["pregunta"], idAsignatura = asignatura, titulo=q["titulo"])
            pertenece = PerteneceACuestionario(nQuestion = i, puntosAcierto = q["punt_positiva"], puntosFallo=q["punt_negativa"], idCuestionario = cuestionario, idPregunta = pregunta)
            pertenece.save()
            continue

        pertenece = PerteneceACuestionario(nQuestion = i, puntosAcierto = q["punt_positiva"], puntosFallo=q["punt_negativa"], idCuestionario = cuestionario, idPregunta = pregunta)
        pertenece.save()

        pregunta = Preguntas.objects.get(tipoPregunta=q["tipo"], pregunta = q["pregunta"], idAsignatura = asignatura, titulo=q["titulo"])
        #Guardamos las opciones
        if(q["tipo"] == "test"):
            j = 0
            opciones = q["opciones"]
            for o in opciones:
                opcion = OpcionesTest(opcion = o, idPregunta = pregunta)
                try:
                    opcion.save()
                    if j == q["op_correcta"]:
                        respuesta = RespuestasTest(idOpcion = opcion, idPregunta = pregunta)
                        respuesta.save()
                    j += 1
                except:
                    print("La pregunta ya existia")
        elif q["tipo"] == "text":
            respuestaText = RespuestasTexto(respuesta = q["opciones"], idPregunta = pregunta)
            respuestaText.save()    
        i += 1
        
               
    content = {
        'inserted' : 'true',
        'message': 'El cuestionario se ha insertado correctamente'         
    }    
    return Response(content)


""" SUBIR PREGUNTAS """
#Un profesor solo puede subir preguntas de una asignatura que imparte
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_questions(request):

    if str(request.user.role) == "student":
        content = {
            'inserted' : 'false',
            'message': 'Error: Para poder subir preguntas debes de ser administrador o profesor.'         
        }
        return Response(content) 

    try:
        yamlplscomeon = yaml.load(request.data["fichero_yaml"],Loader=yaml.FullLoader)
    except:
        content = {
            'inserted' : 'false',
            'message': 'Error: El cuestionario está mal formado. Por favor, revisa que lo hayas escrito bien.'         
        }
        return Response(content)  
    

    nombreAsig = request.data["idAsignatura"]
    
    try:
        asignatura = Asignaturas.objects.get(id=nombreAsig)
    except:
        content = {
            'inserted' : 'false',
            'message': 'Error: La asignatura no existe!'         
        }
        return Response(content) 

    
    preguntas = yamlplscomeon["preguntas"]

    i = 0
    
    for q in preguntas:
        print(q["tipo"])
         
        try:
            pregunta = Preguntas(tipoPregunta=q["tipo"], pregunta = q["pregunta"], idAsignatura = asignatura, titulo=q["titulo"])
            pregunta.save()
        except:
            pregunta = Preguntas.objects.get(tipoPregunta=q["tipo"], pregunta = q["pregunta"], idAsignatura = asignatura)
            continue

        #Guardamos las opciones
        if(q["tipo"] == "test"):
            j = 0
            opciones = q["opciones"]
            for o in opciones:
                opcion = OpcionesTest(opcion = o, idPregunta = pregunta)
                try:
                    opcion.save()
                    if j == q["op_correcta"]:
                        respuesta = RespuestasTest(idOpcion = opcion, idPregunta = pregunta)
                        respuesta.save()
                    j += 1
                except:
                    print("La pregunta ya existia")
        elif q["tipo"] == "text":
            respuestaText = RespuestasTexto(respuesta = q["opciones"], idPregunta = pregunta)
            respuestaText.save()    
        i += 1
        
               
    content = {
        'inserted' : 'true',
        'message': 'Las preguntas se han insertado correctamente'         
    }    
    return Response(content)

"""
Llegan las respuestas de un test:
{
    'idCuestionario': 1,
     'respuestas': [
        {'id': 1, 'type': 'test', 'answr': 2},
        {'id': 2, 'type': 'text', 'answr': 'blabla'},
    ]
}
"""
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def response(request):

    cuestionario = Cuestionarios.objects.get(id=request.data["idCuestionario"])
    alumno = request.user
    
    respuestas = request.data["respuestas"]
    for respuesta in respuestas:  
        pregunta = Preguntas.objects.get(id=respuesta["id"])      
        if respuesta["type"] == "test":
            opcion = OpcionesTest.objects.get(id=respuesta["answr"])
            respuestaEnviada = RespuestasEnviadasTest(idCuestionario=cuestionario,idAlumno = alumno,idPregunta = pregunta,idRespuesta= opcion)
            respuestaEnviada.save()
        if respuesta["type"] == "text":
            respuestaEnviada = RespuestasEnviadasText(idCuestionario=cuestionario,idAlumno = alumno,idPregunta = pregunta,Respuesta=respuesta["answr"])
            respuestaEnviada.save()

    nota = calcularNota(alumno,cuestionario,respuestas)

    content = {
        'nota' : nota,
        'preguntasAcertadas': 'NULL',
        'preguntasFalladas': 'NULL'             
    }

    return Response(content)

"""
Funcion que calcula la nota del cuestionario realizado
"""   
def calcularNota(alumno,cuestionario,respuestas):

    notaTest = 0
    
    for respuesta in respuestas:  
        pregunta = Preguntas.objects.get(id=respuesta["id"])
        pregunta_info = PerteneceACuestionario.objects.get(idPregunta =pregunta ,idCuestionario = cuestionario)
        if respuesta["type"] == "test":
            opcionUsuario = int(respuesta["answr"])
            opcionCorrecta = RespuestasTest.objects.get(idPregunta=respuesta["id"])
            opcionCorrecta = opcionCorrecta.idOpcion.id
            
            if opcionUsuario == opcionCorrecta:
                notaTest = notaTest + pregunta_info.puntosAcierto
            else:
                notaTest = notaTest - pregunta_info.puntosFallo
            
        if respuesta["type"] == "text":
            respuestaProcesada = respuesta["answr"].lower()
            respuestaProcesada = respuestaProcesada.replace(" ", "")
            respuestaCorrecta = RespuestasTexto.objects.get(idPregunta = respuesta["id"])
            respuestaCorrectaProcesada = respuestaCorrecta.respuesta
            print(respuestaCorrectaProcesada)
            respuestaCorrectaProcesada = respuestaCorrectaProcesada.lower()
            respuestaCorrectaProcesada = respuestaCorrectaProcesada.replace(" ", "")
            print(respuestaCorrectaProcesada + " " + respuestaProcesada)
            if respuestaProcesada == respuestaCorrectaProcesada:
                notaTest = notaTest + pregunta_info.puntosAcierto
            else:
                notaTest = notaTest - pregunta_info.puntosFallo
    
    notaAlumno = Notas(idAlumno = alumno,idCuestionario=cuestionario,nota = notaTest)
    notaAlumno.save()


    return notaTest

"""
Funcion que devuelve las notas de todos los alumnos para un cuestionario
"""   
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_notas_de_test(request):
    #comporbar que es alumno
    
    cuestionario = Cuestionarios.objects.get(id = request.data["idCuestionario"])
    name_map = {'first_name': 'first_name', 'last_name': 'last_name', 'email': 'nota'}

    alumnos = User.objects.raw("SELECT u.id, u.first_name, u.last_name, n.nota as nota FROM " +
        "api_user AS u " + 
        "JOIN es_alumno AS alumn " + 
        "ON u.id = alumn.idAlumno_id " + 
        "left JOIN (SELECT * from notas WHERE idCuestionario_id = " + str(request.data["idCuestionario"]) +") AS n ON " +
        "alumn.id = n.idAlumno_id "+
        "WHERE alumn.idAsignatura_id = " + str(cuestionario.idAsignatura.id), translations=name_map)

    notas = []
    for alumno in alumnos:
        alumnoJSON = {}
        alumnoJSON["id"] = alumno.id
        alumnoJSON["nombre"] = alumno.first_name
        alumnoJSON["apellidos"] = alumno.last_name
        nota = alumno.nota
        if alumno.nota == None: 
            nota = "No presentado"
        alumnoJSON["nota"] = nota
        notas.append(alumnoJSON)

    content = {
        'notas' : notas,         
    }
    return Response(content)



"""
Eliminar una pregunta
""" 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_question(request):
    if str(request.user.role) == "student":
        content = {
            'message': 'Error: Para eliminar una pregunta debes ser un profesor.'         
        }
        return Response(content) 

    preguntaId = request.data["idPregunta"]
    pregunta = Preguntas.objects.get(id=preguntaId)
    pregunta.delete()

    content = {
        'message' : "Pregunta eliminada correctamente",         
    }
    return Response(content)


"""
Actualizar una pregunta

-----------------------
preguntaActualizada:
        {
            id:
            question:
            type: test
            options:[
                {
                    id:
                    op:
                },
                {
                    id:
                    op:
                }
            ],
            correct_op:
        }
o
preguntaActualizada: 
        {
            id:
            question:
            type: text
            correct_op:
        },
""" 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_question(request):
    if str(request.user.role) == "student":
        content = {
            'message': 'Error: Para actualizar una pregunta debes ser un profesor.'         
        }
        return Response(content) 
    print(request.data["preguntaActualizada"])
    updatedQuestion = request.data["preguntaActualizada"]
    
    pregunta = Preguntas.objects.get(id=updatedQuestion["id"])
    pregunta.pregunta = updatedQuestion["question"]
    pregunta.save()

    if updatedQuestion["type"] == "test":
        for option in updatedQuestion["options"]:
            optionObj = OpcionesTest.objects.get(id=option["id"])
            optionObj.opcion = option["op"]
            optionObj.save()

        respTest = RespuestasTest.objects.get(idPregunta=updatedQuestion["id"])
        respTest.idOpcion = OpcionesTest.objects.get(id=updatedQuestion["correct_op"])
        respTest.save()

    elif updatedQuestion["type"] == "text":
        respText = RespuestasTexto.objects.get(idPregunta=updatedQuestion["id"])
        respText.respuesta = updatedQuestion["correct_op"]
        respText.save()


    content = {
        'message' : "Pregunta actualizada correctamente",         
    }
    return Response(content)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_alumnos(request):
    content = {}
    #comporbar que es alumno
    if request.user.role == "teacher":
        usuarios = User.objects.filter(role="student")
        alumnos = []
        for alumno in usuarios:
            alumnoJSON = {}
            alumnoJSON["id"] = alumno.id
            alumnoJSON["nombre"] = alumno.first_name
            alumnoJSON["apellidos"] = alumno.last_name
            alumnos.append(alumnoJSON)
        content["alumnos"] = (alumnos)
        
        return Response(content)
    else:
        return Response("")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def matricular_alumnos(request):
    content = {}
    correct = True
    alumnosFallidos = []
    alumnos = request.data["alumnos"]
    asignatura = request.data["asignatura"]
    print(alumnos)
    print(asignatura)
    for alumno in alumnos:
        print(alumno["id"])
        objetoAlumno = User.objects.get(id = alumno["id"])
        print(objetoAlumno)
        objetoAsignatura = Asignaturas.objects.get(id = asignatura)
        objetoEsAlumno = EsAlumno(idAlumno = objetoAlumno, idAsignatura = objetoAsignatura)
        
        try:
            objetoEsAlumno.save()
        except:
            correct = False
            alumnosFallidos.append(alumno["nombre"] + " " + alumno["apellidos"])
        
    content["insertados"] = correct
    content["errors"] = alumnosFallidos
    return Response(content)

