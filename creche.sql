-- MySQL dump 10.13  Distrib 5.7.29, for Linux (x86_64)
--
-- Host: localhost    Database: creche
-- ------------------------------------------------------
-- Server version	5.7.29-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `category` varchar(20) NOT NULL,
  `unit_price` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
INSERT INTO `activity` VALUES (1,'Visit Park','Picnic',15),(2,'Visit Museum','Picnic',10.25),(3,'Dingo','Lecture',0),(4,'Pichou','Lecture',0),(5,'Scoobydo','Lecture',0),(6,'Chant','Art',0),(7,'Dessin','Art',0),(8,'Danse','Art',0);
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add child activity',7,'add_childactivity'),(26,'Can change child activity',7,'change_childactivity'),(27,'Can delete child activity',7,'delete_childactivity'),(28,'Can view child activity',7,'view_childactivity'),(29,'Can add composant repas',8,'add_composantrepas'),(30,'Can change composant repas',8,'change_composantrepas'),(31,'Can delete composant repas',8,'delete_composantrepas'),(32,'Can view composant repas',8,'view_composantrepas'),(33,'Can add creche child',9,'add_crechechild'),(34,'Can change creche child',9,'change_crechechild'),(35,'Can delete creche child',9,'delete_crechechild'),(36,'Can view creche child',9,'view_crechechild'),(37,'Can add creche principal',10,'add_crecheprincipal'),(38,'Can change creche principal',10,'change_crecheprincipal'),(39,'Can delete creche principal',10,'delete_crecheprincipal'),(40,'Can view creche principal',10,'view_crecheprincipal'),(41,'Can add event type',11,'add_eventtype'),(42,'Can change event type',11,'change_eventtype'),(43,'Can delete event type',11,'delete_eventtype'),(44,'Can view event type',11,'view_eventtype'),(45,'Can add login audit',12,'add_loginaudit'),(46,'Can change login audit',12,'change_loginaudit'),(47,'Can delete login audit',12,'delete_loginaudit'),(48,'Can view login audit',12,'view_loginaudit'),(49,'Can add module',13,'add_module'),(50,'Can change module',13,'change_module'),(51,'Can delete module',13,'delete_module'),(52,'Can view module',13,'view_module'),(53,'Can add web email audit',14,'add_webemailaudit'),(54,'Can change web email audit',14,'change_webemailaudit'),(55,'Can delete web email audit',14,'delete_webemailaudit'),(56,'Can view web email audit',14,'view_webemailaudit'),(57,'Can add web user detail',15,'add_webuserdetail'),(58,'Can change web user detail',15,'change_webuserdetail'),(59,'Can delete web user detail',15,'delete_webuserdetail'),(60,'Can view web user detail',15,'view_webuserdetail'),(61,'Can add web users',16,'add_webusers'),(62,'Can change web users',16,'change_webusers'),(63,'Can delete web users',16,'delete_webusers'),(64,'Can view web users',16,'view_webusers'),(65,'Can add user module',17,'add_usermodule'),(66,'Can change user module',17,'change_usermodule'),(67,'Can delete user module',17,'delete_usermodule'),(68,'Can view user module',17,'view_usermodule'),(69,'Can add system user event type',18,'add_systemusereventtype'),(70,'Can change system user event type',18,'change_systemusereventtype'),(71,'Can delete system user event type',18,'delete_systemusereventtype'),(72,'Can view system user event type',18,'view_systemusereventtype'),(73,'Can add repas',19,'add_repas'),(74,'Can change repas',19,'change_repas'),(75,'Can delete repas',19,'delete_repas'),(76,'Can view repas',19,'view_repas'),(77,'Can add event',20,'add_event'),(78,'Can change event',20,'change_event'),(79,'Can delete event',20,'delete_event'),(80,'Can view event',20,'view_event'),(81,'Can add email schedule',21,'add_emailschedule'),(82,'Can change email schedule',21,'change_emailschedule'),(83,'Can delete email schedule',21,'delete_emailschedule'),(84,'Can view email schedule',21,'view_emailschedule'),(85,'Can add daily child report',22,'add_dailychildreport'),(86,'Can change daily child report',22,'change_dailychildreport'),(87,'Can delete daily child report',22,'delete_dailychildreport'),(88,'Can view daily child report',22,'view_dailychildreport'),(89,'Can add creche parent',23,'add_crecheparent'),(90,'Can change creche parent',23,'change_crecheparent'),(91,'Can delete creche parent',23,'delete_crecheparent'),(92,'Can view creche parent',23,'view_crecheparent'),(93,'Can add bill',24,'add_bill'),(94,'Can change bill',24,'change_bill'),(95,'Can delete bill',24,'delete_bill'),(96,'Can view bill',24,'view_bill');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bill`
--

