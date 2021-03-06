# Qwizer
 TFG : Aplicación web progresiva para la realización de cuestionarios
 
 Qwizer es una aplicación web cuya finalidad es permitir a un alumno realizar cuestionarios. Lo que destaca de esta aplicación web con respecto a otras de este tipo, como Moodle, es que esta es progresiva, es decir, funciona incluso cuando no hay conexión a internet; aunque la funcionalidad esta limitada a realizar cuestionarios de manera *offline*. Cuando el usuario realice un cuestionario de manera *offline*, se le generará un código QR de sus respuestas, el cual deberá mostrar al profesor. Una vez el usuario vuelva a tener conexión a internet, las respuestas del cuestionario se enviará automáticamente. Se pueden distinguir tres grupos de usuarios para la aplicación:
 
- **Alumnos:** Los alumnos tienen la posibilidad de realizar los cuestionarios de las asignaturas para las que estén matriculados. Una vez enviadas las 	respuestas, el cuestionario se corrige automáticamente y el alumno podrá ver su cuestionario corregido, además de su nota.
- **Profesores:** Los profesores cuentan con la posibilidad de matricular alumnos en cualquiera de las asignaturas que ellos impartan. Con respecto a los cuestionarios, pueden añadirlos a estas asignaturas tanto haciendo uso de una página de la propia aplicación como subiendo los cuestionarios mediante un fichero. También pueden revisar las respuestas dadas por un alumno, así como las notas que ha obtenido. Por último tienen acceso a un banco de preguntas, al cual pueden añadir nuevas preguntas mediante un fichero y también descargar las preguntas para su posterior uso.
- **Administradores:** Mediante el panel de control tienen la posibilidad de crear asignaturas, dar de alta usuarios (tanto alumnos como profesores), matricular alumnos en una asignatura y asignar profesores a una asignatura.

La aplicación tiene un diseño adaptativo, lo que permite que se visualice bien, tanto en pantallas de ordenadores, como en la de dispositivos móviles.


# **Instrucciones de uso:**

Es importante que hagas los pasos en este orden, puesto que si intentas ejecutar Django antes que la base de datos obtendrás un error.

## Base de datos:
Para crear la base de datos nosotros utilizamos la herramienta [laragon](https://laragon-org.translate.goog/?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=sc). Una vez instalada y ejecutada debemos darle a `Start all`. Tras esto le daremos al botón Database y como campos seleccionaremos:
```

- Nombre de la sesión: Qwizer-db
- Tipo de red: MariaDb or MySQL (TCP/IP)
- Libraby: libmariadb.dll
- Nombre del host/ip: 127.0.0.1
- Usuario: root
- Contraseña: (nada)
- Puerto: 3306
```

Tras esto le daremos a abrir y se abrirá una nueva pantalla. En el lado izquierdo debemos pulsar click derecho y crear una nueva base de datos con el nombre `qwizer-db`. Con esto ya tendremos creada la base de datos, y las tablas se generan mediante django.


## Django:
Para poder usar django necesitarás tener python instalado (versión 3.9 recomendada) y django instalado `python -m pip install Django`. Además necesitarás algunos módulos más:
`pip install django-cors-headers`,
 `pip install djangorestframework`,
 `pip install django-createuser`,
 `pip install pycryptodome`,
 `pip install PyYAML`,
 `pip install mysqlclient`.
Después arrancar el sevidor mediante el comando `python manage.py runserver`. Este comando debe de ser lanzado desde la carpeta `qwizer-be` del proyecto. 

**IMPORTANTE**: Si es el primer arranque, antes de ejecutar  `python manage.py runserver`  debes de ir a la carpeta `qwizer-be/api/migrations` y **borrar su contenido salvo el archivo __init__.py**. Tras esto debes ejecutar `python manage.py makemigrations` y `python manage.py migrate`. Con esto se generarán las tablas en la base de datos que creaste con anterioridad.

**Creación de un usuario:** En la consola de python, antes de arrancar el servidor, ejecuta `python manage.py createsuperuser`. Los posibles roles son: `teacher, student`. También se pueden crear usuarios mediante el uso de la API, mediante la dirección `http://localhost:8000/api/register`.  En este caso sí que será necesario ejecutar el servidor. Un ejemplo de la entrada esperada se encuentra en el archivo `qwizer-be/api/views.py`

**Uso del panel de administración de Django:** Para poder añadir asignaturas a la base de datos se puede hacer uso del panel de administración de Django. Este panel se encuentra en la dirección `http://localhost:8000/admin/`. 

## React:
En primer lugar necesitarás instalar [Node.js](https://nodejs.org/es/). Tras ello deberás ir a la carpeta` ./qwizer-fe ` y ejecutar `npm install`. 
Tras ejecutar la instalación deberás usar los comandos `npm run build` y `serve -s build`. Es posible que necesites instalar algunos módulos más. En ese caso lee la consola y se te indicarán.

# **Funcionalidades:**

- **Alumnos:**  
   - Pueden ver las asignaturas en las que están matriculados.
   - Pueden ver los cuestionarios que tienen para una asignatura.
   - Pueden descargar cuestionarios para su posterior realización.
   - Pueden revisar los cuestionarios realizados y ver su nota.
 
- **Profesores:** 
   - Pueden ver las asignaturas que imparten.
   - Pueden matricular estudiantes en las asignaturas que imparten.
   - Pueden ver los cuestionarios que tienen para una asignatura.
   - Pueden descargar cuestionarios para su posterior realización.
   - Pueden revisar los cuestionarios realizados y ver su nota.
   - Pueden revisar los cuestionarios de sus estudiantes y ver su nota.
   - Banco de Preguntas:
      - Visualización, edición y eliminación de preguntas.
      - Descarga de las preguntas en un fichero en formato YAML.
   - Subir preguntas al banco de preguntas con un fichero en formato YAML.
   - Subir cuestionarios con un fichero en formato YAML.
   - Creación de cuestionarios a través de la interfaz web.
   
- **Administradores:** 
   - Panel de administración de Django para gestionar la base de datos.
   
- **Funcionamiento _offline_:**
   - Permite que los usuarios puedan realizar los cuestionarios que se hayan descargado de manera _offline_.
   - Generación del QR que se deberá mostrar al profesor.
   - Envío de respuestas automáticamente cuando el usuario recupere la conexión.
   - El profesor puede comprobar la integridad de las respuestas enviadas.
  

