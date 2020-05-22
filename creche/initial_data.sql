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

-- Dump completed on 2020-05-07 11:58:38
