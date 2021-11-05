from django.contrib import admin
# Register your models here.


from .models import Asignaturas, Cuestionarios, EsAlumno, Imparte, Notas, OpcionesTest, PerteneceACuestionario, Preguntas, RespuestasTest, RespuestasTexto, Usuarios

admin.site.register(Usuarios)
admin.site.register(Cuestionarios)
admin.site.register(Preguntas)
admin.site.register(PerteneceACuestionario)
admin.site.register(OpcionesTest)
admin.site.register(RespuestasTexto)
admin.site.register(RespuestasTest)
admin.site.register(Asignaturas)
admin.site.register(Imparte)
admin.site.register(EsAlumno)
admin.site.register(Notas)
