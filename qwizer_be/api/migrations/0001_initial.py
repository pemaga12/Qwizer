# Generated by Django 4.0.4 on 2022-05-21 15:24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='email address')),
                ('first_name', models.CharField(blank=True, max_length=30, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('role', models.CharField(choices=[('student', 'Student'), ('teacher', 'Teacher'), ('admin', 'Admin')], max_length=7, verbose_name='role')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Asignaturas',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('asignatura', models.CharField(blank=True, max_length=254, verbose_name='asignatura')),
            ],
            options={
                'db_table': 'asignaturas',
                'ordering': ['asignatura'],
            },
        ),
        migrations.CreateModel(
            name='Cuestionarios',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(blank=True, max_length=100, verbose_name='titulo')),
                ('duracion', models.IntegerField(default=10, verbose_name='duracion')),
                ('secuencial', models.IntegerField(default=1, verbose_name='secuencial')),
                ('password', models.CharField(blank=True, max_length=300, verbose_name='password')),
                ('fecha_apertura', models.DateTimeField(verbose_name='fecha_apertura')),
                ('fecha_cierre', models.DateTimeField(verbose_name='fecha_cierre')),
                ('idAsignatura', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.asignaturas')),
                ('idProfesor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'cuestionarios',
                'ordering': ['titulo'],
                'unique_together': {('idAsignatura', 'titulo')},
            },
        ),
        migrations.CreateModel(
            name='OpcionesTest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('opcion', models.CharField(blank=True, max_length=254, verbose_name='opcion')),
            ],
            options={
                'db_table': 'opciones_test',
            },
        ),
        migrations.CreateModel(
            name='Preguntas',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipoPregunta', models.CharField(blank=True, max_length=100, verbose_name='tipoPregunta')),
                ('pregunta', models.CharField(blank=True, max_length=254, verbose_name='pregunta')),
                ('titulo', models.CharField(blank=True, max_length=254, verbose_name='titulo')),
                ('idAsignatura', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.asignaturas')),
            ],
            options={
                'db_table': 'preguntas',
                'ordering': ['pregunta'],
                'unique_together': {('pregunta', 'tipoPregunta', 'idAsignatura')},
            },
        ),
        migrations.CreateModel(
            name='RespuestasTexto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('respuesta', models.CharField(blank=True, max_length=254, verbose_name='respuesta')),
                ('idPregunta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.preguntas')),
            ],
            options={
                'db_table': 'respuestas_texto',
                'ordering': ['respuesta'],
            },
        ),
        migrations.CreateModel(
            name='RespuestasEnviadasText',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Respuesta', models.CharField(blank=True, max_length=254, verbose_name='respuesta')),
                ('idAlumno', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('idCuestionario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.cuestionarios')),
                ('idPregunta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.preguntas')),
            ],
            options={
                'db_table': 'respuestas_enviadas_text',
                'ordering': ['idPregunta'],
            },
        ),
        migrations.CreateModel(
            name='RespuestasEnviadasTest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('idAlumno', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('idCuestionario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.cuestionarios')),
                ('idPregunta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.preguntas')),
                ('idRespuesta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.opcionestest')),
            ],
            options={
                'db_table': 'respuestas_enviadas_test',
                'ordering': ['idPregunta'],
            },
        ),
        migrations.CreateModel(
            name='PerteneceACuestionario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nQuestion', models.IntegerField(verbose_name='nPregunta')),
                ('puntosAcierto', models.DecimalField(decimal_places=2, default=0, max_digits=30, verbose_name='puntosAcierto')),
                ('puntosFallo', models.DecimalField(decimal_places=2, default=0, max_digits=30, verbose_name='puntosFallo')),
                ('idCuestionario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.cuestionarios')),
                ('idPregunta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.preguntas')),
            ],
            options={
                'db_table': 'pertenece_cuestionario',
                'ordering': ['idPregunta'],
            },
        ),
        migrations.AddField(
            model_name='opcionestest',
            name='idPregunta',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.preguntas'),
        ),
        migrations.CreateModel(
            name='RespuestasTest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('idOpcion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.opcionestest')),
                ('idPregunta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.preguntas')),
            ],
            options={
                'db_table': 'respuestas_test',
                'unique_together': {('idPregunta', 'idOpcion')},
            },
        ),
        migrations.CreateModel(
            name='Notas',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nota', models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name='nota')),
                ('hash', models.CharField(blank=True, max_length=254, verbose_name='hash')),
                ('idAlumno', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('idCuestionario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.cuestionarios')),
            ],
            options={
                'db_table': 'notas',
                'unique_together': {('idCuestionario', 'idAlumno')},
            },
        ),
        migrations.CreateModel(
            name='Imparte',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('idAsignatura', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.asignaturas')),
                ('idProfesor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'imparte',
                'unique_together': {('idProfesor', 'idAsignatura')},
            },
        ),
        migrations.CreateModel(
            name='EsAlumno',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('idAlumno', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('idAsignatura', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.asignaturas')),
            ],
            options={
                'db_table': 'es_alumno',
                'unique_together': {('idAlumno', 'idAsignatura')},
            },
        ),
        migrations.CreateModel(
            name='EnvioOffline',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hash', models.CharField(blank=True, max_length=254, verbose_name='hash')),
                ('idAlumno', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('idCuestionario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.cuestionarios')),
            ],
            options={
                'db_table': 'Envio_offline',
                'unique_together': {('idCuestionario', 'idAlumno')},
            },
        ),
    ]
