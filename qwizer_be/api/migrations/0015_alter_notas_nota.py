# Generated by Django 4.0.2 on 2022-02-19 09:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_alter_cuestionarios_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notas',
            name='nota',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name='nota'),
        ),
    ]
