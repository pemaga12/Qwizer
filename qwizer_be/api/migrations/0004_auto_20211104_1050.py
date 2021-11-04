# Generated by Django 3.2.9 on 2021-11-04 09:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20211104_1037'),
    ]

    operations = [
        migrations.CreateModel(
            name='Pregunta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipoPregunta', models.CharField(blank=True, max_length=100, verbose_name='tipoPregunta')),
                ('pregunta', models.CharField(blank=True, max_length=254, verbose_name='pregunta')),
            ],
            options={
                'ordering': ['pregunta'],
            },
        ),
        migrations.AlterModelOptions(
            name='cuestionario',
            options={'ordering': ['titulo']},
        ),
        migrations.AlterModelOptions(
            name='usuario',
            options={'ordering': ['apellidos']},
        ),
        migrations.RenameField(
            model_name='cuestionario',
            old_name='idPrfesor',
            new_name='idProfesor',
        ),
        migrations.RemoveField(
            model_name='cuestionario',
            name='nQuestions',
        ),
        migrations.RemoveField(
            model_name='cuestionario',
            name='title',
        ),
        migrations.RemoveField(
            model_name='usuario',
            name='mail',
        ),
        migrations.RemoveField(
            model_name='usuario',
            name='name',
        ),
        migrations.RemoveField(
            model_name='usuario',
            name='surname',
        ),
        migrations.AddField(
            model_name='cuestionario',
            name='nPreguntas',
            field=models.IntegerField(default=0, verbose_name='nPreguntas'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='cuestionario',
            name='titulo',
            field=models.CharField(blank=True, max_length=100, verbose_name='titulo'),
        ),
        migrations.AddField(
            model_name='usuario',
            name='apellidos',
            field=models.CharField(blank=True, max_length=100, verbose_name='apellidos'),
        ),
        migrations.AddField(
            model_name='usuario',
            name='email',
            field=models.EmailField(blank=True, max_length=254, verbose_name='email'),
        ),
        migrations.AddField(
            model_name='usuario',
            name='nombre',
            field=models.CharField(blank=True, max_length=100, verbose_name='nombre'),
        ),
        migrations.CreateModel(
            name='PerteneceACuestionario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nQuestion', models.IntegerField(verbose_name='nPregunta')),
                ('puntosAcierto', models.IntegerField(verbose_name='puntos_acierto')),
                ('puntosFallo', models.IntegerField(verbose_name='puntosFallo')),
                ('idCuestionario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.cuestionario')),
                ('idPregunta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.pregunta')),
            ],
            options={
                'ordering': ['idPregunta'],
            },
        ),
    ]
