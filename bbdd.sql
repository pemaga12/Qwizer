-- --------------------------------------------------------
-- Host:                         localhost
-- Versión del servidor:         5.7.33 - MySQL Community Server (GPL)
-- SO del servidor:              Win64
-- HeidiSQL Versión:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Volcando datos para la tabla qwizer-db.api_asignaturas: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `api_asignaturas` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_asignaturas` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.api_cuestionarios: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `api_cuestionarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_cuestionarios` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.api_esalumno: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `api_esalumno` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_esalumno` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.api_imparte: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `api_imparte` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_imparte` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.api_notas: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `api_notas` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_notas` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.api_opcionestest: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `api_opcionestest` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_opcionestest` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.api_perteneceacuestionario: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `api_perteneceacuestionario` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_perteneceacuestionario` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.api_preguntas: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `api_preguntas` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_preguntas` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.api_respuestasenviadastest: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `api_respuestasenviadastest` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_respuestasenviadastest` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.api_respuestasenviadastext: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `api_respuestasenviadastext` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_respuestasenviadastext` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.api_respuestastest: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `api_respuestastest` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_respuestastest` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.api_respuestastexto: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `api_respuestastexto` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_respuestastexto` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.api_usuarios: ~1 rows (aproximadamente)
/*!40000 ALTER TABLE `api_usuarios` DISABLE KEYS */;
INSERT INTO `api_usuarios` (`id`, `rol`, `password`, `apellidos`, `email`, `nombre`) VALUES
	(1, 'estudiante', '1234', 'Martinez Gamero', 'pedrma03@ucm.es', 'Pedro');
/*!40000 ALTER TABLE `api_usuarios` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.auth_group: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.auth_group_permissions: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.auth_permission: ~88 rows (aproximadamente)
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
	(1, 'Can add log entry', 1, 'add_logentry'),
	(2, 'Can change log entry', 1, 'change_logentry'),
	(3, 'Can delete log entry', 1, 'delete_logentry'),
	(4, 'Can view log entry', 1, 'view_logentry'),
	(5, 'Can add permission', 2, 'add_permission'),
	(6, 'Can change permission', 2, 'change_permission'),
	(7, 'Can delete permission', 2, 'delete_permission'),
	(8, 'Can view permission', 2, 'view_permission'),
	(9, 'Can add group', 3, 'add_group'),
	(10, 'Can change group', 3, 'change_group'),
	(11, 'Can delete group', 3, 'delete_group'),
	(12, 'Can view group', 3, 'view_group'),
	(13, 'Can add user', 4, 'add_user'),
	(14, 'Can change user', 4, 'change_user'),
	(15, 'Can delete user', 4, 'delete_user'),
	(16, 'Can view user', 4, 'view_user'),
	(17, 'Can add content type', 5, 'add_contenttype'),
	(18, 'Can change content type', 5, 'change_contenttype'),
	(19, 'Can delete content type', 5, 'delete_contenttype'),
	(20, 'Can view content type', 5, 'view_contenttype'),
	(21, 'Can add session', 6, 'add_session'),
	(22, 'Can change session', 6, 'change_session'),
	(23, 'Can delete session', 6, 'delete_session'),
	(24, 'Can view session', 6, 'view_session'),
	(25, 'Can add usuario', 7, 'add_usuario'),
	(26, 'Can change usuario', 7, 'change_usuario'),
	(27, 'Can delete usuario', 7, 'delete_usuario'),
	(28, 'Can view usuario', 7, 'view_usuario'),
	(29, 'Can add cuestionario', 8, 'add_cuestionario'),
	(30, 'Can change cuestionario', 8, 'change_cuestionario'),
	(31, 'Can delete cuestionario', 8, 'delete_cuestionario'),
	(32, 'Can view cuestionario', 8, 'view_cuestionario'),
	(33, 'Can add pregunta', 9, 'add_pregunta'),
	(34, 'Can change pregunta', 9, 'change_pregunta'),
	(35, 'Can delete pregunta', 9, 'delete_pregunta'),
	(36, 'Can view pregunta', 9, 'view_pregunta'),
	(37, 'Can add pertenece a cuestionario', 10, 'add_perteneceacuestionario'),
	(38, 'Can change pertenece a cuestionario', 10, 'change_perteneceacuestionario'),
	(39, 'Can delete pertenece a cuestionario', 10, 'delete_perteneceacuestionario'),
	(40, 'Can view pertenece a cuestionario', 10, 'view_perteneceacuestionario'),
	(41, 'Can add asignaturas', 11, 'add_asignaturas'),
	(42, 'Can change asignaturas', 11, 'change_asignaturas'),
	(43, 'Can delete asignaturas', 11, 'delete_asignaturas'),
	(44, 'Can view asignaturas', 11, 'view_asignaturas'),
	(45, 'Can add cuestionarios', 12, 'add_cuestionarios'),
	(46, 'Can change cuestionarios', 12, 'change_cuestionarios'),
	(47, 'Can delete cuestionarios', 12, 'delete_cuestionarios'),
	(48, 'Can view cuestionarios', 12, 'view_cuestionarios'),
	(49, 'Can add opciones test', 13, 'add_opcionestest'),
	(50, 'Can change opciones test', 13, 'change_opcionestest'),
	(51, 'Can delete opciones test', 13, 'delete_opcionestest'),
	(52, 'Can view opciones test', 13, 'view_opcionestest'),
	(53, 'Can add preguntas', 9, 'add_preguntas'),
	(54, 'Can change preguntas', 9, 'change_preguntas'),
	(55, 'Can delete preguntas', 9, 'delete_preguntas'),
	(56, 'Can view preguntas', 9, 'view_preguntas'),
	(57, 'Can add usuarios', 7, 'add_usuarios'),
	(58, 'Can change usuarios', 7, 'change_usuarios'),
	(59, 'Can delete usuarios', 7, 'delete_usuarios'),
	(60, 'Can view usuarios', 7, 'view_usuarios'),
	(61, 'Can add respuestas texto', 14, 'add_respuestastexto'),
	(62, 'Can change respuestas texto', 14, 'change_respuestastexto'),
	(63, 'Can delete respuestas texto', 14, 'delete_respuestastexto'),
	(64, 'Can view respuestas texto', 14, 'view_respuestastexto'),
	(65, 'Can add respuestas test', 15, 'add_respuestastest'),
	(66, 'Can change respuestas test', 15, 'change_respuestastest'),
	(67, 'Can delete respuestas test', 15, 'delete_respuestastest'),
	(68, 'Can view respuestas test', 15, 'view_respuestastest'),
	(69, 'Can add respuestas enviadas text', 16, 'add_respuestasenviadastext'),
	(70, 'Can change respuestas enviadas text', 16, 'change_respuestasenviadastext'),
	(71, 'Can delete respuestas enviadas text', 16, 'delete_respuestasenviadastext'),
	(72, 'Can view respuestas enviadas text', 16, 'view_respuestasenviadastext'),
	(73, 'Can add respuestas enviadas test', 17, 'add_respuestasenviadastest'),
	(74, 'Can change respuestas enviadas test', 17, 'change_respuestasenviadastest'),
	(75, 'Can delete respuestas enviadas test', 17, 'delete_respuestasenviadastest'),
	(76, 'Can view respuestas enviadas test', 17, 'view_respuestasenviadastest'),
	(77, 'Can add notas', 18, 'add_notas'),
	(78, 'Can change notas', 18, 'change_notas'),
	(79, 'Can delete notas', 18, 'delete_notas'),
	(80, 'Can view notas', 18, 'view_notas'),
	(81, 'Can add imparte', 19, 'add_imparte'),
	(82, 'Can change imparte', 19, 'change_imparte'),
	(83, 'Can delete imparte', 19, 'delete_imparte'),
	(84, 'Can view imparte', 19, 'view_imparte'),
	(85, 'Can add es alumno', 20, 'add_esalumno'),
	(86, 'Can change es alumno', 20, 'change_esalumno'),
	(87, 'Can delete es alumno', 20, 'delete_esalumno'),
	(88, 'Can view es alumno', 20, 'view_esalumno');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.auth_user: ~1 rows (aproximadamente)
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES
	(1, 'pbkdf2_sha256$260000$Q8RH5PSI6wgLKmSPcWbla6$toIRG6TR8TOFCIOYsUwgAEFjrWqG06/y3koEmTguNfA=', '2021-11-04 09:01:34.289648', 1, 'admin', '', '', '', 1, 1, '2021-11-04 09:00:47.417204');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.auth_user_groups: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.auth_user_user_permissions: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.django_admin_log: ~1 rows (aproximadamente)
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` (`id`, `action_time`, `object_id`, `object_repr`, `action_flag`, `change_message`, `content_type_id`, `user_id`) VALUES
	(1, '2021-11-04 09:28:24.462644', '1', 'Pedro', 1, '[{"added": {}}]', 7, 1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.django_content_type: ~20 rows (aproximadamente)
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
	(1, 'admin', 'logentry'),
	(11, 'api', 'asignaturas'),
	(8, 'api', 'cuestionario'),
	(12, 'api', 'cuestionarios'),
	(20, 'api', 'esalumno'),
	(19, 'api', 'imparte'),
	(18, 'api', 'notas'),
	(13, 'api', 'opcionestest'),
	(10, 'api', 'perteneceacuestionario'),
	(9, 'api', 'preguntas'),
	(17, 'api', 'respuestasenviadastest'),
	(16, 'api', 'respuestasenviadastext'),
	(15, 'api', 'respuestastest'),
	(14, 'api', 'respuestastexto'),
	(7, 'api', 'usuarios'),
	(3, 'auth', 'group'),
	(2, 'auth', 'permission'),
	(4, 'auth', 'user'),
	(5, 'contenttypes', 'contenttype'),
	(6, 'sessions', 'session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.django_migrations: ~24 rows (aproximadamente)
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
	(1, 'contenttypes', '0001_initial', '2021-11-04 08:59:46.803326'),
	(2, 'auth', '0001_initial', '2021-11-04 08:59:47.541379'),
	(3, 'admin', '0001_initial', '2021-11-04 08:59:47.694154'),
	(4, 'admin', '0002_logentry_remove_auto_add', '2021-11-04 08:59:47.702146'),
	(5, 'admin', '0003_logentry_add_action_flag_choices', '2021-11-04 08:59:47.711148'),
	(6, 'contenttypes', '0002_remove_content_type_name', '2021-11-04 08:59:47.827720'),
	(7, 'auth', '0002_alter_permission_name_max_length', '2021-11-04 08:59:47.859726'),
	(8, 'auth', '0003_alter_user_email_max_length', '2021-11-04 08:59:47.889030'),
	(9, 'auth', '0004_alter_user_username_opts', '2021-11-04 08:59:47.898028'),
	(10, 'auth', '0005_alter_user_last_login_null', '2021-11-04 08:59:47.959058'),
	(11, 'auth', '0006_require_contenttypes_0002', '2021-11-04 08:59:47.961058'),
	(12, 'auth', '0007_alter_validators_add_error_messages', '2021-11-04 08:59:47.970061'),
	(13, 'auth', '0008_alter_user_username_max_length', '2021-11-04 08:59:48.001683'),
	(14, 'auth', '0009_alter_user_last_name_max_length', '2021-11-04 08:59:48.033679'),
	(15, 'auth', '0010_alter_group_name_max_length', '2021-11-04 08:59:48.063688'),
	(16, 'auth', '0011_update_proxy_permissions', '2021-11-04 08:59:48.074707'),
	(17, 'auth', '0012_alter_user_first_name_max_length', '2021-11-04 08:59:48.105724'),
	(18, 'sessions', '0001_initial', '2021-11-04 08:59:48.174040'),
	(19, 'api', '0001_initial', '2021-11-04 09:22:50.160977'),
	(20, 'api', '0002_auto_20211104_1026', '2021-11-04 09:26:13.311730'),
	(21, 'api', '0003_auto_20211104_1037', '2021-11-04 09:37:28.382787'),
	(22, 'api', '0004_auto_20211104_1050', '2021-11-04 09:51:52.658341'),
	(23, 'api', '0005_auto_20211104_1051', '2021-11-04 09:51:52.673345'),
	(24, 'api', '0006_auto_20211104_1119', '2021-11-04 10:19:12.621681');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;

-- Volcando datos para la tabla qwizer-db.django_session: ~1 rows (aproximadamente)
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
	('ckgzgkhnrdary9h9v43yd4xqs91xa75n', '.eJxVjEEOgjAQRe_StWkGOm0Hl-49A5lpp4IaSCisjHdXEha6_e-9_zI9b-vQb1WXfszmbBpz-t2E00OnHeQ7T7fZpnlal1HsrtiDVnudsz4vh_t3MHAdvjUCIBSXOQuxw6LaSiTEgk68FNAcQgdUoieEhmIkEuqCj464haTm_QHfRjdW:1miYco:3AKETWQNlmaukKLcV-eaKaNgoU833ffURtm3DDYxnis', '2021-11-18 09:01:34.292637');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
