from django.db import models
from django.db.models.base import Model
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager, PermissionsMixin)
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

# Create your models here.

# CREACION DE UN MODELO DE USUARIO PERSONALIZADO >>>>>>>>>>>>>>>>>>>>>>

class UserManager(BaseUserManager):
    def create_user(
            self, email, first_name, last_name, password=None,
            commit=True):
        """
            Crea  y saves a User with the given email, first name, last name
            and password.
        """
        if not email:
            raise ValueError(_('Users must have an email address'))
        if not first_name:
            raise ValueError(_('Users must have a first name'))
        if not last_name:
            raise ValueError(_('Users must have a last name'))

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
        )

        user.set_password(password)
        if commit:
            user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password):
        """
            Creates and saves a superuser with the given email, first name,
            last name and password.
        """
        user = self.create_user(
            email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            commit=False,
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        verbose_name=_('email address'), max_length=255, unique=True
    )
    # password field supplied by AbstractBaseUser
    # last_login field supplied by AbstractBaseUser
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)

    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_(
            'Designates whether the user can log into this admin site.'
        ),
    )
    # is_superuser field provided by PermissionsMixin
    # groups field provided by PermissionsMixin
    # user_permissions field provided by PermissionsMixin

    date_joined = models.DateTimeField(
        _('date joined'), default=timezone.now
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def get_full_name(self):
        """
            Return the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def __str__(self):
        return '{} <{}>'.format(self.get_full_name(), self.email)

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True
# -------------------------------------------------- >>>>>>>>>>>>>>>>>>>>>>

#----------------------         ----------------------------       ------------------------#  

class Cuestionarios(models.Model):
    titulo = models.CharField(blank=True, max_length=100, verbose_name='titulo')
    idProfesor = models.ForeignKey(User, on_delete=models.CASCADE)
    idAsignatura = models.ForeignKey('Asignaturas', on_delete=models.CASCADE)
    nPreguntas = models.IntegerField(default=0, verbose_name='nPreguntas')
    secuencial =  models.CharField(blank=True, max_length=100, verbose_name='secuencial')

    def __str__(self):
        return self.titulo

    class Meta:
        ordering = ['titulo']
        db_table = "cuestionarios"

class Preguntas(models.Model):
    tipoPregunta = models.CharField(blank=True, max_length=100, verbose_name='tipoPregunta')
    pregunta = models.CharField(blank=True, max_length=254, verbose_name='pregunta')

    def __str__(self):
        return self.pregunta

    class Meta:
        ordering = ['pregunta']
        db_table = "preguntas"

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
        db_table = "pertenece_cuestionario"

class OpcionesTest(models.Model):
    idPregunta = models.ForeignKey('Preguntas', on_delete=models.CASCADE)
    opcion = models.CharField(blank=True, max_length=254, verbose_name='opcion')

    def __str__(self):
        return self.opcion
    
    class Meta:
        db_table = "opciones_test"


class RespuestasTexto(models.Model):
    idPregunta = models.ForeignKey('Preguntas', on_delete=models.CASCADE)
    respuesta = models.CharField(blank=True, max_length=254, verbose_name='respuesta')

    def __str__(self):
        return self.respuesta

    class Meta:
        ordering = ['respuesta']
        db_table = "respuestas_texto"

class RespuestasTest(models.Model):
    idPregunta = models.ForeignKey('Preguntas', on_delete=models.CASCADE)
    idOpcion = models.ForeignKey('OpcionesTest', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.respuesta
    
    class Meta:
        db_table = "respuestas_test"


class Asignaturas(models.Model):
    asignatura = models.CharField(blank=True, max_length=254, verbose_name='asignatura')
    
    def __str__(self):
        return self.asignatura

    class Meta:
        ordering = ['asignatura']
        db_table = "asignaturas"

class Imparte(models.Model):
    idProfesor = models.ForeignKey(User, on_delete=models.CASCADE)
    idAsignatura = models.ForeignKey('Asignaturas', on_delete=models.CASCADE)

    class Meta:
        db_table = "imparte"
    
class EsAlumno(models.Model):
    idAlumno = models.ForeignKey(User, on_delete=models.CASCADE)
    idAsignatura = models.ForeignKey('Asignaturas', on_delete=models.CASCADE)

    class Meta:
        db_table = "es_alumno"


class Notas(models.Model):
    idAlumno = models.ForeignKey(User, on_delete=models.CASCADE)
    idCuestionario = models.ForeignKey('Cuestionarios', on_delete=models.CASCADE)
    nota = models.IntegerField(default= 0, verbose_name='nota')

    class Meta:
        db_table = "notas"

class RespuestasEnviadasTest(models.Model):
    idCuestionario = models.ForeignKey('Cuestionarios', on_delete=models.CASCADE)
    idAlumno = models.ForeignKey(User, on_delete=models.CASCADE)      
    idPregunta = models.ForeignKey('Preguntas', on_delete=models.CASCADE)                   #No debería ser on delete cascade
    idRespuesta = models.ForeignKey('OpcionesTest', on_delete=models.CASCADE)

    class Meta:
        ordering = ['idPregunta']
        db_table = "respuestas_enviadas_test"

class RespuestasEnviadasText(models.Model):
    idCuestionario = models.ForeignKey('Cuestionarios', on_delete=models.CASCADE)
    idAlumno = models.ForeignKey(User, on_delete=models.CASCADE)
    idPregunta = models.ForeignKey('Preguntas', on_delete=models.CASCADE)
    Respuesta = models.CharField(blank=True, max_length=254, verbose_name='respuesta')

    class Meta:
        ordering = ['idPregunta']
        db_table = "respuestas_enviadas_text"