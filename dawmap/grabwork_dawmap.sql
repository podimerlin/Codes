-- MySQL dump 10.13  Distrib 5.6.34, for Linux (x86_64)
--
-- Host: localhost    Database: grabwork_dawmap
-- ------------------------------------------------------
-- Server version	5.6.34

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
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `total` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` (`id`, `name`, `total`) VALUES (1,'dauxanh',2),(2,'raumuong',2),(3,'dauphong',2),(4,'bananas',2),(5,'apple',2),(6,'samsung',2),(7,'web',1),(8,'panda',1),(9,'kungfu',1),(10,'kekeke',1),(11,'bbb',1),(12,'gagaga',0),(13,'iphone',1),(14,'xiaogongislove',1),(15,'gggg',0),(16,'clean',1),(17,'cleaning',1),(18,'parttime',1),(19,'locksmith',1),(20,'24hr',1),(21,'pokemon',1),(22,'pokemongo',1),(23,'sell',1),(24,'dota',1),(25,'dotaasia',1),(26,'catcafe',1),(27,'cafe',1),(28,'ggmu',1),(29,'manchester',1),(30,'soccer',1),(31,'updates',1),(32,'woodland',1);
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `display_name` varchar(50) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `state` smallint(6) DEFAULT '1',
  `avatar` varchar(255) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `mobilephone` varchar(50) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `description` text,
  `hashtag` varchar(255) DEFAULT NULL,
  `date_added` datetime DEFAULT NULL,
  `date_modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `username`, `email`, `display_name`, `password`, `state`, `avatar`, `gender`, `mobilephone`, `latitude`, `longitude`, `description`, `hashtag`, `date_added`, `date_modified`) VALUES (1,NULL,'phudt90@gmail.com','Phu Do','$2y$14$Qe5F6sQaY1lyqESblSXxjOaf9iFq5bPaTOidHTg4JezisWXIcwEEW',1,'phpIx46Ut_582994b57a213.png',NULL,NULL,1.3696768281,103.759359748,'I have a pen. I have an apple #dauxanh #raumuong #dauphong #bananas #apple #samsung #iphone ....','dauxanh,raumuong,dauphong,bananas,apple,samsung,iphone','2016-10-05 22:50:14','2016-11-14 23:54:48'),(2,NULL,'phudt900@gmail.com','Hieu Do','$2y$14$MIygZxxiiluJ4AWE3hkst.rBR2wFrGkSx7HFcdUDbhhqzHUFtbRHy',1,NULL,NULL,NULL,1.34863275387,103.8674635,'lorem isum dolor sit amet #dauxanh #raumuong #web #panda #kungfu #dauphong #bananas #apple #samsung #kekeke #bbb','dauxanh,raumuong,web,panda,kungfu,dauphong,bananas,apple,samsung,kekeke,bbb','2016-10-05 23:16:16','2016-11-15 00:15:44'),(3,NULL,'minhmenly@gmail.com','Louis','$2y$14$i6lb./iDjiS6D268sSA7JeEFLOMriwzO2yekZFPXdh0hPgnMovrji',1,'phpzTObAP_581b035cb145c.png',NULL,NULL,1.34704534581,103.850747975,'Update here','','2016-10-06 17:55:45','2016-11-03 17:29:17'),(4,NULL,'dan2167@hotmail.com','danielll','$2y$14$2SUfV/MZ8Bp8bxODLnlt3.y9FONXPiigVj9HceOtEU3oMfn05r3wi',1,'php8qGabr_5836a40b25cb4.png',NULL,NULL,1.37082762664,103.84305841,'24hr locksmith service\r\nAt your doorstep in 15min.\r\nCall 23456788\r\n#locksmith #24hr','locksmith,24hr','2016-10-14 20:31:09','2016-11-24 16:27:41'),(5,NULL,'fredaaapoh@gmail.com','Fredapoh','$2y$14$37zBPBxs0dTZ9vuBVJT4IOGUAUuPtCAMmckFAG1FJYJxjVlLqZl3u',1,NULL,NULL,NULL,1.44486202146,103.824889784,'#xiaogongislove','xiaogongislove','2016-11-15 22:37:43','2016-11-15 22:39:13'),(6,NULL,'a@gmail.com','Adeline','$2y$14$3.l2kbHIs/nOuJN5Jzt3BeYMV/ZkmcUVEnQ.S4wloj9yBGZhUMu2y',1,'phpZEzfp4_5836a37894254.png',NULL,NULL,1.36375619541,103.774594696,'Looking for part-time cleaner for my house. Call 81234564. #clean #cleaning #parttime','clean,cleaning,parttime','2016-11-24 16:22:09','2016-11-24 16:24:25'),(7,NULL,'b@gmail.com','Barry','$2y$14$usStOdrOXrJpqJiOPeykgu6viVtX3UpHWllSTwgCQwzgOoBKjOlhW',1,'phpXXKylF_5836a4fdbf0f3.png',NULL,NULL,1.32634432714,103.800000579,'Selling BNIB pokemon cards collection.\r\nEmail me to find out more.\r\n#pokemon #pokemongo #sell','pokemon,pokemongo,sell','2016-11-24 16:29:07','2016-11-24 16:30:51'),(8,NULL,'c@gmail.com','Candy Toh','$2y$14$YDlEteeaJ.c/kz5BJLrxT.lmGz920Inucuc6fDRymNVuIvj0zt/ia',1,'phpQ3s0Mw_5836a59c0e3bc.png',NULL,NULL,1.30540716218,103.850297363,'Thank you BNI Affinity chapter!\r\nThank you for giving me an opportunity to share what I do in estate planning. (Hope it is not boring, haha)\r\nThank you my fellow Affinity members!','','2016-11-24 16:31:57','2016-11-24 16:33:49'),(9,NULL,'d@gmail.com','Derick','$2y$14$HF.GWnETjZ4IZHaAOzDlEegLj/m9mR7S9R/oO9JRHzZGHzllf1rYm',1,'phpHlogce_5836a6fb9c917.png',NULL,NULL,1.38537930464,103.871583374,'Looking for dota players to join my dota team for Asian dominance, email me your CV.\r\n#dota #dotaasia','dota,dotaasia','2016-11-24 16:34:57','2016-11-24 16:39:39'),(10,NULL,'e@gmail.com','Elise Yeo','$2y$14$bMr7u4NYIBmv2yAd21/wLeCze7ZxJaVRQWC7yeYihzjcBCazfxpUy',1,'php0T0lyA_5836a7b792deb.png',NULL,NULL,1.31845000691,103.890981109,'Provide full service, $500 per shot.\r\nWhatapps 65746253\r\nLineID: elisesexy','','2016-11-24 16:40:43','2016-11-24 16:42:19'),(11,NULL,'f@gmail.com','Feline Cafe','$2y$14$HLUIeZib1ISHdA/KAEdO/OYjxEXfD.nnt.6MMJEWuh0FXdosImHW6',1,'phpUTOf6U_5836a8d48a40a.png',NULL,NULL,1.34127482035,103.715371521,'54A Boat Quay (Level 2)\r\nSingapore 049843\r\n*we are NOT at Clarke Quay*\r\n\r\nTelephone: (65) 6536 5319\r\n*Reservations recommended*\r\n\r\nMon, Wed to Fri: 11am to 10pm (last entry at 9pm)\r\nSat, Sun & Public Holidays: 10am to 10pm (last entry at 9pm)\r\nClosed on Tuesdays\r\n\r\n#catcafe #cafe','catcafe,cafe','2016-11-24 16:45:11','2016-11-24 16:46:52'),(12,NULL,'g@gmail.com','Gabriel Tang','$2y$14$azOExVEpNyJsPmTbaBYFMOcwo8hFwZZnipVB8pfPD5Vr5Pz08zx02',1,'phpeRt9kT_5836a96054d11.png',NULL,NULL,1.34316257739,103.941792877,'Boring football by LVG is sorely missed. Last season 1-1 draw at the Bridge.. \r\n#ggmu #manchester #soccer #updates','ggmu,manchester,soccer,updates','2016-11-24 16:48:13','2016-11-24 16:49:12'),(13,NULL,'HAHAHA@daniel.com','HAHAHA','$2y$14$QP4LDZo8iDXe9f2WE/IK8OQKeU21dhiFYdaR02urbGlviU80r/juq',1,'phpCK31d8_5836b20e418b1.png',NULL,NULL,1.5344187747,103.660869033,'need mahjong kaki #woodland','woodland','2016-11-24 17:18:15','2016-11-24 17:30:00'),(14,NULL,'haitruonginfotech@gmail.com','Hai Truong','$2y$14$5xV8rF4BYkpTkVs/on/n7.ocXr8UuZUSQk/H7UzpVnxW93OHiOEB2',1,NULL,NULL,NULL,1.43892138588,103.739404112,NULL,NULL,'2017-02-15 16:27:03','2017-02-15 16:27:03');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'grabwork_dawmap'
--

--
-- Dumping routines for database 'grabwork_dawmap'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-02-25 13:00:41
