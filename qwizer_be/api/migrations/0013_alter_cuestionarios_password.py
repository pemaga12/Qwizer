# Generated by Django 4.0.2 on 2022-02-18 19:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_alter_cuestionarios_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cuestionarios',
            name='password',
            field=models.CharField(blank=True, max_length=250, verbose_name='password'),
        ),
    ]