DROP TABLE IF EXISTS `bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bill` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bill_no` varchar(12) NOT NULL,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `date_time` datetime(6) NOT NULL,
  `child_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bill_no` (`bill_no`),
  KEY `bill_child_id_63ec6642_fk_kid_id` (`child_id`),
  CONSTRAINT `bill_child_id_63ec6642_fk_kid_id` FOREIGN KEY (`child_id`) REFERENCES `kid` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill`
--

LOCK TABLES `bill` WRITE;
/*!40000 ALTER TABLE `bill` DISABLE KEYS */;
/*!40000 ALTER TABLE `bill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(24,'coreapp','bill'),(7,'coreapp','childactivity'),(8,'coreapp','composantrepas'),(9,'coreapp','crechechild'),(23,'coreapp','crecheparent'),(10,'coreapp','crecheprincipal'),(22,'coreapp','dailychildreport'),(21,'coreapp','emailschedule'),(20,'coreapp','event'),(11,'coreapp','eventtype'),(12,'coreapp','loginaudit'),(13,'coreapp','module'),(19,'coreapp','repas'),(18,'coreapp','systemusereventtype'),(17,'coreapp','usermodule'),(14,'coreapp','webemailaudit'),(15,'coreapp','webuserdetail'),(16,'coreapp','webusers'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2020-05-07 11:18:57.637724'),(2,'auth','0001_initial','2020-05-07 11:19:00.133679'),(3,'admin','0001_initial','2020-05-07 11:19:09.586989'),(4,'admin','0002_logentry_remove_auto_add','2020-05-07 11:19:11.864407'),(5,'admin','0003_logentry_add_action_flag_choices','2020-05-07 11:19:11.927643'),(6,'contenttypes','0002_remove_content_type_name','2020-05-07 11:19:13.508165'),(7,'auth','0002_alter_permission_name_max_length','2020-05-07 11:19:13.653224'),(8,'auth','0003_alter_user_email_max_length','2020-05-07 11:19:13.899015'),(9,'auth','0004_alter_user_username_opts','2020-05-07 11:19:13.972904'),(10,'auth','0005_alter_user_last_login_null','2020-05-07 11:19:14.762441'),(11,'auth','0006_require_contenttypes_0002','2020-05-07 11:19:14.867788'),(12,'auth','0007_alter_validators_add_error_messages','2020-05-07 11:19:14.964576'),(13,'auth','0008_alter_user_username_max_length','2020-05-07 11:19:15.127901'),(14,'auth','0009_alter_user_last_name_max_length','2020-05-07 11:19:15.295442'),(15,'auth','0010_alter_group_name_max_length','2020-05-07 11:19:15.463784'),(16,'auth','0011_update_proxy_permissions','2020-05-07 11:19:15.534507'),(17,'coreapp','0001_initial','2020-05-07 11:19:23.726081'),(18,'coreapp','0002_auto_20200507_1118','2020-05-07 11:19:39.342616'),(19,'sessions','0001_initial','2020-05-07 11:19:39.756974'),(20,'coreapp','0003_auto_20200507_1945','2020-05-07 19:45:05.492867');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('ymnvzkxpwy97k3equagoavt5l2denk53','YjI4MTI3NTBiODI4NjMyNjE2ZWNkOGMxNDFjMDEzZmJkMjQ0MDlmNjp7Il9jc3JmdG9rZW4iOiJPb1ZsVXJLYzJ4cGJuY2V5ODFydVdqZWZ1UVB4WVFaN3M3Skgxc0NPQkpFM0dzWWFMdGxacG9CeVpnVzI2T2JoIiwibG9naW5fYXVkaXRfaWQiOjcsInVzZXJfZGV0YWlsIjoiMiIsImZ1bGxfbmFtZSI6ImQuemlnYW1hQHBpdm90YWNjZXNzLmNvbSIsImFsbG93ZWRfbW9kdWxlcyI6WyJ7XCJ0ZXh0XCI6IFwiVXNlciBNYW5hZ2VtZW50XCIsIFwiaGFuZGxlclwiOiBcIi91c2VyXCIsIFwiaWNvblwiOiBcInVzZXJzLnBuZ1wiLCBcImRlc2NcIjogXCJVc2Vyc1wifSIsIntcInRleHRcIjogXCJQYXJlbnQgTWFuYWdlbWVudFwiLCBcImhhbmRsZXJcIjogXCIvcGFyZW50XCIsIFwiaWNvblwiOiBcInBhcmVudHMucG5nXCIsIFwiZGVzY1wiOiBcIlBhcmVudHNcIn0iLCJ7XCJ0ZXh0XCI6IFwiQ2hpbGQgTWFuYWdlbWVudFwiLCBcImhhbmRsZXJcIjogXCIvY2hpbGRcIiwgXCJpY29uXCI6IFwiY2hpbGRyZW4ucG5nXCIsIFwiZGVzY1wiOiBcIkNoaWxkcmVuXCJ9Iiwie1widGV4dFwiOiBcIlJlcG9ydCBNYW5hZ2VtZW50XCIsIFwiaGFuZGxlclwiOiBcIi9yZXBvcnRcIiwgXCJpY29uXCI6IFwicmVwb3J0cy5wbmdcIiwgXCJkZXNjXCI6IFwiUmVwb3J0c1wifSIsIntcInRleHRcIjogXCJDb250ZW50IE1hbmFnZW1lbnRcIiwgXCJoYW5kbGVyXCI6IFwiL2NvbnRlbnRcIiwgXCJpY29uXCI6IFwiY29udGVudHMucG5nXCIsIFwiZGVzY1wiOiBcIkNvbnRlbnRzXCJ9Iiwie1widGV4dFwiOiBcIkJpbGwgTWFuYWdlbWVudFwiLCBcImhhbmRsZXJcIjogXCIvYmlsbFwiLCBcImljb25cIjogXCJiaWxscy5wbmdcIiwgXCJkZXNjXCI6IFwiQmlsbHNcIn0iLCJ7XCJ0ZXh0XCI6IFwiRXZlbnQgTWFuYWdlbWVudFwiLCBcImhhbmRsZXJcIjogXCIvZXZlbnRcIiwgXCJpY29uXCI6IFwiZXZlbnRzLnBuZ1wiLCBcImRlc2NcIjogXCJFdmVudHNcIn0iLCJ7XCJ0ZXh0XCI6IFwiUHJvZmlsZSBNYW5hZ2VtZW50XCIsIFwiaGFuZGxlclwiOiBcIi9wcm9maWxlXCIsIFwiaWNvblwiOiBcInByb2ZpbGVzLnBuZ1wiLCBcImRlc2NcIjogXCJQcm9maWxlXCJ9Il0sInVzZXIiOiJ7XCJ1aWRcIjogMiwgXCJuYW1lXCI6IFwiZC56aWdhbWFAcGl2b3RhY2Nlc3MuY29tXCIsIFwicGFzc19maWVsZFwiOiBcIiRTJERvLi4uci4uLnJhL250NkhRLkRCZG5mbW9KbmVYY2hWaktVQldpYzV2R0hFLy91Umoxd3RcIiwgXCJtYWlsXCI6IFwiZC56aWdhbWFAcGl2b3RhY2Nlc3MuY29tXCIsIFwidGhlbWVcIjogXCJcIiwgXCJzaWduYXR1cmVcIjogXCJcIiwgXCJzaWduYXR1cmVfZm9ybWF0XCI6IFwiXCIsIFwiY3JlYXRlZFwiOiAxNTg4NjkzNzkwLCBcImFjY2Vzc1wiOiAwLCBcImxvZ2luXCI6IDAsIFwic3RhdHVzXCI6IDEsIFwidGltZXpvbmVcIjogXCJcIiwgXCJsYW5ndWFnZVwiOiBcIlwiLCBcImluaXRcIjogXCJcIiwgXCJkYXRhXCI6IFwiXCIsIFwicGljdHVyZVwiOiAwLCBcInV1aWRcIjogXCJcIn0ifQ==','2020-05-25 19:08:42.084756'),('zvpi05ml3pz0by84nxum2iqv575hp1f5','NTRlNWU1MTNlN2Q3NTIzY2VmMzdhZTkxMjc3ODczZjliMDJkZDAxMDp7ImVycm9yIjoiUGxlYXNlIExvZ2luIiwiX2NzcmZ0b2tlbiI6Ik1BREQzV2V6WFVVSWVtWHlmTHF5NVJKbVRvMU02VmJhcVl0U3dnRGVKa1V5TEF2QjFMclVYNVVkNjZ2Sld2eEsiLCJsb2dpbl9hdWRpdF9pZCI6NCwidXNlciI6IntcInVpZFwiOiAxLCBcIm5hbWVcIjogXCJ6aWdkaWRpZXJAZ21haWwuY29tXCIsIFwicGFzc19maWVsZFwiOiBcIiRTJERwLi4ucy4uLnM5ci40WGtnZGpGV09IZXMwM2FaS3hFMHBaRWJSQ0tKVm1GN1lLSC9JUlBcIiwgXCJtYWlsXCI6IFwiemlnZGlkaWVyQGdtYWlsLmNvbVwiLCBcInRoZW1lXCI6IFwiXCIsIFwic2lnbmF0dXJlXCI6IFwiXCIsIFwic2lnbmF0dXJlX2Zvcm1hdFwiOiBcIlwiLCBcImNyZWF0ZWRcIjogMTU4ODY3MjcwMiwgXCJhY2Nlc3NcIjogMCwgXCJsb2dpblwiOiAwLCBcInN0YXR1c1wiOiAxLCBcInRpbWV6b25lXCI6IFwiXCIsIFwibGFuZ3VhZ2VcIjogXCJcIiwgXCJpbml0XCI6IFwiXCIsIFwiZGF0YVwiOiBcIlwiLCBcInBpY3R1cmVcIjogMCwgXCJ1dWlkXCI6IFwiXCJ9IiwidXNlcl9kZXRhaWwiOiIxIiwiZnVsbF9uYW1lIjoiemlnZGlkaWVyQGdtYWlsLmNvbSIsImFsbG93ZWRfbW9kdWxlcyI6WyJ7XCJ0ZXh0XCI6IFwiVXNlciBNYW5hZ2VtZW50XCIsIFwiaGFuZGxlclwiOiBcIi91c2VyXCIsIFwiaWNvblwiOiBcInVzZXJzLnBuZ1wiLCBcImRlc2NcIjogXCJVc2Vyc1wifSIsIntcInRleHRcIjogXCJQYXJlbnQgTWFuYWdlbWVudFwiLCBcImhhbmRsZXJcIjogXCIvcGFyZW50XCIsIFwiaWNvblwiOiBcInBhcmVudHMucG5nXCIsIFwiZGVzY1wiOiBcIlBhcmVudHNcIn0iLCJ7XCJ0ZXh0XCI6IFwiQ2hpbGQgTWFuYWdlbWVudFwiLCBcImhhbmRsZXJcIjogXCIvY2hpbGRcIiwgXCJpY29uXCI6IFwiY2hpbGRyZW4ucG5nXCIsIFwiZGVzY1wiOiBcIkNoaWxkcmVuXCJ9Iiwie1widGV4dFwiOiBcIlJlcG9ydCBNYW5hZ2VtZW50XCIsIFwiaGFuZGxlclwiOiBcIi9yZXBvcnRcIiwgXCJpY29uXCI6IFwicmVwb3J0cy5wbmdcIiwgXCJkZXNjXCI6IFwiUmVwb3J0c1wifSIsIntcInRleHRcIjogXCJDb250ZW50IE1hbmFnZW1lbnRcIiwgXCJoYW5kbGVyXCI6IFwiL2NvbnRlbnRcIiwgXCJpY29uXCI6IFwiY29udGVudHMucG5nXCIsIFwiZGVzY1wiOiBcIkNvbnRlbnRzXCJ9Iiwie1widGV4dFwiOiBcIkJpbGwgTWFuYWdlbWVudFwiLCBcImhhbmRsZXJcIjogXCIvYmlsbFwiLCBcImljb25cIjogXCJiaWxscy5wbmdcIiwgXCJkZXNjXCI6IFwiQmlsbHNcIn0iLCJ7XCJ0ZXh0XCI6IFwiRXZlbnQgTWFuYWdlbWVudFwiLCBcImhhbmRsZXJcIjogXCIvZXZlbnRcIiwgXCJpY29uXCI6IFwiZXZlbnRzLnBuZ1wiLCBcImRlc2NcIjogXCJFdmVudHNcIn0iLCJ7XCJ0ZXh0XCI6IFwiUHJvZmlsZSBNYW5hZ2VtZW50XCIsIFwiaGFuZGxlclwiOiBcIi9wcm9maWxlXCIsIFwiaWNvblwiOiBcInByb2ZpbGVzLnBuZ1wiLCBcImRlc2NcIjogXCJQcm9maWxlXCJ9Il19','2020-05-22 12:53:54.733936');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_schedule`
--

DROP TABLE IF EXISTS `email_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email_schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `to_email` varchar(765) NOT NULL,
  `scheduled_for_relay` int(11) NOT NULL,
  `sent_at` datetime(6) DEFAULT NULL,
  `from_email` varchar(765) NOT NULL,
  `subject` varchar(192) NOT NULL,
  `message_body` longtext NOT NULL,
  `delivery_date` datetime(6) DEFAULT NULL,
  `date_created` datetime(6) NOT NULL,
  `last_updated` datetime(6) NOT NULL,
  `event_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `email_schedule_event_id_b82350b3_fk_event_id` (`event_id`),
  CONSTRAINT `email_schedule_event_id_b82350b3_fk_event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_schedule`
--

LOCK TABLES `email_schedule` WRITE;
/*!40000 ALTER TABLE `email_schedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_reference_id` int(11) DEFAULT NULL,
  `date_generated` datetime(6) NOT NULL,
  `name` varchar(255) NOT NULL,
  `processed` int(11) NOT NULL,
  `date_created` datetime(6) NOT NULL,
  `last_updated` datetime(6) NOT NULL,
  `event_type_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `event_event_type_id_f521c6ee_fk_event_type_id` (`event_type_id`),
  CONSTRAINT `event_event_type_id_f521c6ee_fk_event_type_id` FOREIGN KEY (`event_type_id`) REFERENCES `event_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_type`
--

DROP TABLE IF EXISTS `event_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_type` (
  `id` int(11) NOT NULL,
  `name` varchar(192) NOT NULL,
  `is_public` int(11) NOT NULL,
  `template_path` varchar(765) NOT NULL,
  `parameter` varchar(765) NOT NULL,
  `from_email` varchar(765) NOT NULL,
  `group_text` varchar(96) NOT NULL,
  `description` longtext NOT NULL,
  `date_created` datetime(6) NOT NULL,
  `last_updated` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_type`
--

LOCK TABLES `event_type` WRITE;
/*!40000 ALTER TABLE `event_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guardian`
--

DROP TABLE IF EXISTS `guardian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guardian` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `names` varchar(200) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `identity_document` varchar(50) NOT NULL,
  `full_address` longtext NOT NULL,
  `email` varchar(100) NOT NULL,
  `relationship` varchar(20) NOT NULL,
  `date_created` datetime(6) NOT NULL,
  `last_updated` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `identity_document` (`identity_document`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guardian`
--

LOCK TABLES `guardian` WRITE;
/*!40000 ALTER TABLE `guardian` DISABLE KEYS */;
INSERT INTO `guardian` VALUES (1,'Mako Harmat','0783056327','1198680069759054','Avenue Paul VI','mako@gmail.com','Father','2020-05-11 08:04:32.192296','2020-05-11 08:04:32.192401'),(2,'Conde Bugingo','0788306327','PC1278','Kizito Road','conde@gmail.com','Father','2020-05-11 08:39:34.226911','2020-05-11 08:39:34.226955');
/*!40000 ALTER TABLE `guardian` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guardian_children`
--

DROP TABLE IF EXISTS `guardian_children`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guardian_children` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `crecheparent_id` int(11) NOT NULL,
  `crechechild_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `guardian_children_crecheparent_id_crechechild_id_9e1739b0_uniq` (`crecheparent_id`,`crechechild_id`),
  KEY `guardian_children_crechechild_id_179d44fd_fk_kid_id` (`crechechild_id`),
  CONSTRAINT `guardian_children_crechechild_id_179d44fd_fk_kid_id` FOREIGN KEY (`crechechild_id`) REFERENCES `kid` (`id`),
  CONSTRAINT `guardian_children_crecheparent_id_5140bf48_fk_guardian_id` FOREIGN KEY (`crecheparent_id`) REFERENCES `guardian` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guardian_children`
--

LOCK TABLES `guardian_children` WRITE;
/*!40000 ALTER TABLE `guardian_children` DISABLE KEYS */;
INSERT INTO `guardian_children` VALUES (1,1,3),(2,2,4);
/*!40000 ALTER TABLE `guardian_children` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kid`
--

DROP TABLE IF EXISTS `kid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kid` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `regno` varchar(6) NOT NULL,
  `names` varchar(200) NOT NULL,
  `date_of_birth` date NOT NULL,
  `group` varchar(20) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `date_created` datetime(6) NOT NULL,
  `last_updated` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `regno` (`regno`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kid`
--

LOCK TABLES `kid` WRITE;
/*!40000 ALTER TABLE `kid` DISABLE KEYS */;
INSERT INTO `kid` VALUES (3,'C00001','Mako Junior','2018-01-08','Petit','Male','2020-05-11 08:04:32.083420','2020-05-11 08:04:32.083457'),(4,'C00004','Conde Richard','2017-01-02','Grand','Male','2020-05-11 08:39:34.133668','2020-05-11 08:39:34.133705');
/*!40000 ALTER TABLE `kid` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_audit`
--

DROP TABLE IF EXISTS `login_audit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `login_audit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_by_id` int(11) NOT NULL,
  `ip_address` varchar(765) NOT NULL,
  `logout_date` datetime(6) DEFAULT NULL,
  `date_created` datetime(6) NOT NULL,
  `last_updated` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_audit`
--

LOCK TABLES `login_audit` WRITE;
/*!40000 ALTER TABLE `login_audit` DISABLE KEYS */;
INSERT INTO `login_audit` VALUES (1,1,'127.0.0.1','2020-05-11 08:58:24.276693','2020-05-07 11:20:45.034415',NULL),(2,1,'192.168.43.163',NULL,'2020-05-07 13:23:17.307595',NULL),(3,1,'192.168.43.163',NULL,'2020-05-07 19:48:50.824748',NULL),(4,1,'192.168.43.202',NULL,'2020-05-08 12:53:54.565769',NULL),(5,2,'127.0.0.1','2020-05-11 19:01:56.542930','2020-05-11 08:58:29.625367',NULL),(6,1,'127.0.0.1','2020-05-11 19:08:35.163936','2020-05-11 19:02:40.249914',NULL),(7,2,'127.0.0.1',NULL,'2020-05-11 19:08:41.871596',NULL);
/*!40000 ALTER TABLE `login_audit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `module` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(48) NOT NULL,
  `display_name` varchar(96) NOT NULL,
  `handler` varchar(192) NOT NULL,
  `icon_file` varchar(96) NOT NULL,
  `description` varchar(765) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module`
--

LOCK TABLES `module` WRITE;
/*!40000 ALTER TABLE `module` DISABLE KEYS */;
INSERT INTO `module` VALUES (1,'user_mgmt','User Management','/user','users.png','Users'),(2,'parent_mgmt','Parent Management','/parent','parents.png','Parents'),(3,'child_mgmt','Child Management','/child','children.png','Children'),(4,'report_mgmt','Report Management','/report','reports.png','Reports'),(5,'content_mgmt','Content Management','/content','contents.png','Contents'),(6,'bill_mgmt','Bill Management','/bill','bills.png','Bills'),(7,'event_mgmt','Event Management','/event','events.png','Events'),(8,'profile_mgmt','Profile Management','/profile','profiles.png','Profile');
/*!40000 ALTER TABLE `module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patisserie`
--

DROP TABLE IF EXISTS `patisserie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patisserie` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `component_name` varchar(50) NOT NULL,
  `description` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `component_name` (`component_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patisserie`
--

LOCK TABLES `patisserie` WRITE;
/*!40000 ALTER TABLE `patisserie` DISABLE KEYS */;
INSERT INTO `patisserie` VALUES (1,'Patte','Patte'),(2,'Modele','Modele'),(3,'Gateau','Gateau'),(4,'Pizza','Pizza'),(5,'Juice','Juice'),(6,'Milk','Milk'),(7,'Biscuit',''),(8,'Yogurt','');
/*!40000 ALTER TABLE `patisserie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `principal`
--

DROP TABLE IF EXISTS `principal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `principal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `names` varchar(200) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `identity_document` varchar(50) NOT NULL,
  `full_address` longtext NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` varchar(20) NOT NULL,
  `date_created` datetime(6) NOT NULL,
  `last_updated` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `identity_document` (`identity_document`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `principal`
--

LOCK TABLES `principal` WRITE;
/*!40000 ALTER TABLE `principal` DISABLE KEYS */;
INSERT INTO `principal` VALUES (1,'UWANTWALI ZIGAMA DIDIER','0788660270','1198680069759062','KG 689 ST\r\nGISOZI\r\nKACYIRU\r\nKIGALI\r\nRWANDA','d.zigama@pivotaccess.com','Accueillante','2020-05-07 19:45:13.092133','2020-05-07 19:45:13.092174');
/*!40000 ALTER TABLE `principal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repas`
--

DROP TABLE IF EXISTS `repas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `repas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_time` datetime(6) NOT NULL,
  `unit_price` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `repas`
--

LOCK TABLES `repas` WRITE;
/*!40000 ALTER TABLE `repas` DISABLE KEYS */;
/*!40000 ALTER TABLE `repas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repas_menu`
--

DROP TABLE IF EXISTS `repas_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `repas_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repas_id` int(11) NOT NULL,
  `composantrepas_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `repas_menu_repas_id_composantrepas_id_9a3d6fa9_uniq` (`repas_id`,`composantrepas_id`),
  KEY `repas_menu_composantrepas_id_2fadb0a5_fk_coreapp_c` (`composantrepas_id`),
  CONSTRAINT `repas_menu_composantrepas_id_2fadb0a5_fk_coreapp_c` FOREIGN KEY (`composantrepas_id`) REFERENCES `patisserie` (`id`),
  CONSTRAINT `repas_menu_repas_id_44e9bbc6_fk_repas_id` FOREIGN KEY (`repas_id`) REFERENCES `repas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `repas_menu`
--

LOCK TABLES `repas_menu` WRITE;
/*!40000 ALTER TABLE `repas_menu` DISABLE KEYS */;
/*!40000 ALTER TABLE `repas_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `day` date NOT NULL,
  `date_created` datetime(6) NOT NULL,
  `day_price` double NOT NULL,
  `accueillante_id` int(11) NOT NULL,
  `child_id` int(11) NOT NULL,
  `repas_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `report_accueillante_id_49ff946d_fk_principal_id` (`accueillante_id`),
  KEY `report_child_id_d45be61b_fk_kid_id` (`child_id`),
  KEY `report_repas_id_dd2689a6_fk_repas_id` (`repas_id`),
  CONSTRAINT `report_accueillante_id_49ff946d_fk_principal_id` FOREIGN KEY (`accueillante_id`) REFERENCES `principal` (`id`),
  CONSTRAINT `report_child_id_d45be61b_fk_kid_id` FOREIGN KEY (`child_id`) REFERENCES `kid` (`id`),
  CONSTRAINT `report_repas_id_dd2689a6_fk_repas_id` FOREIGN KEY (`repas_id`) REFERENCES `repas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_activities`
--

DROP TABLE IF EXISTS `report_activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report_activities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dailychildreport_id` int(11) NOT NULL,
  `childactivity_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `report_activities_dailychildreport_id_chil_000bf0f5_uniq` (`dailychildreport_id`,`childactivity_id`),
  KEY `report_activities_childactivity_id_4c381ec0_fk_activity_id` (`childactivity_id`),
  CONSTRAINT `report_activities_childactivity_id_4c381ec0_fk_activity_id` FOREIGN KEY (`childactivity_id`) REFERENCES `activity` (`id`),
  CONSTRAINT `report_activities_dailychildreport_id_e0102672_fk_report_id` FOREIGN KEY (`dailychildreport_id`) REFERENCES `report` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_activities`
--

LOCK TABLES `report_activities` WRITE;
/*!40000 ALTER TABLE `report_activities` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_user_has_event_type`
--

DROP TABLE IF EXISTS `system_user_has_event_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `system_user_has_event_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_type_id` int(11) NOT NULL,
  `system_user_id` int(11) NOT NULL,
  `can_unsubscribe` int(11) NOT NULL,
  `date_created` datetime(6) NOT NULL,
  `last_updated` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `system_user_has_event_ty_event_type_id_system_use_10c60712_uniq` (`event_type_id`,`system_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_user_has_event_type`
--

LOCK TABLES `system_user_has_event_type` WRITE;
/*!40000 ALTER TABLE `system_user_has_event_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `system_user_has_event_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_module_perm`
--

DROP TABLE IF EXISTS `user_module_perm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_module_perm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_id` int(11) NOT NULL,
  `system_user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_module_perm_module_id_1a85e8da_fk` (`module_id`),
  KEY `user_module_perm_system_user_id_0971982c_fk` (`system_user_id`),
  CONSTRAINT `user_module_perm_module_id_1a85e8da_fk` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`),
  CONSTRAINT `user_module_perm_system_user_id_0971982c_fk` FOREIGN KEY (`system_user_id`) REFERENCES `web_users` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_module_perm`
--

LOCK TABLES `user_module_perm` WRITE;
/*!40000 ALTER TABLE `user_module_perm` DISABLE KEYS */;
INSERT INTO `user_module_perm` VALUES (1,1,1),(2,2,1),(3,3,1),(4,4,1),(5,5,1),(6,6,1),(7,7,1),(8,8,1),(9,1,2),(10,2,2),(11,3,2),(12,4,2),(13,5,2),(14,6,2),(15,7,2),(16,8,2),(17,8,3);
/*!40000 ALTER TABLE `user_module_perm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `web_email_audit`
--

DROP TABLE IF EXISTS `web_email_audit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `web_email_audit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `latest_test` datetime(6) NOT NULL,
  `issue_number` int(11) NOT NULL,
  `is_abort` int(11) NOT NULL,
  `prepared_at` datetime(6) NOT NULL,
  `date_created` datetime(6) DEFAULT NULL,
  `last_updated` datetime(6) DEFAULT NULL,
  `email_body` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `web_email_audit`
--

LOCK TABLES `web_email_audit` WRITE;
/*!40000 ALTER TABLE `web_email_audit` DISABLE KEYS */;
/*!40000 ALTER TABLE `web_email_audit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `web_user_detail`
--

DROP TABLE IF EXISTS `web_user_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `web_user_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(192) DEFAULT NULL,
  `description` longtext,
  `can_use_admin` int(11) NOT NULL,
  `alert_frequency` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `web_user_detail`
--

LOCK TABLES `web_user_detail` WRITE;
/*!40000 ALTER TABLE `web_user_detail` DISABLE KEYS */;
INSERT INTO `web_user_detail` VALUES (1,1,'zigdidier@gmail.com','',1,'never'),(2,2,'d.zigama@pivotaccess.com','',1,'never'),(3,3,'duwantwali@gmail.com','',0,'never');
/*!40000 ALTER TABLE `web_user_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `web_users`
--

DROP TABLE IF EXISTS `web_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `web_users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(180) NOT NULL,
  `pass` varchar(384) NOT NULL,
  `mail` varchar(762) NOT NULL,
  `theme` varchar(765) NOT NULL,
  `signature` varchar(765) NOT NULL,
  `signature_format` varchar(765) NOT NULL,
  `created` int(11) NOT NULL,
  `access` int(11) NOT NULL,
  `login` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `timezone` varchar(96) NOT NULL,
  `language` varchar(36) NOT NULL,
  `init` varchar(762) NOT NULL,
  `data` longtext NOT NULL,
  `picture` int(11) NOT NULL,
  `uuid` varchar(108) NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `web_users`
--

LOCK TABLES `web_users` WRITE;
/*!40000 ALTER TABLE `web_users` DISABLE KEYS */;
INSERT INTO `web_users` VALUES (1,'zigdidier@gmail.com','$S$Dp...s...s9r.4XkgdjFWOHes03aZKxE0pZEbRCKJVmF7YKH/IRP','zigdidier@gmail.com','','','',1588672702,0,0,1,'','','','',0,''),(2,'d.zigama@pivotaccess.com','$S$Do...r...ra/nt6HQ.DBdnfmoJneXchVjKUBWic5vGHE//uRj1wt','d.zigama@pivotaccess.com','','','',1588693790,0,0,1,'','','','',0,''),(3,'duwantwali@gmail.com','$S$Do...r...Fjs7M0LkNdPYjpot8IDpOr./9Qy5HxRev1i68vs3XjH','duwantwali@gmail.com','','','',1588693944,0,0,1,'','','','',0,'');
/*!40000 ALTER TABLE `web_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-20 21:23:40
