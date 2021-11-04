from django.db import models
from django.db.models.base import Model

# Create your models here.

class Usuarios(models.Model):
    nombre = models.CharField(blank=True, max_length=100, verbose_name='nombre')
    apellidos = models.CharField(blank=True, max_length=100, verbose_name='apellidos')
    email = models.EmailField(blank=True, max_length=254, verbose_name='email')
    password = models.CharField(blank=True, max_length=100, verbose_name='password')
    rol = models.CharField(blank=True, max_length=100, verbose_name='rol')

    def __str__(self):
        return self.nombre

    class Meta:
        ordering = ['apellidos']

        
class Cuestionarios(models.Model):
    titulo = models.CharField(blank=True, max_length=100, verbose_name='titulo')
    idProfesor = models.ForeignKey('Usuarios', on_delete=models.CASCADE)
    idAsignatura = models.ForeignKey('Asignaturas', on_delete=models.CASCADE)
    nPreguntas = models.IntegerField(default=0, verbose_name='nPreguntas')

    def __str__(self):
        return self.titulo

    class Meta:
        ordering = ['titulo']

class Preguntas(models.Model):
    tipoPregunta = models.CharField(blank=True, max_length=100, verbose_name='tipoPregunta')
    pregunta = models.CharField(blank=True, max_length=254, verbose_name='pregunta')

    def __str__(self):
        return self.pregunta

    class Meta:
        ordering = ['pregunta']

class PerteneceACuestionario(models.Model):
    idPregunta = models.ForeignKey('Preguntas', on_delete=models.CASCADE)
    idCuestionario = models.ForeignKey('Cuestionarios', on_delete=models.CASCADE)
    nQuestion = models.IntegerField(verbose_name='nPregunta')
    puntosAcierto = models.IntegerField(default= 0, verbose_name='puntos_acierto')
    puntosFallo = models.IntegerField(default=0, verbose_name='puntosFallo')

    def __str__(self):
        return self.idPregunta

    class Meta:
        ordering = ['idPregunta']

class OpcionesTest(models.Model):
    idPregunta = models.ForeignKey('Preguntas', on_delete=models.CASCADE)
    opcion = models.CharField(blank=True, max_length=254, verbose_name='opcion')

    def __str__(self):
        return self.opcion


class RespuestasTexto(models.Model):
    idPregunta = models.ForeignKey('Preguntas', on_delete=models.CASCADE)
    respuesta = models.CharField(blank=True, max_length=254, verbose_name='respuesta')

    def __str__(self):
        return self.respuesta

    class Meta:
        ordering = ['respuesta']

class RespuestasTest(models.Model):
    idPregunta = models.ForeignKey('Preguntas', on_delete=models.CASCADE)
    idOpcion = models.ForeignKey('OpcionesTest', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.respuesta


class Asignaturas(models.Model):
    asignatura = models.CharField(blank=True, max_length=254, verbose_name='asignatura')
    
    def __str__(self):
        return self.asignatura

    class Meta:
        ordering = ['asignatura']

class Imparte(models.Model):
    idProfesor = models.ForeignKey('Usuarios', on_delete=models.CASCADE)
    idAsignatura = models.ForeignKey('Asignaturas', on_delete=models.CASCADE)
    
class EsAlumno(models.Model):
    idAlumno = models.ForeignKey('Usuarios', on_delete=models.CASCADE)
    idAsignatura = models.ForeignKey('Asignaturas', on_delete=models.CASCADE)


class Notas(models.Model):
    idAlumno = models.ForeignKey('Usuarios', on_delete=models.CASCADE)
    idCuestionario = models.ForeignKey('Cuestionarios', on_delete=models.CASCADE)
    nota = models.IntegerField(default= 0, verbose_name='nota')

class RespuestasEnviadasTest(models.Model):
    idCuestionario = models.ForeignKey('Cuestionarios', on_delete=models.CASCADE)
    idAlumno = models.ForeignKey('Usuarios', on_delete=models.CASCADE)      
    idPregunta = models.ForeignKey('Preguntas', on_delete=models.CASCADE)                   #No debería ser on delete cascade
    idRespuesta = models.ForeignKey('OpcionesTest', on_delete=models.CASCADE)

    class Meta:
        ordering = ['idPregunta']

class RespuestasEnviadasText(models.Model):
    idCuestionario = models.ForeignKey('Cuestionarios', on_delete=models.CASCADE)
    idAlumno = models.ForeignKey('Usuarios', on_delete=models.CASCADE)
    idPregunta = models.ForeignKey('Preguntas', on_delete=models.CASCADE)
    Respuesta = models.CharField(blank=True, max_length=254, verbose_name='respuesta')

    class Meta:
        ordering = ['idPregunta']