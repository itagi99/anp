/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.8-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: u661310939_byit
-- ------------------------------------------------------
-- Server version	11.8.8-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES
(1,'admin','$2y$10$pOQasi1RX31oKeWqwl.g..mR9P/3F4pJ9MJsB4D/GTQpWxA1yYJbC','2025-08-24 14:28:35');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `attendance_edit_logs`
--

DROP TABLE IF EXISTS `attendance_edit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_edit_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `attendance_id` int(11) NOT NULL,
  `supervisor_id` int(11) NOT NULL,
  `salesman_id` int(11) NOT NULL,
  `old_punch_in` time DEFAULT NULL,
  `old_punch_out` time DEFAULT NULL,
  `old_working_hours` decimal(5,2) DEFAULT NULL,
  `new_punch_in` time DEFAULT NULL,
  `new_punch_out` time DEFAULT NULL,
  `new_working_hours` decimal(5,2) DEFAULT NULL,
  `old_status` varchar(20) DEFAULT NULL,
  `new_status` varchar(20) DEFAULT NULL,
  `edit_reason` text DEFAULT NULL,
  `edited_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `attendance_id` (`attendance_id`),
  KEY `supervisor_id` (`supervisor_id`),
  KEY `salesman_id` (`salesman_id`),
  CONSTRAINT `attendance_edit_logs_ibfk_1` FOREIGN KEY (`attendance_id`) REFERENCES `salesman_attendance` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_edit_logs_ibfk_2` FOREIGN KEY (`supervisor_id`) REFERENCES `supervisor_accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_edit_logs_ibfk_3` FOREIGN KEY (`salesman_id`) REFERENCES `salesman_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_edit_logs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `attendance_edit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_edit_logs` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) NOT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES
(16,'','banners/banner_69189210dfff34.31617533.png','#',1,'2025-11-15 14:45:36',NULL),
(21,'Parle','banners/banner_692e6273272074.91616324.jpg','#',0,'2025-12-02 03:52:19',NULL),
(22,'colgate offer','banners/banner_69310ed0baa193.89949525.png','#',0,'2025-12-04 04:32:16',NULL),
(23,'parle offer','banners/banner_693111e3a921e4.62724838.png','',0,'2025-12-04 04:45:23',NULL),
(24,'delivery charge attention','banners/banner_6935a0379bc454.06548899.png','#',1,'2025-12-07 15:18:04',NULL),
(25,'BABOOL OFFER','banners/banner_693a604b9c8800.22865634.png','product_detail.php?id=499',0,'2025-12-11 06:10:19',NULL);
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES
(1,'FORTUNE','uploads/brands/brand_1762010494_6906257e402d5.jpg','2025-11-01 14:51:26','2025-11-01 15:21:34'),
(3,'PARLE','uploads/brands/brand_1762009054_69061fdeab588.png','2025-11-01 14:51:26','2025-11-01 14:57:34'),
(4,'GOYAL INDUSTRIES','uploads/brands/brand_1762009442_690621628d634.jpg','2025-11-01 15:04:02','2025-11-01 15:04:02'),
(5,'BRITANIA','uploads/brands/brand_1763204603_69185dfbb4535.png','2025-11-15 11:03:23','2025-11-15 11:03:23'),
(6,'HUL','uploads/brands/brand_1763204638_69185e1ee281b.jpg','2025-11-15 11:03:58','2025-11-15 11:03:58'),
(7,'COLGATE','uploads/brands/brand_1763205349_691860e521bb2.png','2025-11-15 11:15:49','2025-11-15 11:15:49'),
(8,'reckitt','uploads/brands/brand_1763304720_6919e5108a315.png','2025-11-16 14:52:00','2025-11-16 14:52:00'),
(9,'PATANJALI','uploads/brands/brand_1763513061_691d12e591970.png','2025-11-19 00:44:21','2025-11-19 00:44:21'),
(10,'nestle','uploads/brands/brand_1763516346_691d1fba885bb.jpg','2025-11-19 01:39:06','2025-11-19 01:39:51'),
(11,'SANTOOR','uploads/brands/brand_1763610396_691e8f1c1d818.png','2025-11-20 03:46:36','2025-11-20 03:46:36'),
(12,'MTR','uploads/brands/brand_1763738727_692084678c7bc.png','2025-11-21 15:25:27','2025-11-21 15:25:27');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES
(1,'BISCUITS','uploads/category_1763140716_6917646ca6f33.jpg','2025-08-24 14:32:50','2025-11-14 17:18:36'),
(2,'EDIBLE OILS','uploads/category_1763140764_6917649c9ebd5.jpg','2025-08-24 18:05:37','2025-11-14 17:19:24'),
(3,'CHIPS & SNACKS','uploads/category_1763140744_69176488eacd0.png','2025-09-12 16:12:47','2025-11-14 17:19:04'),
(4,'ORAL CARES','uploads/category_1763140835_691764e3203ae.jpg','2025-10-02 12:59:31','2025-11-14 17:20:35'),
(5,'ATTA SOOJI','uploads/category_1763140584_691763e8228ff.PNG','2025-10-02 17:09:49','2025-11-14 17:16:24'),
(6,'health care','uploads/category_1763140822_691764d69d7a8.jpg','2025-11-01 13:58:54','2025-11-14 17:20:22'),
(7,'GENERAL PRODUCTS','uploads/category_1763174122_6917e6ea8874f.png','2025-11-15 02:35:22','2025-11-15 02:35:22'),
(8,'RICES','uploads/category_1763175913_6917ede9b9ec4.png','2025-11-15 02:39:12','2025-11-15 03:05:13'),
(9,'DALS AND PULSES','uploads/category_1763175448_6917ec183936b.jpg','2025-11-15 02:57:28','2025-11-15 02:57:28'),
(10,'POOJA ESSENTIALS','uploads/category_1763175717_6917ed25534a9.PNG','2025-11-15 03:01:57','2025-11-15 03:01:57'),
(11,'HAIR CARE','uploads/category_1763175819_6917ed8beab52.jpg','2025-11-15 03:03:39','2025-11-15 03:03:39'),
(12,'MALASA ITEMS','uploads/category_1763176343_6917ef97f18ce.jpg','2025-11-15 03:12:23','2025-11-15 03:12:23'),
(13,'SALTS,SUGARS & JAGGERY','uploads/category_1763176528_6917f0507a2fa.jpg','2025-11-15 03:15:28','2025-11-15 03:15:28'),
(14,'SOAPS & DETERGENTS','uploads/category_1763176631_6917f0b70eb57.jpg','2025-11-15 03:17:11','2025-11-15 03:17:11'),
(15,'HOME CARE','uploads/category_1763176732_6917f11ce80a4.jpg','2025-11-15 03:18:52','2025-11-15 03:18:52'),
(16,'BODY SOAPS AND CREAMS','uploads/category_1763176805_6917f1655b056.jpg','2025-11-15 03:20:05','2025-11-15 03:20:05'),
(17,'INSTANTS & READY TO COOK','uploads/category_1763176957_6917f1fd2ce7f.jpg','2025-11-15 03:22:37','2025-11-15 03:22:37'),
(18,'COLD DRINKS AND SOFT DRINKS','uploads/category_1763478204_691c8abc0a5b0.png','2025-11-18 12:20:00','2025-11-18 15:03:24'),
(19,'CHOCOLATES','uploads/category_1763967521_6924022149139.jpg','2025-11-22 11:29:07','2025-11-24 06:58:41');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `commission_payouts`
--

DROP TABLE IF EXISTS `commission_payouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `commission_payouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesman_id` int(11) NOT NULL,
  `month_year` varchar(7) DEFAULT NULL,
  `total_sales` decimal(12,2) DEFAULT NULL,
  `total_commission` decimal(12,2) DEFAULT NULL,
  `status` enum('pending','paid','rejected') DEFAULT 'pending',
  `paid_date` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_payout` (`salesman_id`,`month_year`),
  KEY `idx_status` (`status`),
  CONSTRAINT `commission_payouts_ibfk_1` FOREIGN KEY (`salesman_id`) REFERENCES `salesmen` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commission_payouts`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `commission_payouts` DISABLE KEYS */;
/*!40000 ALTER TABLE `commission_payouts` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `scope` enum('sitewide','category','item','grand_total') NOT NULL DEFAULT 'sitewide',
  `discount_type` enum('percentage','amount') NOT NULL DEFAULT 'percentage',
  `discount_value` decimal(12,2) NOT NULL DEFAULT 0.00,
  `category_id` int(10) unsigned DEFAULT NULL,
  `product_id` int(10) unsigned DEFAULT NULL,
  `min_cart_total` decimal(12,2) DEFAULT NULL,
  `discount_percent` int(11) NOT NULL,
  `expiry_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `uq_coupons_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `delivery_charge_rules`
--

DROP TABLE IF EXISTS `delivery_charge_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_charge_rules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rule_name` varchar(100) NOT NULL,
  `min_order_value` decimal(10,2) NOT NULL DEFAULT 0.00,
  `max_order_value` decimal(10,2) DEFAULT NULL,
  `delivery_charge` decimal(10,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `priority` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_charge_rules`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `delivery_charge_rules` DISABLE KEYS */;
INSERT INTO `delivery_charge_rules` VALUES
(1,'Below 500',0.00,500.00,150.00,1,1,'2025-12-07 14:27:12','2025-12-07 15:04:25'),
(2,'500 to 1000',500.00,1500.00,100.00,1,2,'2025-12-07 14:27:12','2025-12-07 15:04:42'),
(3,'1000 to 2000',1500.00,1999.00,50.00,1,3,'2025-12-07 14:27:12','2025-12-07 15:05:40'),
(4,'Above 2000 - Free',2000.00,NULL,0.00,1,4,'2025-12-07 14:27:12','2025-12-07 14:27:12');
/*!40000 ALTER TABLE `delivery_charge_rules` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `deliverymen`
--

DROP TABLE IF EXISTS `deliverymen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `deliverymen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `contact_info` varchar(255) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `status` enum('available','busy') DEFAULT 'available',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deliverymen`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `deliverymen` DISABLE KEYS */;
INSERT INTO `deliverymen` VALUES
(7,'iranna','9876543211','i','$2y$10$cKIWLNp5S2owuGmJ5XoGpe4anA8DIF9Hb4XFx.5M4bY4oTN3deYsG','available',1,'2026-01-14 08:31:13');
/*!40000 ALTER TABLE `deliverymen` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `excluded_categories_delivery`
--

DROP TABLE IF EXISTS `excluded_categories_delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `excluded_categories_delivery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `exclude_from_delivery_calc` tinyint(1) DEFAULT 1,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_category` (`category_id`),
  CONSTRAINT `excluded_categories_delivery_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `excluded_categories_delivery`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `excluded_categories_delivery` DISABLE KEYS */;
/*!40000 ALTER TABLE `excluded_categories_delivery` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `excluded_products_delivery`
--

DROP TABLE IF EXISTS `excluded_products_delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `excluded_products_delivery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `exclude_from_delivery_calc` tinyint(1) DEFAULT 1,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_product` (`product_id`),
  CONSTRAINT `excluded_products_delivery_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `excluded_products_delivery`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `excluded_products_delivery` DISABLE KEYS */;
INSERT INTO `excluded_products_delivery` VALUES
(1,476,1,NULL,'2025-12-07 15:10:11'),
(2,475,1,NULL,'2025-12-07 15:10:20'),
(4,316,1,NULL,'2025-12-07 15:11:25');
/*!40000 ALTER TABLE `excluded_products_delivery` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `flash_deals`
--

DROP TABLE IF EXISTS `flash_deals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `flash_deals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `flash_price` decimal(10,2) NOT NULL,
  `flash_start` datetime NOT NULL,
  `flash_end` datetime NOT NULL,
  `status` tinyint(1) DEFAULT 1 COMMENT '1=Active, 0=Inactive',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `flash_deals_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flash_deals`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `flash_deals` DISABLE KEYS */;
INSERT INTO `flash_deals` VALUES
(4,260,740.00,'2025-11-20 08:22:00','2025-11-21 08:22:00',1,'2025-11-20 02:52:50','2025-11-20 02:52:50'),
(5,430,715.00,'2025-11-20 08:32:00','2025-11-21 08:32:00',1,'2025-11-20 03:02:04','2025-11-20 03:02:04'),
(8,488,488.00,'2025-12-04 13:32:00','2025-12-05 13:32:00',1,'2025-12-04 08:02:02','2025-12-04 08:02:02');
/*!40000 ALTER TABLE `flash_deals` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `order_delivery_details`
--

DROP TABLE IF EXISTS `order_delivery_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_delivery_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `subtotal_for_delivery` decimal(10,2) NOT NULL,
  `excluded_products_value` decimal(10,2) DEFAULT 0.00,
  `delivery_charge_applied` decimal(10,2) NOT NULL,
  `rule_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `rule_id` (`rule_id`),
  CONSTRAINT `order_delivery_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_delivery_details_ibfk_2` FOREIGN KEY (`rule_id`) REFERENCES `delivery_charge_rules` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_delivery_details`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `order_delivery_details` DISABLE KEYS */;
INSERT INTO `order_delivery_details` VALUES
(1,3,1575.00,0.00,50.00,3,'2026-07-11 12:30:05');
/*!40000 ALTER TABLE `order_delivery_details` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `delivered_qty` int(11) DEFAULT NULL,
  `item_status` enum('pending','delivered','returned','partial') NOT NULL DEFAULT 'pending',
  `return_reason` enum('','defective','not-needed','no-cash','customer-unavailable','address-issue','other') NOT NULL DEFAULT '',
  `price_each` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order` (`order_id`),
  KEY `fk_order_product` (`product_id`),
  CONSTRAINT `fk_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES
(1,1,424,1,NULL,'pending','',2352.00),
(2,2,303,2,NULL,'pending','',1575.00),
(3,3,303,1,NULL,'pending','',1575.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `deliveryman_id` int(11) DEFAULT NULL,
  `delivery_status` enum('assigned','out-for-delivery','delivered','canceled','failed','re-attempt') NOT NULL DEFAULT 'assigned',
  `delivery_status_updated_at` datetime DEFAULT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `total_price` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL DEFAULT 'cash',
  `delivery_charge` decimal(10,2) DEFAULT 0.00,
  `delivery_address` text NOT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  `coupon_code` varchar(80) DEFAULT NULL,
  `coupon_discount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_order_user` (`user_id`),
  KEY `idx_deliveryman_id` (`deliveryman_id`),
  KEY `idx_orders_coupon_code` (`coupon_code`),
  KEY `idx_orders_order_date` (`order_date`),
  CONSTRAINT `fk_order_deliveryman` FOREIGN KEY (`deliveryman_id`) REFERENCES `deliverymen` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES
(1,414,NULL,'assigned',NULL,'pending',2352.00,'cash',0.00,'Flat no 3 near Deccan college, Gulbarga, Karnataka - 585104, India','2026-06-06 22:37:47',NULL,0.00,'2026-06-06 17:07:47'),
(2,415,NULL,'assigned',NULL,'pending',3150.00,'cash',0.00,'Pannipoori shivanna building 2nd paravathipura hosakote, Hosakote, Karnataka - 562114, India','2026-07-11 17:56:41',NULL,0.00,'2026-07-11 12:26:41'),
(3,415,NULL,'assigned',NULL,'pending',1625.00,'cash',50.00,'Pannipoori shivanna building 2nd paravathipura hosakote, Hosakote, Karnataka - 562114, India','2026-07-11 18:00:05',NULL,0.00,'2026-07-11 12:30:05');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `performance_alerts`
--

DROP TABLE IF EXISTS `performance_alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `performance_alerts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesman_id` int(11) NOT NULL,
  `supervisor_id` int(11) NOT NULL,
  `alert_type` enum('underperforming','low_attendance','high_commission','target_achieved') DEFAULT 'underperforming',
  `message` text DEFAULT NULL,
  `severity` enum('low','medium','high','critical') DEFAULT 'medium',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `supervisor_id` (`supervisor_id`,`is_read`),
  KEY `salesman_id` (`salesman_id`),
  CONSTRAINT `performance_alerts_ibfk_1` FOREIGN KEY (`salesman_id`) REFERENCES `salesman_accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `performance_alerts_ibfk_2` FOREIGN KEY (`supervisor_id`) REFERENCES `supervisor_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `performance_alerts`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `performance_alerts` DISABLE KEYS */;
/*!40000 ALTER TABLE `performance_alerts` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `popups`
--

DROP TABLE IF EXISTS `popups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `popups` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(160) NOT NULL,
  `message` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `button_text` varchar(80) DEFAULT NULL,
  `button_link` varchar(255) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `per_session` tinyint(1) NOT NULL DEFAULT 1,
  `dismissible` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `popups`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `popups` DISABLE KEYS */;
INSERT INTO `popups` VALUES
(9,'welcome back to ANPmart','have great purchase','https://png.pngtree.com/png-clipart/20200522/ourmid/pngtree-big-sale-best-offer-png-image_2210803.jpg','shop now','',1,'2026-05-10 20:24:00','2026-05-11 20:24:00',1,1,'2026-05-10 14:54:46','2026-05-10 14:54:46');
/*!40000 ALTER TABLE `popups` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `pos_bill_items`
--

DROP TABLE IF EXISTS `pos_bill_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pos_bill_items` (
  `bill_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `bill_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `line_total` decimal(12,2) NOT NULL,
  PRIMARY KEY (`bill_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pos_bill_items`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `pos_bill_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `pos_bill_items` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `pos_bills`
--

DROP TABLE IF EXISTS `pos_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pos_bills` (
  `bill_id` int(11) NOT NULL AUTO_INCREMENT,
  `bill_number` varchar(50) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `bill_date` timestamp NULL DEFAULT current_timestamp(),
  `subtotal` decimal(12,2) DEFAULT 0.00,
  `tax_amount` decimal(12,2) DEFAULT 0.00,
  `tax_percent` decimal(5,2) DEFAULT 0.00,
  `discount_amount` decimal(12,2) DEFAULT 0.00,
  `total_amount` decimal(12,2) DEFAULT 0.00,
  `paid_amount` decimal(12,2) DEFAULT 0.00,
  `due_amount` decimal(12,2) DEFAULT 0.00,
  `payment_method` varchar(50) DEFAULT 'CASH',
  `bill_notes` text DEFAULT NULL,
  `admin_id` int(11) NOT NULL,
  `bill_status` varchar(20) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`bill_id`),
  UNIQUE KEY `bill_number` (`bill_number`),
  KEY `idx_customer` (`customer_id`),
  KEY `idx_admin` (`admin_id`),
  KEY `idx_date` (`bill_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pos_bills`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `pos_bills` DISABLE KEYS */;
/*!40000 ALTER TABLE `pos_bills` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `product_tier_prices`
--

DROP TABLE IF EXISTS `product_tier_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_tier_prices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `min_quantity` int(11) NOT NULL,
  `discount_type` enum('amount','percentage') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`,`min_quantity`),
  CONSTRAINT `product_tier_prices_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_tier_prices`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `product_tier_prices` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_tier_prices` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `product_tier_pricing`
--

DROP TABLE IF EXISTS `product_tier_pricing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_tier_pricing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `min_quantity` int(11) NOT NULL COMMENT 'Minimum quantity to qualify',
  `discount_type` enum('amount','percentage') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL COMMENT 'Discount amount or percentage',
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`,`min_quantity`),
  CONSTRAINT `product_tier_pricing_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=522 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_tier_pricing`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `product_tier_pricing` DISABLE KEYS */;
INSERT INTO `product_tier_pricing` VALUES
(79,324,12,'percentage',1.00),
(80,324,25,'percentage',1.50),
(111,363,96,'amount',1.76),
(115,295,12,'amount',4.46),
(116,295,60,'amount',5.71),
(135,384,16,'percentage',1.00),
(136,384,32,'percentage',2.00),
(139,382,2,'percentage',2.00),
(140,388,3,'percentage',2.00),
(142,383,2,'percentage',1.50),
(149,387,3,'percentage',1.00),
(150,387,6,'percentage',1.50),
(151,387,12,'percentage',2.00),
(157,381,2,'percentage',1.00),
(158,381,5,'percentage',2.00),
(159,381,22,'percentage',5.00),
(160,337,6,'percentage',1.00),
(161,337,12,'percentage',2.00),
(162,337,24,'percentage',4.00),
(163,338,3,'percentage',1.00),
(164,338,6,'percentage',2.00),
(165,338,12,'percentage',3.00),
(166,338,48,'percentage',4.00),
(167,416,3,'percentage',1.00),
(168,416,6,'percentage',2.00),
(169,416,12,'percentage',2.50),
(170,416,24,'percentage',3.50),
(171,359,12,'percentage',7.00),
(172,359,36,'percentage',8.00),
(173,359,308,'percentage',9.00),
(174,331,10,'percentage',5.00),
(175,331,20,'amount',20.00),
(178,371,10,'amount',5.00),
(187,370,12,'percentage',6.00),
(188,370,24,'percentage',7.50),
(189,370,100,'percentage',7.50),
(190,325,12,'percentage',8.00),
(191,325,60,'percentage',10.30),
(194,375,12,'percentage',7.00),
(195,375,60,'percentage',8.50),
(196,321,5,'amount',3.00),
(200,281,5,'amount',5.00),
(201,281,10,'amount',7.00),
(202,281,30,'amount',10.00),
(203,282,5,'amount',10.00),
(204,282,10,'amount',12.00),
(205,282,30,'amount',15.00),
(206,278,5,'amount',5.00),
(207,278,10,'amount',8.00),
(208,278,30,'amount',13.00),
(212,276,5,'amount',6.00),
(213,276,10,'amount',10.00),
(214,276,30,'amount',12.00),
(215,285,5,'amount',15.00),
(216,285,10,'amount',18.00),
(217,285,30,'amount',20.00),
(218,286,5,'amount',10.00),
(219,286,10,'amount',12.00),
(220,286,30,'amount',13.00),
(221,284,5,'amount',10.00),
(222,284,10,'amount',14.00),
(223,284,30,'amount',18.00),
(224,283,5,'amount',25.00),
(225,283,10,'amount',26.00),
(226,283,30,'amount',29.00),
(230,427,5,'amount',12.00),
(231,427,10,'amount',14.00),
(232,427,30,'amount',15.00),
(239,429,5,'amount',20.00),
(240,429,10,'amount',25.00),
(241,429,30,'amount',30.00),
(244,263,60,'amount',0.85),
(246,432,3,'amount',25.00),
(247,432,6,'amount',45.00),
(250,349,90,'amount',1.00),
(251,364,12,'percentage',1.00),
(252,364,168,'amount',1.00),
(253,376,8,'amount',0.20),
(259,326,15,'amount',0.90),
(260,372,30,'percentage',1.00),
(265,265,12,'amount',2.00),
(266,265,60,'amount',5.00),
(269,436,6,'amount',5.00),
(270,436,20,'amount',10.00),
(274,438,50,'amount',12.00),
(275,426,9,'amount',0.25),
(283,431,6,'amount',7.80),
(284,431,12,'amount',9.80),
(285,431,30,'amount',10.80),
(303,253,8,'amount',1.00),
(305,280,5,'amount',17.00),
(306,280,10,'amount',18.00),
(307,280,30,'amount',23.00),
(309,447,24,'amount',7.00),
(310,449,12,'amount',9.00),
(311,450,12,'amount',5.00),
(313,267,60,'amount',0.87),
(317,458,3,'amount',25.00),
(318,261,20,'amount',2.00),
(320,320,12,'amount',0.70),
(321,320,140,'amount',0.75),
(327,467,5,'amount',4.00),
(328,467,30,'amount',5.80),
(333,437,5,'amount',2.50),
(334,437,10,'amount',3.50),
(335,437,30,'amount',6.00),
(336,469,6,'amount',5.00),
(337,469,12,'amount',10.00),
(341,473,6,'amount',2.50),
(345,440,6,'percentage',5.00),
(346,440,12,'percentage',6.00),
(347,440,80,'percentage',8.00),
(350,348,12,'percentage',2.00),
(351,348,90,'amount',1.00),
(355,386,6,'percentage',1.00),
(356,386,12,'percentage',1.50),
(357,386,24,'percentage',2.00),
(358,322,12,'amount',0.01),
(359,322,84,'amount',0.10),
(360,453,24,'amount',2.00),
(362,478,6,'amount',1.60),
(363,478,15,'amount',5.00),
(366,264,60,'amount',1.50),
(369,446,24,'amount',7.00),
(372,485,3,'amount',3.00),
(373,485,6,'amount',20.00),
(374,484,12,'amount',5.00),
(375,484,30,'amount',8.00),
(376,302,10,'amount',1.00),
(377,302,30,'amount',1.05),
(388,344,18,'amount',1.50),
(389,454,6,'amount',1.00),
(390,454,20,'amount',4.00),
(391,492,12,'amount',20.00),
(393,399,12,'amount',1.00),
(394,399,144,'amount',2.00),
(395,398,6,'amount',2.00),
(397,476,10,'amount',5.50),
(402,495,8,'amount',10.00),
(403,291,30,'amount',0.90),
(406,499,3,'amount',11.70),
(409,503,3,'percentage',12.00),
(410,504,9,'amount',11.00),
(411,428,5,'amount',1.00),
(412,428,10,'amount',5.00),
(413,505,12,'amount',4.50),
(414,506,12,'amount',3.80),
(418,507,6,'amount',1.00),
(419,507,28,'amount',3.00),
(421,327,12,'percentage',0.01),
(422,327,90,'amount',0.25),
(426,288,30,'amount',3.00),
(427,292,30,'amount',2.00),
(432,369,12,'amount',0.10),
(433,369,40,'amount',0.40),
(438,400,12,'amount',5.00),
(449,316,5,'amount',0.00),
(450,316,25,'amount',1.00),
(451,316,50,'amount',1.00),
(453,576,8,'amount',1.00),
(456,547,12,'percentage',1.02),
(457,547,50,'percentage',1.50),
(459,529,24,'percentage',4.00),
(460,515,8,'percentage',2.00),
(461,564,10,'percentage',1.00),
(464,563,4,'percentage',2.00),
(465,563,8,'percentage',3.00),
(466,543,12,'percentage',1.50),
(468,517,96,'percentage',1.00),
(469,514,12,'percentage',0.50),
(470,514,48,'percentage',1.50),
(471,498,6,'percentage',2.80),
(472,472,3,'amount',3.00),
(473,435,15,'amount',1.30),
(474,422,10,'amount',2.00),
(475,421,7,'amount',2.50),
(477,420,9,'percentage',2.00),
(478,418,10,'amount',2.00),
(479,417,108,'amount',2.00),
(481,414,12,'amount',1.00),
(482,361,8,'amount',1.81),
(483,301,6,'amount',1.00),
(484,300,10,'amount',2.00),
(485,299,6,'amount',1.00),
(486,298,6,'amount',1.01),
(487,296,6,'percentage',1.00),
(488,294,6,'percentage',1.50),
(489,293,6,'percentage',2.00),
(490,254,12,'percentage',1.80),
(491,252,4,'percentage',3.00),
(492,535,24,'percentage',2.00),
(493,406,10,'percentage',3.00),
(494,341,37,'percentage',2.00),
(495,340,10,'percentage',1.00),
(496,340,36,'percentage',3.00),
(497,339,10,'percentage',1.50),
(498,526,12,'amount',1.00),
(499,526,56,'amount',2.00),
(500,343,10,'amount',1.00),
(501,343,36,'amount',2.50),
(504,342,10,'amount',1.00),
(505,342,36,'percentage',2.50),
(506,588,10,'amount',1.00),
(507,588,56,'amount',2.00),
(508,524,12,'percentage',1.00),
(509,524,48,'percentage',2.00),
(510,524,300,'percentage',2.99),
(511,407,10,'percentage',1.00),
(512,452,12,'percentage',1.00),
(513,452,300,'percentage',2.00),
(516,423,30,'amount',5.00),
(517,366,10,'percentage',2.00),
(518,366,30,'percentage',3.00),
(519,365,30,'percentage',2.00),
(521,357,6,'percentage',2.01);
/*!40000 ALTER TABLE `product_tier_pricing` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `brand` varchar(120) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `mrp` decimal(10,2) NOT NULL DEFAULT 0.00,
  `mrp2` decimal(10,2) DEFAULT NULL,
  `discount_type` enum('none','amount','percentage') NOT NULL DEFAULT 'none',
  `discount_value` decimal(10,2) NOT NULL DEFAULT 0.00,
  `visible` tinyint(1) DEFAULT 1,
  `is_deal_of_day` tinyint(1) NOT NULL DEFAULT 0,
  `deal_start` datetime DEFAULT NULL,
  `deal_end` datetime DEFAULT NULL,
  `is_best_seller` tinyint(1) NOT NULL DEFAULT 0,
  `is_product_of_week` tinyint(1) NOT NULL DEFAULT 0,
  `is_must_buy` tinyint(1) NOT NULL DEFAULT 0,
  `stock` int(11) NOT NULL DEFAULT 0,
  `sold_count` int(11) NOT NULL DEFAULT 0,
  `last_cost_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `primary_unit_id` int(11) DEFAULT NULL,
  `secondary_unit_id` int(11) DEFAULT NULL,
  `unit_conversion` float DEFAULT 1,
  `mrpdisplay` decimal(10,2) DEFAULT NULL,
  `hsn_code` varchar(20) DEFAULT 'N/A',
  `gst_rate` decimal(5,2) DEFAULT 5.00,
  PRIMARY KEY (`id`),
  KEY `fk_category` (`category_id`),
  KEY `primary_unit_id` (`primary_unit_id`),
  KEY `secondary_unit_id` (`secondary_unit_id`),
  KEY `idx_products_brand` (`brand`),
  CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`primary_unit_id`) REFERENCES `units` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`secondary_unit_id`) REFERENCES `units` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=589 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES
(252,1,'MONACO 5Rs(30p)','PARLE','',136.50,150.00,150.00,'percentage',9.00,1,0,NULL,NULL,1,0,0,23,0,0.00,'https://www.bbassets.com/media/uploads/p/xl/402823_6-parle-monaco-biscuits.jpg','2025-11-15 03:41:12','2026-06-03 13:22:51',2,13,4,0.00,'N/A',5.00),
(253,1,'happy happy 10Rs(12p)','PARLE',NULL,105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,599,0,0.00,'https://5.imimg.com/data5/SELLER/Default/2022/2/DT/EQ/AP/146503902/20005925-2-8-parle-happy-happy-choco-chip-cookies.jpg','2025-11-15 03:41:12','2026-06-03 13:21:29',2,13,8,NULL,'N/A',5.00),
(254,1,'20-20 CASHEW 5RS(12P)','PARLE','',54.00,60.00,60.00,'percentage',10.00,1,0,NULL,NULL,1,1,1,103,0,0.00,'https://rukminim2.flixcart.com/image/480/480/xif0q/cookie-biscuit/w/r/c/35-20-20-cashew-cookies-35-gm-each-pack-of-12-12-parle-original-imah6zrgzb9z9ggr.jpeg?q=90','2025-11-15 03:41:12','2026-06-03 13:20:59',2,13,12,0.00,'N/A',5.00),
(256,5,'Aashirvaad chakki fresh Atta 5 kg','ASHIRWAD','Experience the delightful goodness of taste in every morsel with Aashirvaad Superior MP Whole Wheat Atta. Its sweet and aromatic flavor harmoniously blends to create irresistibly fuller and softer rotis, ensuring a satisfying experience with every bite. Don\'t miss the opportunity to purchase Aashirvaad Superior MP Whole Wheat Atta online now!',250.00,265.00,265.00,'amount',15.00,1,0,NULL,NULL,0,0,0,5,0,0.00,'products/prod_6917de5192ad78.62533819.jpg','2025-11-15 03:41:12','2026-07-06 13:54:06',2,13,6,NULL,'N/A',5.00),
(257,2,'ANNAPURNA SUNFLOWER OIL(10P)',NULL,'Good product',1290.01,1850.00,1850.00,'percentage',30.27,1,1,'2025-11-16 21:03:00','2025-11-23 21:04:00',1,1,1,24,0,0.00,'https://dukaan.b-cdn.net/1000x1000/webp/698688/554a131f-10f1-4e10-bf9d-b489a4682989.png','2025-11-15 03:41:12','2026-02-11 05:27:38',2,2,1,NULL,'N/A',5.00),
(259,2,'RUCHIGOLD(10P)','PATANJALI','Good product',1216.25,1750.00,1750.00,'percentage',30.50,1,0,NULL,NULL,1,0,1,19,0,0.00,'https://www.bbassets.com/media/uploads/p/xl/40018402_9-ruchi-gold-palmolein-oil.jpg','2025-11-15 03:41:12','2026-02-10 07:35:53',2,2,1,NULL,'N/A',5.00),
(260,2,'FORTUNE 4.35KG','FORTUNE','Good product',765.00,900.00,900.00,'percentage',15.00,0,1,'2025-11-20 08:22:00','2025-11-21 08:22:00',0,0,0,0,0,0.00,'https://www.bbassets.com/media/uploads/p/xl/274148_15-fortune-sun-lite-sunflower-refined-oil.jpg','2025-11-15 03:41:12','2026-01-17 06:55:18',2,8,4,NULL,'N/A',5.00),
(261,10,'DEEPAM OIL 900ml','RAJ OIL','Good product',119.70,210.00,210.00,'percentage',43.00,1,0,NULL,NULL,0,0,0,60,0,0.00,'https://m.media-amazon.com/images/I/51pg1K969xL._AC_UF350,350_QL50_.jpg','2025-11-15 03:41:12','2026-01-17 06:55:05',2,14,20,NULL,'N/A',5.00),
(262,10,'DEEPAM OIL 500ML','RAJ OIL','Good product',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,60,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-17 06:55:05',2,13,6,NULL,'N/A',5.00),
(263,11,'CLINIC PLUS 1/-','HUL',NULL,13.04,16.00,16.00,'percentage',18.50,1,0,NULL,NULL,0,0,0,1717,0,0.00,'products/prod_691e88ad4ec1c0.31067528.png','2025-11-15 03:41:12','2026-02-10 09:04:18',2,15,60,NULL,'N/A',5.00),
(264,11,'DABUR VATIKA SHAMPOO 1/-','DABUR','Good product',12.96,16.00,16.00,'percentage',19.00,1,0,NULL,NULL,1,0,1,1194,0,0.00,'https://budgetbazaar.online/wp-content/uploads/2023/01/BBP2084.jpg','2025-11-15 03:41:12','2026-02-10 08:44:49',2,15,60,NULL,'N/A',5.00),
(265,11,'DOVE SHAMPOO 2/- ( PACK 16 )','HUL','Good product',28.16,32.00,32.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,570,0,0.00,'products/prod_6918715ca50941.58017185.jpg','2025-11-15 03:41:12','2026-02-10 09:04:18',2,15,60,NULL,'N/A',5.00),
(266,11,'HEAD N SHOULDER 2Rs ( PACK OF 20 )','P&G','Nourish and repair the appearance of damaged hair\r\nKeratin actives help repair damage deep inside hair\r\nHair looks healthy, strong and more beautiful\r\nHelps protect against future damage with continuous use\r\nSuitable for daily use',28.16,2.00,32.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,36,0,0.00,'products/prod_69185d0bd21388.28652624.png','2025-11-15 03:41:12','2026-06-03 15:18:54',2,10,96,NULL,'N/A',5.00),
(267,11,'SUNSILK 1/- ( PACK 16 )','HUL','Good product',13.04,16.00,16.00,'percentage',18.50,1,0,NULL,NULL,0,0,0,550,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpzucy9pcF3L-cgXdmEZUydd7inib5-ow75A&s','2025-11-15 03:41:12','2026-02-10 08:44:49',2,15,60,NULL,'N/A',5.00),
(268,4,'CLOSEUP EVERFRESH 20Rs(12+2)','HUL','No description available',216.00,120.00,240.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,143,0,0.00,'https://www.bbassets.com/media/uploads/p/s/306166-2_3-close-up-ever-fresh-red-hot-anti-germ-gel-toothpaste.jpg','2025-11-15 03:41:12','2026-01-22 05:53:06',13,14,12,NULL,'N/A',5.00),
(270,4,'colgate strong teeth 10rs','COLGATE','Colgate Maxfresh red gel toothpaste with cooling crystals for intense freshness, fights cavities, germ build-up, enhances teeth whiteness.',105.60,120.00,120.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,16,0,0.00,'products/prod_6918628483be42.16718004.jpg','2025-11-15 03:41:12','2026-01-24 11:37:51',2,13,24,NULL,'N/A',5.00),
(271,4,'colgate-strong-teeth 76Rs(100gm)','COLGATE','Colgate Strong Teeth, India\'s No.1 toothpaste, nourishes teeth, 2x stronger with Calcium Boost + Arginine. Prevents cavities, whitens, freshens breath. 100% vegan, gluten-free.',66.12,76.00,76.00,'percentage',13.00,1,0,NULL,NULL,0,0,0,720,0,0.00,'products/prod_691863188ef186.59728344.jpg','2025-11-15 03:41:12','2026-01-17 06:58:08',13,14,12,NULL,'N/A',5.00),
(272,4,'colgate BRUSH super flexi(11+2) 20Rs','COLGATE','Good product',156.00,240.00,240.00,'percentage',35.00,1,0,NULL,NULL,0,0,0,3,0,0.00,'products/prod_6918607ec450b2.74941327.jpg','2025-11-15 03:41:12','2026-01-22 05:00:12',15,14,13,NULL,'N/A',5.00),
(273,4,'DABUR BABOOL 63Rs','DABUR','contains 11 (20rs)+2(30rszigzag)brush free',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,6,NULL,'N/A',5.00),
(274,4,'Dabur Meswak 10rs','DABUR','Stronger and healthier teeth and gums',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,6,NULL,'N/A',5.00),
(275,4,'ORAL-B BRUSH(11+2) 20rs','P&G','Stronger and healthier teeth and gums',168.00,240.00,240.00,'percentage',30.00,1,0,NULL,NULL,0,0,0,16,0,0.00,'products/prod_69185da1eeb5e0.67796793.jpg','2025-11-15 03:41:12','2026-01-24 10:32:35',2,15,24,NULL,'N/A',5.00),
(276,9,'KADLI BELE(CHANA DAL)','DALS','Experience 20x thinner bristle tips for gentle cleaning between teeth and gums. Cup-shaped bristles clean deep, 100% more flexibility, tongue cleaner, Neem, clove, and Tulsi extracts.',88.00,88.00,88.00,'none',0.00,1,0,NULL,NULL,0,0,0,150,0,0.00,'products/prod_69186529bce069.43626139.png','2025-11-15 03:41:12','2026-01-17 06:58:08',1,9,30,NULL,'N/A',5.00),
(278,9,'HEASAR KALU (MOONG)','DALS','Good product',110.00,110.00,110.00,'none',0.00,1,0,NULL,NULL,0,0,0,140,0,0.00,'products/prod_691864a93cf697.19601576.png','2025-11-15 03:41:12','2026-02-10 11:02:30',1,9,30,NULL,'N/A',5.00),
(280,9,'HESAR BELE (MOONG DAL)','DALS','Good product',120.00,120.00,120.00,'none',0.00,1,0,NULL,NULL,0,0,0,150,0,0.00,'products/prod_691864dc4c6534.79768485.png','2025-11-15 03:41:12','2026-01-17 06:58:08',1,9,30,NULL,'N/A',0.00),
(281,9,'CHANNANGI (LENTIL DAL)','DALS','Good product',90.00,90.00,90.00,'none',0.00,1,0,NULL,NULL,0,0,0,145,0,0.00,'products/prod_691863d66f3537.81371578.png','2025-11-15 03:41:12','2026-02-10 11:02:30',1,9,30,NULL,'N/A',5.00),
(282,9,'CHANNANGI(WHOLE LENTIL)','DALS','Good product',95.00,95.00,95.00,'none',12.00,1,0,NULL,NULL,0,1,0,150,0,0.00,'products/prod_691863e651e520.89200190.png','2025-11-15 03:41:12','2026-01-17 06:58:08',1,9,30,NULL,'N/A',5.00),
(283,9,'UDDIN BELE(URAD DAL) BULLET','DALS','Good product',125.00,125.00,125.00,'none',0.00,1,0,NULL,NULL,0,0,0,55,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWkUQtl_wJgZQhF_jRWUq4Y8aHm1rMxJh6ZA&s','2025-11-15 03:41:12','2026-02-11 05:27:38',1,9,30,NULL,'N/A',5.00),
(284,9,'TOGARI BELE(TOOR DAL) NO.1','DALS','Good product',120.00,120.00,120.00,'none',0.00,1,0,NULL,NULL,0,0,0,120,0,0.00,'products/prod_69186bc8326249.02575078.png','2025-11-15 03:41:12','2026-01-17 07:45:10',1,9,30,NULL,'N/A',5.00),
(285,9,'MADIKE KALU(moth beans)','DALS','Good product',90.00,90.00,90.00,'none',0.00,1,0,NULL,NULL,0,0,0,120,0,0.00,'https://static.vecteezy.com/system/resources/previews/017/076/460/large_2x/seamless-pattern-of-dried-moth-beans-photo.JPG','2025-11-15 03:41:12','2026-01-17 07:45:10',1,9,30,NULL,'N/A',5.00),
(286,9,'RED CHANA(KADLI KALU)','DALS','Good product',80.00,80.00,80.00,'none',0.00,1,0,NULL,NULL,0,0,0,102,0,0.00,'products/prod_69186b7ddff413.86639358.jpg','2025-11-15 03:41:12','2026-01-24 09:42:21',1,19,30,NULL,'N/A',5.00),
(288,5,'bekary premium maida',NULL,'Good product',39.00,120.00,39.00,'none',0.00,1,0,NULL,NULL,0,0,0,279,0,0.00,'https://images.onlymyhealth.com/only-my-health-english/images/2025/01/27/article/image/mn-maida-1737963180086.webp','2025-11-15 03:41:12','2026-02-10 09:24:02',1,9,30,NULL,'N/A',5.00),
(289,5,'BESAN(KADLI HITT)hathoda 10kg',NULL,'Good product',930.00,1050.00,930.00,'none',0.00,1,0,NULL,NULL,0,0,0,8,0,0.00,'products/prod_6919dd7c4da001.23611275.jpeg','2025-11-15 03:41:12','2026-01-22 05:00:12',1,1,1,NULL,'N/A',5.00),
(291,5,'Kesari Rawa gajaraj','GOYAL INDUSTRIES','Good product',40.00,40.00,40.00,'none',0.00,1,0,NULL,NULL,0,0,0,220,0,0.00,'products/prod_69186dd3565274.78006095.jpg','2025-11-15 03:41:12','2026-02-10 08:28:13',1,9,30,NULL,'N/A',5.00),
(292,5,'bombay rava satara 30kg',NULL,'Good product',40.00,40.00,40.00,'none',0.00,1,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_6919dee6b31658.31323043.jpeg','2025-11-15 03:41:12','2026-02-10 07:49:01',1,9,30,NULL,'N/A',5.00),
(293,1,'Parle-G  5/-(24p)','PARLE','Good product',109.21,120.00,120.00,'percentage',8.99,1,0,NULL,NULL,1,1,1,308,0,553.00,'products/prod_691c64d2cb7b11.76596022.jpg','2025-11-15 03:41:12','2026-06-03 13:19:47',2,13,6,0.00,'N/A',5.00),
(294,1,'Parle-G 10/-(12p)','PARLE','Good product',109.21,120.00,120.00,'percentage',8.99,1,0,NULL,NULL,1,0,0,504,0,0.00,'products/prod_691c8099535733.29487988.jpg','2025-11-15 03:41:12','2026-06-03 13:19:27',2,13,6,0.00,'N/A',5.00),
(295,1,'20-20 butter 5/-(12P)','PARLE','Good product',52.80,60.00,60.00,'percentage',12.00,0,0,NULL,NULL,0,1,0,0,0,0.00,'products/prod_691857e9718540.25548083.png','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,12,NULL,'N/A',5.00),
(296,1,'Happy Happy 5/-(22p+2pfree)','PARLE','No description available',100.11,120.00,110.00,'percentage',8.99,1,0,NULL,NULL,0,0,0,530,0,0.00,'products/prod_6918592692f0b3.20921318.png','2025-11-15 03:41:12','2026-06-03 13:18:58',2,13,6,0.00,'N/A',5.00),
(298,1,'Krack Jack 4.5/-(24p)','PARLE','Good product',98.30,120.00,108.00,'percentage',8.98,1,0,NULL,NULL,0,0,0,520,0,0.00,'products/prod_691859d224aeb2.52120848.png','2025-11-15 03:41:12','2026-06-03 13:18:03',2,13,6,0.00,'N/A',5.00),
(299,1,'Parle Marie 9/-(12p)','PARLE','Good product',98.29,120.00,108.00,'percentage',8.99,1,0,NULL,NULL,0,0,0,62,0,0.00,'products/prod_691859e3bf7732.47587477.png','2025-11-15 03:41:12','2026-06-03 13:16:51',2,13,6,0.00,'N/A',5.00),
(300,1,'FAB Bourbon 10rs(12P)','PARLE','Good product',108.00,120.00,120.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,21,0,0.00,'products/prod_691858d88832f0.70214052.png','2025-11-15 03:41:12','2026-06-03 13:12:07',2,13,10,0.00,'N/A',5.00),
(301,1,'Hide & Seek Chocolate 30Rs(PACK18PC)','PARLE','Good product',486.00,30.00,540.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,30,0,0.00,'products/prod_69185978b697b0.45194958.png','2025-11-15 03:41:12','2026-06-03 13:11:36',2,13,4,0.00,'N/A',5.00),
(302,5,'avalakki/poha',NULL,'No description available',50.00,50.00,50.00,'none',0.00,1,0,NULL,NULL,0,0,0,444,0,0.00,'https://5.imimg.com/data5/SELLER/Default/2022/9/GJ/KQ/BP/13640528/saroj-poha-avalakki-500x500.jpg','2025-11-15 03:41:12','2026-02-10 07:32:41',1,9,30,NULL,'N/A',5.00),
(303,8,'vaishnavi kolam rice',NULL,'Filled with the goodness of milk and wheat, Parle-G has been a source of all round nourishment for the nation since 1939.',1575.00,2500.00,1575.00,'none',0.00,1,0,NULL,NULL,0,0,0,22,0,0.00,'https://5.imimg.com/data5/SELLER/Default/2025/6/518475066/RD/WS/XH/82244673/bpt-steam-rice.jpg','2025-11-15 03:41:12','2026-01-24 10:20:16',1,1,1,NULL,'N/A',5.00),
(304,8,'MB BARAKAT',NULL,'Filled with the goodness of milk and wheat, Parle-G has been a source of all round nourishment for the nation since 1939.',1350.00,1700.00,1350.00,'none',0.00,1,0,NULL,NULL,0,0,0,4,0,0.00,'products/prod_691d2454351e98.17637837.jpeg','2025-11-15 03:41:12','2026-02-10 07:32:41',1,1,1,NULL,'N/A',5.00),
(305,8,'Appu original jeera rice',NULL,'Filled with the richness of cashew, the goodness of butter Parle 20-20 has become every household?s favourite cookie.',1320.00,1500.00,1500.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,10,0,0.00,'products/prod_691d23b3d53015.88493836.jpg','2025-11-15 03:41:12','2026-01-17 07:45:10',1,1,1,NULL,'N/A',5.00),
(306,8,'ShreeVRM rice',NULL,'box quantity\n5Rs = 144pc\n10Rs = 72Pc',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,6,NULL,'N/A',5.00),
(307,8,'Vamshee JSR rice',NULL,'No description available',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,6,NULL,'N/A',5.00),
(310,12,'Jeera (Cumin)',NULL,'1pack =12pcs\n1 box = 10pack',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,6,NULL,'N/A',5.00),
(311,12,'lavang (Cloves)',NULL,'1 pack= 18pc\n1 box = 4pack',52.80,60.00,60.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_6917ddc5cda139.02423497.png','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,12,NULL,'N/A',5.00),
(312,12,'Kasturi Methi (Fenugreek leaves)',NULL,'Launched in 2006, Milano has today grown and evolved to become a synonym to Chocolate indulgence in the cookies segment.',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,6,NULL,'N/A',5.00),
(313,12,'Daalchini (Cinnamon)',NULL,'A digestive rich in fibre, minerals and vitamins, Nutricrunch is your choice for a healthy day.',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,6,NULL,'N/A',5.00),
(314,12,'sasive( Mustard)',NULL,'Indulge in Parle Premium Rusk\'s exquisite taste ? baked to perfection with finest ingredients. Satisfy hunger pangs, perfect with hot Chai. Grab yours now!',120.00,120.00,120.00,'none',0.00,1,0,NULL,NULL,0,0,0,50,0,0.00,'https://tiimg.tistatic.com/fp/1/007/863/naturally-processed-wide-application-range-with-high-purity-big-mustard-sasive-rai-200gm-416.jpg','2025-11-15 03:41:12','2026-01-17 07:45:10',1,9,30,NULL,'N/A',5.00),
(315,13,'organic jaggery(bella)',NULL,'Indulge in Parle Premium Rusk\'s exquisite taste ? baked to perfection with finest ingredients. Satisfy hunger pangs, perfect with hot Chai. Grab yours now!',105.60,120.00,120.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,60,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-17 15:24:34',2,13,6,NULL,'N/A',5.00),
(316,13,'sugar loose','','\"A bowl of Poha, a delightful morning/evening affair, with its softness and flavor, brings joy beyond compare.\"',44.00,120.00,44.00,'none',0.00,1,0,NULL,NULL,0,0,0,1370,0,0.00,'https://thaneshop.com/wp-content/uploads/2023/01/Sugar-Loose.jpg','2025-11-15 03:41:12','2026-02-10 09:58:47',1,9,1,0.00,'N/A',5.00),
(317,13,'salt 1kg (1kgx25pcs)',NULL,'Experience the nostalgic taste of Hubballi Avalakki - premium Poha from the Factory Outlet. Follow instructions for delightful meals like Kanda Poha, Aval dosa, and more.',210.00,250.00,250.00,'percentage',16.00,1,0,NULL,NULL,0,0,0,27,0,0.00,'https://5.imimg.com/data5/SELLER/Default/2023/7/323295462/PS/JY/QW/709144/top-cook-triple-refined-free-flow-iodized-edible-salt.jpeg','2025-11-15 03:41:12','2026-01-22 05:53:06',1,1,1,NULL,'N/A',5.00),
(319,13,'Crystal Salt 15Rs (25kg)',NULL,'No description available',210.00,500.00,500.00,'percentage',58.00,1,0,NULL,NULL,0,0,0,28,0,0.00,'https://www.spicebazar.uk/cdn/shop/files/top-cook-iodin-crystal-salt-2--1000x1000.webp?v=1695413365','2025-11-15 03:41:12','2026-02-10 11:02:30',1,1,1,NULL,'N/A',5.00),
(320,14,'Surf Excel bar 10rs','HUL','No description available',9.80,120.00,10.00,'percentage',2.00,1,0,NULL,NULL,0,0,0,256,0,0.00,'https://www.jiomart.com/images/product/original/490003810/surf-excel-detergent-bar-250-g-product-images-o490003810-p490003810-3-202307131015.jpg?im=Resize=(420,420)','2025-11-15 03:41:12','2026-01-22 05:53:06',2,14,140,NULL,'N/A',5.00),
(321,14,'Surf Excel powder 10rs','HUL','No description available',108.00,120.00,120.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,19,0,0.00,'https://www.bbassets.com/media/uploads/p/xl/40019098_7-surf-excel-quick-wash-detergent-powder.jpg','2025-11-15 03:41:12','2026-02-10 09:04:18',1,5,5,NULL,'N/A',5.00),
(322,14,'Rin bar 10rs','HUL','No description available',9.10,10.00,10.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,1176,0,0.00,'https://hibacart.com/cdn/shop/files/40002071-3_6-rin-rin-detergent-bar.webp?v=1711483293&width=500','2025-11-15 03:41:12','2026-01-17 13:36:15',2,14,84,NULL,'N/A',5.00),
(324,14,'Wheel active powder 1kg','HUL','No description available',69.00,75.00,75.00,'percentage',8.00,1,0,NULL,NULL,0,0,0,129,0,0.00,'https://www.bbassets.com/media/uploads/p/l/281513_18-wheel-green-lemon-jasmine-detergent-powder.jpg','2025-11-15 03:41:12','2026-02-10 08:44:49',1,14,25,NULL,'N/A',5.00),
(325,14,'Wheel active BAR 10/-','HUL','No description available',9.80,600.00,10.00,'percentage',2.00,1,0,NULL,NULL,0,0,0,2600,0,0.00,'https://m.media-amazon.com/images/I/81+rncuYHHL._AC_UF894,1000_QL80_.jpg','2025-11-15 03:41:12','2026-02-10 12:42:31',2,14,60,NULL,'N/A',5.00),
(326,1,'GOODY CASHEW 5/-(12p)','BRITANIA','No description available',53.40,60.00,60.00,'percentage',11.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_69185f00f3df29.19413491.png','2025-11-15 03:41:12','2026-01-19 14:35:35',2,13,15,NULL,'N/A',5.00),
(327,1,'GOOD DAY BUTTER 10/-(12p)','BRITANIA','No description available',9.00,120.00,10.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,4224,0,0.00,'products/prod_69185ebb2b9896.78734987.png','2025-11-15 03:41:12','2026-02-10 07:33:06',2,14,90,NULL,'N/A',5.00),
(329,14,'EXO soap 5rs','JYOTHI LABS','No description available',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,6,NULL,'N/A',5.00),
(330,14,'EXO ROUND tub 32rs','JYOTHI LABS','No description available',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,6,NULL,'N/A',5.00),
(331,10,'PITAMBARI(pavitram) 12rs',NULL,'No description available',85.00,10.00,100.00,'percentage',15.00,1,1,'2025-11-19 07:19:00','2025-11-21 07:19:00',0,1,0,23,0,0.00,'https://images-eu.ssl-images-amazon.com/images/I/51sBxJBEDnL._AC_UL600_SR600,600_.jpg','2025-11-15 03:41:12','2026-02-10 05:59:30',2,10,20,NULL,'N/A',5.00),
(333,14,'VIM GEL 15rs','HUL','No description available',13.65,15.00,15.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,60,0,0.00,'https://www.jiomart.com/images/product/original/490002367/vim-lemon-concentrated-dishwash-gel-130-ml-product-images-o490002367-p490002367-0-202501281104.jpg?im=Resize=(420,420)','2025-11-15 03:41:12','2026-01-17 07:49:01',2,14,36,NULL,'N/A',5.00),
(334,14,'VIM TUB 32rs','HUL','No description available',29.44,32.00,32.00,'percentage',8.00,1,0,NULL,NULL,0,0,0,48,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_stIj7cbSSMrwvKTGaBtJ7jc0T7DNGGDfrw&s','2025-11-15 03:41:12','2026-01-17 07:49:01',2,14,48,NULL,'N/A',5.00),
(336,15,'HARPIC 46Rs(200ML)','Reckitt','No description available',41.86,46.00,46.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,50,0,0.00,'https://www.bbassets.com/media/uploads/p/l/263737_12-harpic-power-plus-disinfectant-toilet-cleaner-liquid-original.jpg','2025-11-15 03:41:12','2026-01-17 15:22:06',2,14,48,NULL,'N/A',5.00),
(337,15,'HARPIC TOILET CLEANER 105Rs(500ml)','Reckitt','No description available',101.20,110.00,110.00,'percentage',8.00,1,0,NULL,NULL,0,0,0,50,0,0.00,'https://www.jiomart.com/images/product/original/490002757/harpic-power-plus-original-disinfectant-toilet-cleaner-500-ml-product-images-o490002757-p490002757-0-202209201826.jpg?im=Resize=(420,420)','2025-11-15 03:41:12','2026-01-17 15:22:06',2,14,24,NULL,'N/A',5.00),
(338,15,'LIZOL 48Rs(200ml)','Reckitt','No description available',43.68,48.00,48.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,50,0,0.00,'https://www.jiomart.com/images/product/original/490002723/lizol-citrus-disinfectant-surface-cleaner-200-ml-product-images-o490002723-p490002723-1-202306082118.jpg?im=Resize=(420,420)','2025-11-15 03:41:12','2026-01-17 15:22:06',2,14,48,NULL,'N/A',5.00),
(339,16,'dettol original 10RS(40p)','reckitt','No description available',360.00,400.00,400.00,'percentage',10.00,1,1,'2026-06-03 19:06:00','2026-06-09 19:06:00',0,0,0,180,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST2EDs6YfQ5x9bMhDwBlWllZUQc8yrlQdapQ&s','2025-11-15 03:41:12','2026-06-03 13:36:49',2,13,10,0.00,'N/A',5.00),
(340,16,'dettol original 182Rs(4+1)','','No description available',164.71,182.00,182.00,'percentage',9.50,1,0,NULL,NULL,1,1,1,70,0,0.00,'https://m.media-amazon.com/images/I/61-0PgPQ4sL._AC_UF1000,1000_QL80_.jpg','2025-11-15 03:41:12','2026-06-03 13:35:33',2,13,36,0.00,'N/A',5.00),
(341,16,'dettol skin care 156/-(4p)','reckitt','No description available',141.96,156.00,156.00,'percentage',9.00,1,0,NULL,NULL,1,1,1,87,0,0.00,'https://www.quickpantry.in/cdn/shop/files/Dettol_Skincare_Soap.jpg?v=1730147611','2025-11-15 03:41:12','2026-06-03 13:34:53',2,13,36,0.00,'N/A',5.00),
(342,16,'NO.1 lime 120/-(4P+1F)','','No description available',109.20,120.00,120.00,'percentage',9.00,1,0,NULL,NULL,1,0,0,87,0,0.00,'https://www.bbassets.com/media/uploads/p/l/40067902_3-godrej-no1-bathing-soap-lime-aloe-vera.jpg','2025-11-15 03:41:12','2026-06-03 13:41:47',2,13,36,0.00,'N/A',5.00),
(343,16,'NO.1 sandal 120/-(4P+1F)','GODREJ','No description available',109.20,120.00,120.00,'percentage',9.00,1,0,NULL,NULL,1,0,0,87,0,0.00,'https://vrmshoppe.com/wp-content/uploads/2021/06/godrej-no-1-sandal-turmeric-soap-100-g-pack-of-4-4-20201222.jpg','2025-11-15 03:41:12','2026-06-03 13:40:22',2,13,36,0.00,'N/A',5.00),
(344,16,'LIFEBOUY 10/-(12P)','HUL','No description available',110.40,120.00,120.00,'percentage',8.00,1,0,NULL,NULL,0,0,0,66,0,0.00,'products/prod_69187291e88864.06286478.jpg','2025-11-15 03:41:12','2026-01-24 11:15:06',2,13,18,NULL,'N/A',5.00),
(345,16,'LUX 10/-(12P)','HUL','No description available',110.40,120.00,120.00,'percentage',8.00,1,0,NULL,NULL,0,0,0,66,0,0.00,'https://www.bbassets.com/media/uploads/p/xl/100006721_3-lux-soap-soft-glow-rose-vitamin-e.jpg','2025-11-15 03:41:12','2026-02-11 05:27:38',2,13,18,NULL,'N/A',5.00),
(346,16,'LUX international 38/-','HUL','No description available',34.58,38.00,38.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,36,0,0.00,'https://ppsnco.com/wp-content/uploads/2021/10/Lux.jpg','2025-11-15 03:41:12','2026-06-03 14:54:40',14,14,1,0.00,'N/A',5.00),
(348,16,'SANTOOR SANDAL 40/-(4P)','SANTOOR','No description available',36.80,40.00,40.00,'percentage',8.00,1,0,NULL,NULL,0,0,0,33,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTvnuRaKXhlMbJk-H3lF5YdxDoMeS5GFdCrg&s','2025-11-15 03:41:12','2026-02-11 05:27:38',2,13,90,NULL,'N/A',5.00),
(349,16,'santoor white milk 40/-(4P)','SANTOOR','No description available',36.00,40.00,40.00,'percentage',10.00,0,0,NULL,NULL,1,0,1,168,0,0.00,'https://www.jiomart.com/images/product/original/491294788/santoor-sandal-almond-milk-soap-53-g-pack-of-4-product-images-o491294788-p590333744-0-202207201729.jpg?im=Resize=(1000,1000)','2025-11-15 03:41:12','2026-06-03 14:54:16',2,13,90,NULL,'N/A',5.00),
(350,16,'medimix 10/-(24p)',NULL,'No description available',210.00,240.00,240.00,'percentage',12.50,1,0,NULL,NULL,0,0,0,17,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvlI1Ai8KHC2VGPm6tOq12qYAtgH_wrN6rjQ&s','2025-11-15 03:41:12','2026-02-10 07:08:58',2,13,24,NULL,'N/A',5.00),
(351,16,'Fair & Lovely cream 25rs','HUL','No description available',22.00,25.00,25.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,108,0,0.00,'products/prod_691872774515d6.31197282.jpg','2025-11-15 03:41:12','2026-01-18 05:55:29',2,14,144,NULL,'N/A',5.00),
(352,16,'Ponds dreamflower 10rs(22PC)','HUL','No description available',198.00,220.00,220.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,21,0,0.00,'products/prod_691873f297fc89.98358270.jpg','2025-11-15 03:41:12','2026-01-18 05:55:29',2,13,12,NULL,'N/A',5.00),
(356,6,'ENO 11Rs (60p)','HUL','No description available',577.50,660.00,660.00,'percentage',12.50,1,0,NULL,NULL,0,0,0,60,0,0.00,'https://onemg.gumlet.io/l_watermark_346,w_690,h_700/a_ignore,w_690,h_700,c_pad,q_auto,f_auto/tzpi19w8lhmorebrbpu6.jpg','2025-11-15 03:41:12','2026-01-17 15:20:25',13,13,1,NULL,'N/A',5.00),
(357,16,'HIMALAYA BABY SOAP 13/-(12P)','','No description available',137.31,156.00,156.00,'percentage',11.98,1,0,NULL,NULL,0,0,0,9,0,0.00,'products/prod_69186e0d1a9df7.07405507.jpg','2025-11-15 03:41:12','2026-06-03 14:53:17',13,14,12,0.00,'N/A',5.00),
(359,17,'Maggi  7/-(12p)','nestle','No description available',6.86,7.00,7.00,'percentage',2.00,1,0,NULL,NULL,0,0,0,0,0,0.00,'https://m.media-amazon.com/images/I/812ujEPZcML._AC_UF894,1000_QL80_.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,14,308,NULL,'N/A',5.00),
(361,1,'MARIE GOLD 10/-(12p)','BRITANIA','No description available',108.00,120.00,120.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,63,0,0.00,'https://www.haridwarmart.com/wp-content/uploads/2021/01/haridwar-mart-marie-gold.png','2025-11-15 03:41:12','2026-06-03 13:09:56',2,13,8,0.00,'N/A',5.00),
(363,11,'karthika 1/-(20P)',NULL,'No description available',17.60,20.00,20.00,'percentage',12.00,1,1,'2025-11-16 21:22:00','2025-11-23 21:22:00',1,1,1,3777,0,0.00,'https://m.media-amazon.com/images/I/41BNYLq846L._AC_UF1000,1000_QL80_.jpg','2025-11-15 03:41:12','2026-02-10 11:02:30',2,15,96,NULL,'N/A',5.00),
(364,16,'santoor sandal 100gm 38/-(B3G1colgate)','SANTOOR','No description available',34.58,38.00,38.00,'percentage',9.00,0,1,'2025-11-16 20:48:00','2025-11-20 20:48:00',0,0,0,0,0,0.00,'https://asset.sastasundar.com/incom/images/product/thumb/Santoor-Sandal--Turmeric-Soap-Free-Colgate-Toothpaste-18-g-1623232094-10087172-1.jpg','2025-11-15 03:41:12','2026-06-03 14:51:51',2,14,168,NULL,'N/A',5.00),
(365,16,'Lifebuoy 125GMS(4+1) 150/-','HUL','No description available',138.00,150.00,150.00,'percentage',8.00,1,0,NULL,NULL,0,0,0,85,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGyfGnbWyr4dPpJObhO-EVKZr37zo2-Q0mGA&s','2025-11-15 03:41:12','2026-06-03 14:51:37',2,13,30,0.00,'N/A',5.00),
(366,16,'Lux 100Gms(buy4 Get 1 Free)','HUL','No description available',154.70,170.00,170.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,85,0,0.00,'https://5.imimg.com/data5/ANDROID/Default/2026/3/595500728/VQ/QK/UI/161666183/product-jpeg.jpg','2025-11-15 03:41:12','2026-06-03 14:50:44',2,13,30,0.00,'N/A',5.00),
(368,16,'Fair & Lovely Cream 10rs','HUL','No description available',220.00,250.00,250.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,17,0,0.00,'products/prod_691871d8e8d350.44927708.png','2025-11-15 03:41:12','2026-02-10 09:04:18',13,14,25,NULL,'N/A',5.00),
(369,14,'Nirma Shakti 10/-',NULL,'No description available',9.10,400.00,10.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,2440,0,335.00,'https://www.bbassets.com/media/uploads/p/s/40196857-2_6-nirma-shakti-detergent-cake-white-xtra-power.jpg','2025-11-15 03:41:12','2026-02-10 09:24:02',2,14,40,NULL,'N/A',18.00),
(370,14,'Surf Excel bar 20rs','HUL','No description available',19.60,20.00,20.00,'percentage',2.00,1,0,NULL,NULL,0,0,0,0,0,0.00,'https://www.bbassets.com/media/uploads/p/l/40019095_3-surf-excel-detergent-bar.jpg','2025-11-15 03:41:12','2026-01-18 05:31:11',2,14,100,NULL,'N/A',5.00),
(371,14,'varada 8rs',NULL,'No description available',360.00,400.00,400.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,17,0,0.00,'products/prod_691d275a991d49.97568624.jpeg','2025-11-15 03:41:12','2026-02-11 05:27:38',2,2,1,NULL,'N/A',5.00),
(372,14,'Wheel active powder 500gm','HUL','box quantity\r\n5Rs = 190pc\r\n10Rs = 72Pc',34.58,38.00,38.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,137,0,0.00,'https://www.urbangroc.com/wp-content/uploads/2021/09/wheel.jpg','2025-11-15 03:41:12','2026-02-11 05:27:38',1,14,30,NULL,'N/A',5.00),
(373,14,'Surf Excel powder 500gm','HUL',NULL,69.16,76.00,76.00,'percentage',9.00,1,0,NULL,NULL,0,1,0,0,0,0.00,'https://m.media-amazon.com/images/I/612vB+7JGEL._AC_UF1000,1000_QL80_.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',1,14,24,NULL,'N/A',5.00),
(374,14,'Surf Excel easy wash powder 1kg','HUL','Behold the magnificence of MTR Sambar, a symphony of flavors from lentils, tamarind, and spices, creating an exquisite South Indian delight!',131.04,144.00,144.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,0,0,0.00,'https://m.media-amazon.com/images/I/6122YDuI5KL._AC_UF1000,1000_QL80_.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',1,14,12,NULL,'N/A',5.00),
(375,14,'Wheel active powder 10rs','HUL','No description available',9.80,10.00,10.00,'percentage',2.00,1,0,NULL,NULL,0,0,0,672,0,0.00,'https://5.imimg.com/data5/SELLER/Default/2023/8/337035296/EU/UM/OJ/70256190/whatsapp-image-2023-08-22-at-7-04-35-pm-500x500.jpeg','2025-11-15 03:41:12','2026-02-10 09:24:02',1,14,60,NULL,'N/A',5.00),
(376,14,'VIM BAR 10rs','HUL','No description available',109.20,120.00,120.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,32,0,0.00,'https://www.bbassets.com/media/uploads/p/l/100006809_14-vim-dishwash-bar-lemon.jpg','2025-11-15 03:41:12','2026-02-10 05:59:30',2,5,8,NULL,'N/A',5.00),
(378,14,'VIM TUB 49rs','HUL','No description available',45.08,49.00,49.00,'percentage',8.00,1,0,NULL,NULL,0,0,0,60,0,0.00,'https://m.media-amazon.com/images/I/61jVnN-JYKL._AC_UF350,350_QL80_.jpg','2025-11-15 03:41:12','2026-01-17 15:26:54',2,14,48,0.00,'N/A',5.00),
(379,14,'EXO soap 10rs','JYOTHI LABS','No description available',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,6,NULL,'N/A',5.00),
(380,10,'PITAMBARI 48rs',NULL,'Vim tub: potent household cleaner, combats stains, grease. Convenient, tub packaging. Ideal for kitchen and bathroom, ensures sparkling surfaces.',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-17 15:25:12',2,13,6,NULL,'N/A',5.00),
(381,6,'menthoplus 2rs (160p)',NULL,'No description available',284.80,320.00,320.00,'percentage',11.00,1,0,NULL,NULL,0,0,0,41,0,0.00,'https://image1.jdomni.in/product/25022021/E7/F5/62/2E00FB94D920240963C268D727_1614263931104.png?fit=around|500:500','2025-11-15 03:41:12','2026-02-11 05:27:38',2,13,22,NULL,'N/A',5.00),
(382,11,'Parachute 10rs(24p)','MARICO','No description available',218.40,240.00,240.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,22,0,0.00,'https://5.imimg.com/data5/SELLER/Default/2023/2/EF/NH/LD/3535494/img-20230204-084321.jpg','2025-11-15 03:41:12','2026-02-10 06:26:20',2,13,24,NULL,'N/A',5.00),
(383,11,'Parachute 20rs(24p)','MARICO','No description available',436.80,480.00,480.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,22,0,0.00,'https://5.imimg.com/data5/SELLER/Default/2021/1/WM/JX/IC/6883999/ba36fa80-1bf1-492a-a483-4e5ee0338cd9.jpg','2025-11-15 03:41:12','2026-02-10 06:42:32',2,13,24,NULL,'N/A',5.00),
(384,11,'Parachute 100ml 65Rs','MARICO','No description available',59.80,65.00,65.00,'percentage',8.00,1,0,NULL,NULL,0,0,0,12,0,0.00,'https://www.bbassets.com/media/uploads/p/l/20004217_2-parachute-pure-coconut-oil.jpg','2025-11-15 03:41:12','2026-02-10 06:42:32',13,14,16,NULL,'N/A',5.00),
(385,11,'Parachute 175ml','MARICO','No description available',105.60,120.00,120.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,0,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHehTNAjd_Uh7AGZc0CJHSDAnUwUQAdo6tuQ&s','2025-11-15 03:41:12','2026-02-10 06:26:20',2,14,100,NULL,'N/A',5.00),
(386,11,'Parachute 250ml','MARICO','No description available',149.04,162.00,162.00,'percentage',8.00,1,0,NULL,NULL,0,0,0,120,0,0.00,'https://www.bbassets.com/media/uploads/p/l/264541_6-parachute-pure-coconut-oil.jpg','2025-11-15 03:41:12','2026-02-10 06:26:20',2,14,80,NULL,'N/A',5.00),
(387,11,'Parachute 500ml 300Rs','MARICO','No description available',276.00,300.00,300.00,'percentage',8.00,1,0,NULL,NULL,0,0,0,102,0,0.00,'https://www.shysha.in/wp-content/uploads/2022/01/Parachute-500ml-500px-150x150.png','2025-11-15 03:41:12','2026-02-10 06:26:20',2,14,40,NULL,'N/A',5.00),
(388,11,'Parachute 1ltr 713Rs','MARICO','No description available',556.14,713.00,713.00,'percentage',22.00,1,0,NULL,NULL,0,0,0,37,0,0.00,'https://m.media-amazon.com/images/I/71UAbfo2kjL._AC_UF894,1000_QL80_.jpg','2025-11-15 03:41:12','2026-02-10 06:26:20',14,14,1,NULL,'N/A',5.00),
(389,11,'KLF NIRMAL 250ML','KLF','No description available',105.60,120.00,120.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,25,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-17 12:55:13',2,13,6,NULL,'N/A',5.00),
(390,11,'KLF NIRMAL 500ML','KLF','No description available',105.60,120.00,120.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,13,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-18 05:31:11',2,13,6,NULL,'N/A',5.00),
(391,11,'KLF NIRMAL 1Ltr','KLF','each of 42s MRP',105.60,120.00,120.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,12,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-19 14:48:53',2,13,6,NULL,'N/A',5.00),
(392,4,'colgate strong teeth 149Rs(200gm)','COLGATE','No description available',131.12,149.00,149.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,12,0,0.00,'products/prod_691862bf79d421.07675307.jpg','2025-11-15 03:41:12','2026-01-17 13:53:34',13,14,12,NULL,'N/A',5.00),
(395,4,'colgate strong teeth 20rs','COLGATE','No description available',216.00,240.00,240.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,51,0,0.00,'products/prod_691862e0ad84c9.00014594.jpg','2025-11-15 03:41:12','2026-02-10 07:08:58',2,13,24,0.00,'N/A',5.00),
(396,4,'Colgate Cibaca 30Rs','COLGATE','No description available',320.40,30.00,360.00,'percentage',11.00,1,0,NULL,NULL,0,0,0,19,0,0.00,'products/prod_69186158b126b3.70389369.png','2025-11-15 03:41:12','2026-01-24 11:37:51',2,13,12,NULL,'N/A',5.00),
(397,4,'Colgate Cibaca 71Rs(175gm)','COLGATE','No description available',62.48,71.00,71.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,221,0,0.00,'products/prod_6918623d9b9f38.55505728.png','2025-11-15 03:41:12','2026-02-10 06:26:20',13,14,12,0.00,'N/A',5.00),
(398,4,'DANT KANTI 20RS(12P)','PATANJALI','No description available',213.60,240.00,240.00,'percentage',11.00,1,0,NULL,NULL,1,0,1,51,0,0.00,'https://garudalife.in/cache/original/product/25524/ppc001.webp','2025-11-15 03:41:12','2026-01-22 05:53:06',2,13,24,NULL,'N/A',5.00),
(399,4,'DANT KANTI 56RS(100GM)','PATANJALI','No description available',49.84,63.00,56.00,'percentage',11.00,1,0,NULL,NULL,1,0,1,84,0,0.00,'https://www.patanjaliayurved.net/assets/product_images/400x500/1739858231DantKantiNatural100g-1.webp','2025-11-15 03:41:12','2026-01-22 05:00:12',2,14,144,NULL,'N/A',5.00),
(400,4,'DANT KANTI 106RS(200GM)','PATANJALI','No description available',95.40,106.00,106.00,'percentage',10.00,1,0,NULL,NULL,1,0,0,54,0,0.00,'https://www.patanjaliayurved.net/assets/product_images/400x500/1739858231DantKantiNatural100g-1.webp','2025-11-15 03:41:12','2026-02-10 06:26:20',2,14,72,0.00,'N/A',5.00),
(401,4,'Dabur Meswak 20rs','DABUR','No description available',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,6,NULL,'N/A',5.00),
(402,4,'Dabur Meswak 70Rs','DABUR','No description available',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,6,NULL,'N/A',5.00),
(403,4,'dabur REDPASTE 10Rs','DABUR','No description available',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,6,NULL,'N/A',5.00),
(404,4,'REDPASTE 20Rs','DABUR','No description available',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,6,NULL,'N/A',5.00),
(405,4,'REDPASTE 70Rs(100GM)','DABUR','No description available',105.60,120.00,120.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_68ab2612f281d3.64252261.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,13,6,NULL,'N/A',5.00),
(406,16,'dettol cool 182/-(4P+1free)','reckitt','No description available',165.62,168.00,182.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,60,0,0.00,'https://www.bbassets.com/media/uploads/p/l/40325772_5-dettol-icy-cool-soap.jpg','2025-11-15 03:41:12','2026-06-03 13:32:56',14,14,1,0.00,'N/A',5.00),
(407,16,'medimix 96/-(buy3 get 1 free)','','No description available',87.36,96.00,96.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,24,0,0.00,'https://www.mtresail.com/media/__sized__/products/medimix-ayurvedic-75gpackof41-thumbnail-540x540-70.jpg','2025-11-15 03:41:12','2026-06-03 13:48:11',2,14,48,0.00,'N/A',5.00),
(408,14,'comfort fabric morning fresh 58Rs(220ml)','HUL','No description available',51.04,58.00,58.00,'percentage',12.00,1,0,NULL,NULL,0,0,1,80,0,0.00,'https://www.jiomart.com/images/product/original/490225938/comfort-after-wash-morning-fresh-fabric-conditioner-210-ml-product-images-o490225938-p490225938-0-202410012235.jpg','2025-11-15 03:41:12','2026-01-17 15:25:38',2,14,40,NULL,'N/A',5.00),
(410,14,'comfort fabric antibacterial 60Rs(220ml)','HUL','No description available',54.60,60.00,60.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,0,0,0.00,'https://www.bbassets.com/media/uploads/p/l/285704_12-comfort-after-wash-anti-bacterial-fabric-conditioner.jpg','2025-11-15 03:41:12','2026-01-10 11:25:55',2,14,40,NULL,'N/A',5.00),
(411,14,'Rin ala 45-','HUL','No description available',41.85,45.00,45.00,'percentage',7.00,1,0,NULL,NULL,0,0,0,28,0,0.00,'https://www.bbassets.com/media/uploads/p/l/266981_2-rin-ala-fabric-whitener.jpg','2025-11-15 03:41:12','2026-06-03 15:14:19',2,14,40,0.00,'N/A',5.00),
(412,14,'comfort fabric 4Rs sachet','HUL','No description available',35.20,40.00,40.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,12,0,0.00,'https://kiranamarket.com/wp-content/uploads/2023/03/8901030865909.jpg','2025-11-15 03:41:12','2026-02-10 06:42:32',2,15,60,NULL,'N/A',5.00),
(413,12,'MTR sambar 10Rs(12P)','MTR','No description available',105.60,120.00,120.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,3,0,0.00,'products/prod_692145871fbaa2.54762139.png','2025-11-15 03:41:12','2026-02-10 11:02:30',1,13,20,NULL,'N/A',5.00),
(414,1,'Cream magix 4.5/-(12P)','PARLE','No description available',49.14,60.00,54.00,'percentage',9.00,1,1,'2026-06-03 16:09:00','2026-06-09 16:10:00',1,0,0,62,0,0.00,'products/prod_6918584567dd91.35814120.png','2025-11-15 03:41:12','2026-06-03 12:56:46',2,13,12,0.00,'N/A',5.00),
(415,4,'Colgate powder 42 rs','COLGATE','No description available',39.06,42.00,42.00,'percentage',7.00,1,0,NULL,NULL,0,0,0,48,0,0.00,'https://cdn.pixelbin.io/v2/plain-cake-860195/netmed/wrkr/products/pictures/item/free/original/95b_3SFRgJ-colgate_super_rakshak_toothpowder_with_calcium_and_minerals_50_gm_543477_0_0.jpg','2025-11-15 03:41:12','2026-01-17 14:02:07',14,14,1,0.00,'N/A',5.00),
(416,15,'LIZOL 123Rs(500ml)','Reckitt',NULL,111.93,123.00,123.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,50,0,0.00,'https://ik.imagekit.io/wlfr/wellness/images/products/254279-1.jpg/tr:w-3840,c-at_max,cm-pad_resize,ar-1210-700,pr-true,f-auto,q-70,l-image,i-Wellness_logo_BDwqbQao9.png,lfo-bottom_right,w-200,h-90,c-at_least,cm-pad_resize,l-end','2025-11-15 03:41:12','2026-01-17 15:22:06',2,13,24,NULL,'N/A',5.00),
(417,1,'Parle Monaco 10/-(12p)','PARLE','No description available',108.00,120.00,120.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,45,0,0.00,'products/prod_69185a09c8fd90.40938519.png','2025-11-15 03:41:12','2026-06-03 12:52:23',2,13,9,0.00,'N/A',5.00),
(418,1,'DHOOD 5/-(pack20)','PATANJALI','No description available',90.00,100.00,100.00,'percentage',10.00,1,0,NULL,NULL,1,0,1,676,0,0.00,'https://www.bbassets.com/media/uploads/p/xxl/40312242_3-patanjali-doodh-atta-biscuit.jpg','2025-11-15 03:41:12','2026-06-03 12:51:38',2,13,10,0.00,'N/A',5.00),
(420,1,'KRACK JACK 9/-(12p)','PARLE','No description available',98.28,120.00,108.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,90,0,0.00,'products/prod_691859aacc5879.88326468.png','2025-11-15 03:41:12','2026-06-03 12:51:16',2,13,9,0.00,'N/A',5.00),
(421,1,'BRITANIA BOURBON 10/-(20P)','BRITANIA','No description available',180.00,200.00,200.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,13,0,0.00,'products/prod_69185e4337ce91.91688790.png','2025-11-15 03:41:12','2026-07-06 13:54:06',2,13,7,0.00,'N/A',5.00),
(422,1,'DHOOD 10Rs(10p)','PATANJALI','GOOD',90.00,100.00,100.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,800,0,0.00,'https://www.bbassets.com/media/uploads/p/l/401806_6-patanjali-doodh-biscuit.jpg','2025-11-16 14:47:03','2026-06-03 12:49:26',2,13,10,0.00,'N/A',5.00),
(423,16,'SANTOOR SANDAL 110/- (75GMx4P)','SANTOOR','',85.00,110.00,110.00,'amount',25.00,1,1,'2026-06-03 20:54:00','2026-06-09 20:54:00',1,0,0,100,0,0.00,'https://www.bbassets.com/media/uploads/p/xl/263708_4-santoor-bathing-soap-sandal-turmeric.jpg','2025-11-16 15:24:03','2026-06-03 14:49:20',2,14,30,0.00,'N/A',5.00),
(424,2,'ANNAPURNA SUNFLOWER 15KG',NULL,NULL,2352.00,2800.00,2800.00,'percentage',16.00,1,1,'2025-11-16 21:07:00','2025-11-23 21:07:00',1,1,1,49,0,0.00,'products/prod_691c64ad12f347.23004404.jpeg','2025-11-16 15:43:20','2026-01-22 05:53:06',14,14,1,NULL,'N/A',5.00),
(425,18,'sting energy 250ml (30PC)','','',528.00,600.00,600.00,'percentage',12.00,1,1,'2025-11-18 17:50:00','2025-11-19 17:50:00',1,0,1,35,0,0.00,'https://www.bbassets.com/media/uploads/p/l/40113908_5-sting-energy-drink.jpg','2025-11-18 12:20:00','2026-06-03 15:06:55',3,3,1,0.00,'N/A',5.00),
(426,18,'7up 2.25ltrs',NULL,NULL,80.19,99.00,99.00,'percentage',19.00,0,0,NULL,NULL,0,0,0,74,0,0.00,'https://www.jiomart.com/images/product/original/490005200/7up-2-25-l-product-images-o490005200-p490005200-0-202210201751.jpg','2025-11-18 14:22:27','2026-06-03 15:06:31',13,14,9,NULL,'N/A',5.00),
(427,9,'PUTANI (FRIED GRAM DAL)',NULL,NULL,100.00,100.00,100.00,'none',0.00,1,0,NULL,NULL,0,0,0,83,0,0.00,'https://dms.mydukaan.io/original/jpeg/203811/0f7ed42f-1329-4b35-88b0-357902c8df58.png','2025-11-19 16:14:47','2026-02-10 12:42:31',1,9,30,NULL,'N/A',5.00),
(428,9,'SHENGA KALU (GROUNDNUT SEED)',NULL,NULL,130.00,130.00,130.00,'none',0.00,1,0,NULL,NULL,0,0,0,90,0,0.00,'https://5.imimg.com/data5/ANDROID/Default/2020/11/RP/TS/IP/30103354/product-jpeg-500x500.jpg','2025-11-19 16:17:35','2026-01-17 15:19:06',1,9,30,NULL,'N/A',5.00),
(429,9,'BILI VATANI (WHITE PEAS)',NULL,'',80.00,80.00,80.00,'none',0.00,1,0,NULL,NULL,0,0,0,85,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkfZRJ-FP5WQWTeXEYOUPZ2Lu9cdrz8opM6w&s','2025-11-19 16:20:26','2026-01-22 05:00:12',1,9,30,NULL,'N/A',5.00),
(430,2,'Health fit 5ltr',NULL,NULL,720.00,900.00,900.00,'percentage',20.00,1,1,'2025-11-20 08:26:00','2025-11-21 08:27:00',0,0,0,0,0,0.00,'products/prod_691e847f3a8fb8.72710624.jpg','2025-11-20 02:58:21','2026-01-10 11:25:55',2,8,4,NULL,'N/A',5.00),
(431,5,'Wheatkart atta 1kg',NULL,NULL,52.80,60.00,60.00,'percentage',12.00,0,1,'2025-11-20 08:59:00','2025-11-21 08:59:00',1,0,0,0,0,0.00,'https://www.jiomart.com/images/product/original/rvondh0dpy/wheatkart-whole-wheat-atta-10-kg-product-images-orvondh0dpy-p596562517-0-202212221536.png?im=Resize=(1000,1000)','2025-11-20 03:30:14','2026-01-10 11:25:55',1,9,30,NULL,'N/A',5.00),
(432,5,'WHEATKART ATTA 5kg',NULL,'',245.00,350.00,350.00,'percentage',30.00,1,0,NULL,NULL,0,0,0,0,0,0.00,'https://www.jiomart.com/images/product/original/rvondh0dpy/wheatkart-whole-wheat-atta-10-kg-product-images-orvondh0dpy-p596562517-0-202212221536.png?im=Resize=(1000,1000)','2025-11-20 03:37:22','2026-01-10 11:25:55',1,13,6,NULL,'N/A',5.00),
(433,16,'Santoor Skin Softening Sandal & Almond Milk Bathing Soap  125g, Pack of 5','SANTOOR','',179.74,209.00,209.00,'percentage',14.00,1,0,NULL,NULL,0,0,0,0,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG3swuZ-kLyX1KFYjKCzs5_Tu3nL7RD38nwQ&s','2025-11-20 03:51:02','2026-06-03 13:50:31',2,13,30,NULL,'N/A',5.00),
(435,1,'GOODY BUTTER 5Rs(12p)','BRITANIA','',54.00,60.00,60.00,'percentage',10.00,1,0,NULL,NULL,1,0,0,675,0,0.00,'https://chennaionlineshopping.in/image/cache/catalog/Products/biscuit/good%20day%20butter-800x800.jpg','2025-11-20 06:05:48','2026-06-03 12:49:05',2,13,15,0.00,'N/A',5.00),
(436,7,'amar 1kg leaf',NULL,NULL,290.70,380.00,380.00,'percentage',23.50,1,1,'2025-11-21 11:29:00','2025-11-22 11:29:00',0,0,0,176,0,0.00,'products/prod_691fff8edda493.48368365.jpeg','2025-11-21 05:58:38','2026-07-06 13:54:06',2,14,20,NULL,'N/A',5.00),
(437,5,'TANDOORI ATTA',NULL,NULL,45.00,45.00,45.00,'none',0.00,1,0,NULL,NULL,0,0,0,74,0,0.00,'https://img500.exportersindia.com/product_images/bc-500/2024/12/14142413/tandoori-atta-1735041969-7758173.jpeg','2025-11-21 06:02:35','2026-02-10 09:24:02',1,9,30,NULL,'N/A',5.00),
(438,18,'MAAZA 250ML 20/-(30P)',NULL,'',522.00,600.00,600.00,'percentage',13.00,0,0,NULL,NULL,0,0,0,3,0,0.00,'https://www.bbassets.com/media/uploads/p/l/67991_1-maaza-mango-drink.jpg','2025-11-21 09:35:48','2026-06-03 15:06:22',3,3,1,NULL,'N/A',5.00),
(439,18,'MIRINDA 2.25L',NULL,'',85.14,99.00,99.00,'percentage',14.00,1,1,'2025-11-21 15:07:00','2025-11-22 15:07:00',1,0,0,54,0,0.00,'https://m.media-amazon.com/images/I/41cRGOwuwvL._AC_UF894,1000_QL80_.jpg','2025-11-21 09:38:15','2026-06-03 15:06:17',3,14,9,NULL,'N/A',5.00),
(440,12,'MTR SAMBAR 100GM 76/-','MTR',NULL,72.20,76.00,76.00,'percentage',5.00,1,1,'2025-11-21 20:56:00','2025-11-22 20:56:00',1,0,0,80,0,0.00,'products/prod_692084dfb257d8.43327713.png','2025-11-21 15:27:27','2026-01-17 12:52:42',2,14,80,NULL,'N/A',5.00),
(443,18,'fanta 250ml 20/- (30p)',NULL,'',528.00,600.00,600.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoOrY4gLJiPRy8xVko9yWpzzR8boLmAMVxYw&s','2025-11-22 11:01:12','2026-06-03 15:05:59',3,3,1,NULL,'N/A',5.00),
(444,18,'Sprite 250ml 20/-(30p)',NULL,'',528.00,600.00,600.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'https://cdn.dotpe.in/longtail/store-items/2518390/yhnRVu58.jpeg','2025-11-22 11:03:50','2026-01-10 11:25:55',3,3,1,NULL,'N/A',5.00),
(445,18,'maaza  tetra 10/-(10p)',NULL,'',80.00,100.00,100.00,'percentage',20.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'https://5.imimg.com/data5/SELLER/Default/2024/2/389436461/RD/PC/ZW/100595859/maaza-tetra-rs-10-40-pc-case-size.jpg','2025-11-22 11:06:27','2026-06-03 15:05:56',13,13,1,NULL,'N/A',5.00),
(446,19,'DARK CHOCOLATE 1/-(125PC)',NULL,NULL,95.00,125.00,125.00,'amount',30.00,1,0,NULL,NULL,0,0,0,28,0,0.00,'https://epeedikaonline.com/assets/products/original/products_r2rgv7.jpg','2025-11-22 11:29:07','2026-02-10 11:02:30',2,13,24,NULL,'N/A',5.00),
(447,19,'WHITE 1/-',NULL,'',95.00,125.00,125.00,'amount',30.00,1,0,NULL,NULL,1,1,0,40,0,0.00,'https://5.imimg.com/data5/SELLER/Default/2021/3/PH/QU/UO/11168889/white-milky-hearts-candy-500x500.jpg','2025-11-22 11:33:09','2026-02-10 11:02:30',2,13,24,NULL,'N/A',5.00),
(448,19,'DAIRY MILK 5/- (72PC)',NULL,NULL,324.00,360.00,360.00,'percentage',10.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZCc9HmSXdbGONukmk1CCFY0WA5WAanK-4FA&s','2025-11-22 11:34:44','2026-01-10 11:25:55',2,13,24,NULL,'N/A',5.00),
(449,19,'DAIRY MILK 10/-(56PC)',NULL,'',509.60,560.00,560.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,0,0,0.00,'https://www.bbassets.com/media/uploads/p/xl/100020979_14-cadbury-dairy-milk-chocolate-bar.jpg','2025-11-22 11:37:07','2026-01-10 11:25:55',2,13,12,NULL,'N/A',5.00),
(450,19,'Cadbury Gems 5/-',NULL,'',486.00,540.00,540.00,'percentage',10.00,1,0,NULL,NULL,1,0,0,0,0,0.00,'https://www.bbassets.com/media/uploads/p/l/100021029_14-cadbury-gems-sugar-coated-chocolate.jpg','2025-11-22 11:38:50','2026-01-10 11:25:55',2,13,12,NULL,'N/A',5.00),
(451,16,'CHANDRIKA (75GM) 35/-',NULL,'',32.20,35.00,35.00,'percentage',8.00,1,0,NULL,NULL,0,0,0,84,0,0.00,'https://dookan.com/cdn/shop/files/Chandrika-Soap-75g-500px_28849ec1-3b32-4b70-af5b-4ae22f71d4d6.png?v=1755869449','2025-11-22 11:41:26','2026-01-17 07:49:58',2,14,216,NULL,'N/A',5.00),
(452,16,'MYSORE SANDAL 38/-','','',34.58,38.00,38.00,'percentage',9.00,1,0,NULL,NULL,1,0,0,388,0,0.00,'https://www.smallflower.com/cdn/shop/products/MysoreSandalSoap.jpg?v=1654292884&width=1946','2025-11-22 11:43:30','2026-06-03 13:50:05',2,14,300,0.00,'N/A',5.00),
(453,18,'SPRITE 600ML+140ML 40/-(24PC)',NULL,NULL,36.80,40.00,40.00,'percentage',8.00,0,1,'2025-11-22 17:18:00','2025-11-23 17:18:00',1,0,0,144,0,0.00,'https://www.bbassets.com/media/uploads/p/l/60000732_9-sprite-soft-drink.jpg','2025-11-22 11:50:00','2026-06-03 15:05:54',3,14,24,NULL,'N/A',5.00),
(454,5,'VASU Idli Rava',NULL,NULL,47.00,65.00,65.00,'amount',18.00,1,0,NULL,NULL,1,0,0,8,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuuJOBv-TWoqSBkDtz2wGSY-lKoA2Q0Pv7ww&s','2025-11-22 15:22:58','2026-02-10 11:02:30',1,9,20,NULL,'N/A',5.00),
(455,12,'NANDI CHILLY 1kg(500GMX2p)',NULL,NULL,270.00,300.00,300.00,'amount',30.00,1,0,NULL,NULL,0,0,0,0,0,0.00,'https://www.bbassets.com/media/uploads/p/l/40077462_1-nandi-powder-byadgi-chilli-super-fine.jpg','2025-11-24 05:52:48','2026-01-10 11:25:55',1,9,40,NULL,'N/A',5.00),
(456,12,'MTR PULIYOGARE 10/-(12P)','MTR','',105.60,120.00,120.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,10,0,0.00,'https://www.bbassets.com/media/uploads/p/l/144126_6-mtr-masala-puliogare-powder.jpg','2025-11-24 05:54:53','2026-01-17 12:56:32',1,15,120,NULL,'N/A',5.00),
(457,12,'TURMURIC (RALA) 5KG',NULL,'',975.00,1500.00,1500.00,'percentage',35.00,1,0,NULL,NULL,0,0,0,40,0,0.00,'https://5.imimg.com/data5/SELLER/Default/2025/7/524174024/VR/VB/YI/243933538/5-kg-turmeric-powder.jpg','2025-11-24 05:56:52','2026-01-17 15:23:30',1,13,5,NULL,'N/A',5.00),
(458,12,'CHILLY POWDER MASALA 3KG JAR(Kanda Lasun Masala Blend)',NULL,'A flavorful blend of onion, garlic, and premium spices, perfect for adding authentic taste to your Maharashtrian dishes. Conveniently packaged for easy use and storage.',600.00,900.00,600.00,'none',0.00,1,0,NULL,NULL,0,0,0,20,0,0.00,'https://samarthkhandeshproducts.com/wp-content/uploads/2024/09/Untitled-design-2.jpg','2025-11-24 06:01:10','2026-01-17 15:23:30',2,8,6,NULL,'N/A',5.00),
(459,12,'CHIKEN MASALA 10/- GINGER PASTE FREE(8PC)',NULL,'',68.00,80.00,80.00,'amount',12.00,1,0,NULL,NULL,0,0,0,7,0,0.00,'https://www.swastiks.com/cdn/shop/files/ChickenMasala.png?v=1749627032','2025-11-24 06:02:58','2026-01-22 05:53:06',13,13,1,NULL,'N/A',5.00),
(461,12,'Swastik Mutton masala GGP FREE ₹10/-(8P)',NULL,'',68.00,80.00,80.00,'amount',12.00,1,0,NULL,NULL,0,0,0,10,0,0.00,'https://img.thecdn.in/39007/1633429751995_Swastik%20Mutton%20Masala.png?width=600&format=webp','2025-11-24 06:13:17','2026-01-17 15:23:30',13,13,1,NULL,'N/A',5.00),
(462,12,'MENTHE KALU(METHI SEEDS)',NULL,NULL,100.00,150.00,100.00,'none',0.00,1,0,NULL,NULL,0,0,0,20,0,0.00,'https://kannada.boldsky.com/img/2016/04/shutterstock-214416229-600x450-07-1460004189.jpg','2025-11-24 06:17:22','2026-01-17 15:23:30',1,9,30,NULL,'N/A',5.00),
(463,12,'Halim Seeds/Aliv Seeds/Garden Cress Organic for Eating',NULL,'',120.00,120.00,120.00,'none',0.00,1,0,NULL,NULL,0,0,0,20,0,0.00,'https://m.media-amazon.com/images/I/51GpoiI8oJL._AC_UF894,1000_QL80_.jpg','2025-11-24 06:22:12','2026-01-17 15:23:30',1,9,30,NULL,'N/A',5.00),
(464,12,'Swastiks Kabab masala ggp free ₹10/-(8p)',NULL,'',68.00,80.00,80.00,'amount',12.00,1,0,NULL,NULL,0,0,0,10,0,0.00,'https://5.imimg.com/data5/SELLER/Default/2023/5/305989940/RI/XA/AF/92279248/swastiks-kabab-masala-250x250.jpg','2025-11-24 06:24:38','2026-01-17 15:23:30',13,13,1,NULL,'N/A',5.00),
(465,7,'Chavi Match Box Sticks',NULL,'',440.00,600.00,440.00,'none',0.00,1,0,NULL,NULL,0,0,0,96,0,0.00,'https://m.media-amazon.com/images/I/51ULlS5Ih8L.jpg','2025-11-24 06:53:01','2026-02-10 06:26:20',3,3,1,NULL,'N/A',5.00),
(467,5,'GAJARAJ UPMA RAVA','GOYAL INDUSTRIES',NULL,45.00,1500.00,45.00,'none',0.00,1,0,NULL,NULL,0,0,0,87,0,0.00,'https://m.media-amazon.com/images/I/81j1oKz6MVL._AC_UF350,350_QL80_.jpg','2025-11-24 08:17:26','2026-02-11 05:27:38',1,9,30,NULL,'N/A',5.00),
(469,17,'MTR JAMUN129/-(B1G1)','MTR','',118.68,129.00,129.00,'percentage',8.00,1,0,NULL,NULL,0,0,0,25,0,0.00,'https://shop.mtrfoods.com/cdn/shop/files/gj160g_and_15g_indias_no1_fop-min_1_5ff5d3dc-37e6-49c7-8459-07716f874754_1_1024x1024_2x_1_1_1024x1024@2x.webp?v=1747292631','2025-11-25 12:43:15','2026-01-17 12:52:42',2,14,45,NULL,'N/A',5.00),
(470,2,'SOYA OIL LOOSE 15KG TIN',NULL,NULL,2100.00,2500.00,2100.00,'none',0.00,1,0,NULL,NULL,0,0,0,0,0,0.00,'https://5.imimg.com/data5/SELLER/Default/2023/8/335825721/GO/ZN/ST/158396614/soya-oil-500x500.jpg','2025-11-25 13:48:41','2026-01-10 11:25:55',17,17,1,NULL,'N/A',5.00),
(472,1,'Parle g GOLD 10RS(24P)','PARLE','',216.00,240.00,240.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,54,0,0.00,'https://nileshdryfruits.com/wp-content/uploads/2023/12/parle-gold-10.jpg','2025-11-25 13:55:37','2026-06-03 12:46:57',2,13,3,0.00,'N/A',5.00),
(473,12,'GINGER PASTE 5/-(10P)',NULL,NULL,35.00,50.00,50.00,'amount',15.00,1,0,NULL,NULL,0,0,0,24,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-I_IowL5OgdYu90_L9FmHWYA-V7L7IQ58Fw&s','2025-11-25 14:01:13','2026-01-22 05:53:06',13,10,6,NULL,'N/A',5.00),
(474,7,'RED LABEL 10/-(30p)',NULL,'',265.00,300.00,300.00,'amount',35.00,1,0,NULL,NULL,0,0,0,18,0,0.00,'https://fetchnbuy.in/cdn/shop/products/red_label_leaf_30gm__10312.1621435412_grande.png?v=1636538243','2025-11-25 14:03:15','2026-01-18 05:55:29',13,13,1,NULL,'N/A',5.00),
(475,13,'JAGGERY 1kg box(18p)',NULL,NULL,820.00,900.00,820.00,'none',0.00,1,0,NULL,NULL,0,0,0,17,0,0.00,'https://vrmshoppe.com/wp-content/uploads/2021/05/sugarcane-jaggery-500x500-1.jpg','2025-11-27 05:48:39','2026-01-22 05:00:12',2,2,1,NULL,'N/A',5.00),
(476,13,'JAGGERY',NULL,NULL,50.00,50.00,50.00,'none',0.00,1,0,NULL,NULL,0,0,0,190,0,0.00,'https://i0.wp.com/s3.ap-south-1.amazonaws.com/media.florafoods.in/wp-content/uploads/2019/07/24015405/Kolhapur-bella-01-.png?fit=800%2C800&ssl=1','2025-11-27 06:07:27','2026-01-22 05:53:06',9,9,1,NULL,'N/A',5.00),
(478,3,'PARLE G CHIPS 5/-(14P) MIX','PARLE','',61.60,70.00,70.00,'percentage',12.00,0,0,NULL,NULL,0,0,0,21,0,0.00,'https://i.ytimg.com/vi/cbNlFAHa3B8/maxresdefault.jpg','2025-11-28 07:54:13','2026-06-03 14:56:30',2,10,15,NULL,'N/A',5.00),
(479,8,'Svrm original sona',NULL,NULL,1120.00,1500.00,1120.00,'none',0.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'products/prod_692978b830e8e1.63138308.jpg','2025-11-28 10:26:00','2026-01-10 11:25:55',1,1,1,NULL,'N/A',5.00),
(481,11,'Vatika black 1/-(16p)',NULL,NULL,13.12,16.00,16.00,'percentage',18.00,1,0,NULL,NULL,0,0,0,60,0,0.00,'https://static.wixstatic.com/media/a962c7_82a364c8134c46e2b3a5a02529b02f7b~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg','2025-12-01 07:15:54','2026-01-17 12:55:40',2,15,60,NULL,'N/A',5.00),
(482,8,'RATNA KOLAM RICE 26KG',NULL,'',1575.00,1575.00,1575.00,'none',0.00,1,0,NULL,NULL,0,0,0,0,0,0.00,'https://cdn.dotpe.in/longtail/store-items/5664189/LcPHqGDE.webp','2025-12-01 13:24:53','2026-01-10 11:25:55',1,1,1,NULL,'N/A',5.00),
(484,5,'NIMRANI ATTA 1KG',NULL,NULL,50.00,65.00,50.00,'none',0.00,1,0,NULL,NULL,0,0,0,44,0,0.00,'https://images.jdmagicbox.com/quickquotes/images_main/nimrani-atta-2021455524-k1e20ur2.png','2025-12-02 05:58:48','2026-02-10 09:04:18',1,9,30,NULL,'N/A',5.00),
(485,5,'NIMRANI ATTA 5KG',NULL,NULL,220.00,235.00,220.00,'none',0.00,1,0,NULL,NULL,0,0,0,25,0,0.00,'https://images.jdmagicbox.com/quickquotes/images_main/nimrani-atta-2021455524-k1e20ur2.png','2025-12-02 06:03:18','2026-01-17 07:54:31',1,13,6,NULL,'N/A',5.00),
(486,8,'RATNA\'S JEERA RICE',NULL,'',1300.00,1300.00,1300.00,'none',0.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'https://cdn.dotpe.in/longtail/store-items/5664189/Z7HkRJl2.webp','2025-12-02 15:21:29','2026-01-10 11:25:55',1,1,1,NULL,'N/A',5.00),
(488,7,'RED LABEL  NATURAL CARE 1KG',NULL,NULL,488.00,610.00,610.00,'percentage',20.00,1,1,'2025-12-04 13:27:00','2025-12-05 13:27:00',0,0,0,0,0,0.00,'https://m.media-amazon.com/images/I/51wMdVj-xEL._SL1000_.jpg','2025-12-04 07:57:40','2026-01-10 11:25:55',14,14,1,NULL,'N/A',5.00),
(489,19,'KACHA MANGO BITE 800/-',NULL,'',696.00,800.00,800.00,'percentage',13.00,1,0,NULL,NULL,0,0,0,2,0,0.00,'https://www.bbassets.com/media/uploads/p/xl/40324641_1-parle-kaccha-mango-bite.jpg','2025-12-04 09:13:46','2026-01-17 15:28:48',2,8,2,NULL,'N/A',5.00),
(490,19,'CENTER FRESH',NULL,'',202.50,225.00,225.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,26,0,0.00,'https://www.glubery.com/public/uploads/1704730646Centre_Fresh_Chewing_Gum_Jar,_630_gm,_225_Pcs-4.jpeg','2025-12-04 09:14:55','2026-01-18 05:55:29',13,13,1,NULL,'N/A',5.00),
(491,19,'CENTER FRUIT',NULL,'',184.50,205.00,205.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,17,0,0.00,'https://m.media-amazon.com/images/I/51C7ha9i0XL.jpg','2025-12-04 09:17:47','2026-01-18 05:55:29',13,13,1,NULL,'N/A',5.00),
(492,19,'DAIRY MILK 20/-(40PC)',NULL,'',720.00,800.00,800.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,5,0,0.00,'https://www.bbassets.com/media/uploads/p/xl/281026_20-cadbury-dairy-milk-chocolate.jpg','2025-12-04 09:19:54','2026-01-17 12:54:38',2,13,12,NULL,'N/A',5.00),
(494,8,'APPU SONA RICE',NULL,'',1120.00,1500.00,1120.00,'none',0.00,1,0,NULL,NULL,0,0,0,36,0,0.00,'https://dukaan.b-cdn.net/700x700/webp/235985/3ca3694f-a551-4538-865d-0506c6b007eb.png','2025-12-04 09:36:30','2026-02-10 06:26:20',1,1,1,NULL,'N/A',5.00),
(495,8,'mehr kolam jeera rice',NULL,NULL,1580.00,1950.00,1580.00,'none',0.00,1,0,NULL,NULL,0,0,0,50,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmtdcxutpS_XM6X4GJAsuDBkV1w8vOFGyLfQ&s','2025-12-08 06:04:27','2026-01-17 12:54:38',1,1,1,NULL,'N/A',5.00),
(496,16,'himalaya baby vale pack',NULL,'',150.00,250.00,250.00,'amount',100.00,0,0,NULL,NULL,0,0,0,12,0,0.00,'https://www.bbassets.com/media/uploads/p/xl/100014839_6-himalaya-baby-baby-powder.jpg','2025-12-08 07:32:41','2026-06-03 13:48:34',14,14,1,NULL,'N/A',5.00),
(497,12,'MTR Sambar 200gm 150/-','MTR',NULL,132.00,150.00,150.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,40,0,0.00,NULL,'2025-12-08 10:50:27','2026-01-17 12:52:42',21,14,1,NULL,'N/A',5.00),
(498,1,'TIGER 5RS(24P)','BRITANIA','',108.00,120.00,120.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,101,0,0.00,'https://www.bigbasket.com/media/uploads/groot/images/5102020-d5f7e2ea-icon_01.jpg','2025-12-09 05:30:12','2026-06-03 12:46:08',2,13,6,0.00,'N/A',5.00),
(499,4,'BABOOL PASTE (350GM) 123/-',NULL,NULL,110.70,123.00,123.00,'percentage',10.00,1,1,'2025-12-11 11:34:00','2025-12-12 11:34:00',0,0,1,14,0,0.00,'https://www.daburshop.com/cdn/shop/files/Babool_1024x1024.png?v=1748334357','2025-12-11 06:03:50','2026-01-17 06:53:15',14,14,1,NULL,'N/A',5.00),
(501,16,'LUX Soft Glow Rose and Vitamin E Soap  (8 x 150 g)','HUL','',299.55,431.00,431.00,'percentage',30.50,0,0,NULL,NULL,0,0,0,6,0,0.00,'https://rukminim2.flixcart.com/image/480/640/xif0q/soap/v/3/y/-original-imaha2sfufkg8ywg.jpeg?q=90','2025-12-11 06:28:25','2026-06-03 13:48:27',13,13,1,NULL,'N/A',5.00),
(502,13,'Ankur Iodised Salt 20/-(25P)',NULL,'',210.00,250.00,210.00,'none',0.00,0,0,NULL,NULL,0,0,0,15,0,0.00,'https://www.bbassets.com/media/uploads/p/l/40188046_1-ankur-iodised-salt.jpg','2025-12-11 06:35:17','2026-06-03 12:31:23',1,1,1,NULL,'N/A',5.00),
(503,4,'PEPSODENT Cavity Protection Toothpaste  (300 g, Pack of 2)','HUL','',151.50,202.00,202.00,'percentage',25.00,1,1,'2025-12-11 12:14:00','2025-12-12 12:14:00',0,0,0,12,0,0.00,'https://m.media-amazon.com/images/I/51F9Wd9xOAL._AC_UF1000,1000_QL80_.jpg','2025-12-11 06:45:12','2026-01-17 06:53:15',21,14,1,NULL,'N/A',5.00),
(504,18,'Slice Mango Drink  (1.75 L)',NULL,'',89.30,94.00,94.00,'percentage',5.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'https://www.bbassets.com/media/uploads/p/l/265879_17-slice-thickest-mango-drink.jpg','2025-12-11 06:49:31','2026-06-03 15:05:51',13,14,1,NULL,'N/A',5.00),
(505,18,'Slice Mango Drink  (600 ml)',NULL,'',38.00,40.00,40.00,'percentage',5.00,0,0,NULL,NULL,0,0,0,0,0,0.00,'https://www.bbassets.com/media/uploads/p/l/265884_12-slice-thickest-mango-drink.jpg','2025-12-11 06:52:25','2026-06-03 15:05:50',13,14,12,NULL,'N/A',5.00),
(506,18,'7UP Soft Drink PET Bottle  (750 ml)',NULL,'',36.80,40.00,40.00,'percentage',8.00,1,0,NULL,NULL,0,0,0,46,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiOSP-UMW8QFgkS1nDXKur5aNJbDio9A5hpQ&s','2025-12-11 06:55:48','2026-07-06 13:54:06',13,14,12,NULL,'N/A',5.00),
(507,17,'YiPPee! SUNFEAST 5/-(12P)',NULL,NULL,55.20,60.00,60.00,'percentage',8.00,1,0,NULL,NULL,0,0,0,732,0,0.00,'https://www.bbassets.com/media/uploads/p/l/287005_17-sunfeast-yippee-magic-masala-noodles.jpg','2025-12-11 07:00:42','2026-02-24 03:44:23',2,10,28,NULL,'N/A',5.00),
(511,2,'health fit 15ltr','','',2220.00,2220.00,2220.00,'none',0.00,1,0,NULL,NULL,0,0,0,15,0,0.00,'https://dukaan.b-cdn.net/1000x1000/webp/3157141/3adcfd58-c925-48ab-bc5d-885ba591ccfd/1618020852255-ad1def8b-5c34-4ecf-8688-9d15e3328689.jpeg','2025-12-25 13:44:47','2026-02-10 13:31:58',14,14,1,0.00,'N/A',5.00),
(513,19,'MELODY Bigger jar','PARLE','',710.00,800.00,800.00,'amount',90.00,1,0,NULL,NULL,0,0,0,16,0,0.00,'https://5.imimg.com/data5/SELLER/Default/2024/12/473051558/LA/GK/OU/197742494/3-128kg-parle-melody-chocolate-candy-500x500.png','2026-01-17 13:15:27','2026-02-10 07:04:42',2,8,2,0.00,'N/A',5.00),
(514,1,'Parle-G 30Rs','PARLE','',27.30,30.00,30.00,'percentage',9.00,1,0,NULL,NULL,1,1,0,0,0,0.00,'https://5.imimg.com/data5/ECOM/Default/2024/9/450501920/SO/CQ/CI/141449392/parle-gluco-biscuits-parle-g-quick-pantry-3-500x500.jpg','2026-01-17 13:18:04','2026-06-03 12:38:52',2,14,48,0.00,'N/A',5.00),
(515,1,'20-20 10/-','PARLE','',108.00,10.00,120.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,53,0,0.00,'https://5.imimg.com/data5/ON/UR/MX/SELLER-16699599/parle-20-20-cashew-biscuits.jpg','2026-01-17 13:19:44','2026-06-03 12:31:17',2,13,8,0.00,'N/A',5.00),
(517,1,'50-50 CHAKSA MASKA 10/-','BRITANIA','',9.00,10.00,10.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,480,0,0.00,'https://www.bbassets.com/media/uploads/p/l/40001600_15-britannia-50-50-maska-chaska-salted-biscuits.jpg','2026-01-17 13:30:44','2026-06-03 12:36:59',2,14,96,0.00,'N/A',5.00),
(518,19,'KISMI 50RS','PARLE','',43.50,50.00,50.00,'percentage',13.00,1,0,NULL,NULL,0,0,0,74,0,0.00,NULL,'2026-01-17 14:48:29','2026-02-11 05:27:38',1,13,40,0.00,'N/A',5.00),
(519,19,'KACHHA MANGO 50/-','PARLE','',43.50,50.00,50.00,'percentage',13.00,1,0,NULL,NULL,0,0,0,72,0,0.00,NULL,'2026-01-17 14:48:59','2026-02-10 11:02:30',1,13,40,0.00,'N/A',5.00),
(520,19,'London dairy 50/-','PARLE','',43.50,50.00,50.00,'percentage',13.00,1,0,NULL,NULL,0,0,0,68,0,0.00,'https://www.google.com/search?client=ms-android-vivo-terr1-rso2&hs=ZKBp&sca_esv=23d9354b2618c32b&sxsrf=ANbL-n6AVJHo0YH3KFc6npgcWs6L1b0N7g:1768662425712&udm=2&fbs=ADc_l-bZnt6jMmErT-KRarIgXyuyEbgLVbVrL19D752u5Zq1JxsknUc6k2WnAYdF3IRSWkTk95d2vaU2uQotuOUIDN-9Q','2026-01-17 15:07:36','2026-02-10 11:02:30',1,14,40,0.00,'N/A',5.00),
(521,3,'GREEN PEAS 5/-','SMILE','',50.00,5.00,60.00,'amount',10.00,1,0,NULL,NULL,0,0,0,150,0,0.00,NULL,'2026-01-18 08:11:57','2026-01-18 08:11:57',3,10,5,0.00,'N/A',5.00),
(522,12,'KABAB 10/-',NULL,'',70.00,10.00,80.00,'amount',10.00,1,0,NULL,NULL,0,0,0,10,0,0.00,NULL,'2026-01-18 08:13:21','2026-01-18 08:13:37',10,10,1,0.00,'N/A',5.00),
(524,16,'MEDIMIX 35/-(PEN OFFER)','','',31.85,35.00,35.00,'percentage',8.99,1,0,NULL,NULL,0,0,0,100,0,0.00,'https://img.clevup.in/330294/1698414083943_SKU-0282_0.jpg?width=600&format=webp','2026-01-18 08:15:30','2026-06-03 13:46:25',2,14,300,0.00,'N/A',5.00),
(525,12,'EVEREST CHIKEN HANGER 5RS',NULL,'',240.00,5.00,300.00,'percentage',20.00,1,0,NULL,NULL,0,0,0,7,0,0.00,NULL,'2026-01-18 08:16:54','2026-01-24 11:15:06',13,13,1,0.00,'N/A',5.00),
(526,16,'NO.1 lime 40/-','','',36.00,40.00,40.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,37,0,0.00,'https://www.bbassets.com/media/uploads/p/l/40067902_3-godrej-no1-bathing-soap-lime-aloe-vera.jpg','2026-01-18 08:17:49','2026-06-03 13:38:42',2,13,56,0.00,'N/A',5.00),
(527,4,'DANTKANTI 10RS','PATANJALI','',108.00,10.00,120.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,10,0,0.00,NULL,'2026-01-18 08:18:33','2026-01-18 08:18:33',2,13,24,0.00,'N/A',5.00),
(528,4,'MAXFRESH 10/-','COLGATE','',105.60,10.00,120.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,6,0,0.00,NULL,'2026-01-18 08:19:01','2026-02-10 09:04:18',2,13,24,0.00,'N/A',5.00),
(529,4,'MAXFRESH 20/-','COLGATE','',213.60,20.00,240.00,'percentage',11.00,1,0,NULL,NULL,0,0,0,7,0,0.00,'https://sahriseva.com/wp-content/uploads/2025/09/17-4.png','2026-01-18 08:19:33','2026-06-03 12:30:13',2,13,24,0.00,'N/A',5.00),
(530,4,'COLGATE ZIG ZAG 25/-','COLGATE','',175.00,25.00,250.00,'percentage',30.00,1,0,NULL,NULL,0,0,0,11,0,0.00,NULL,'2026-01-18 08:21:26','2026-01-22 05:53:06',2,10,24,0.00,'N/A',5.00),
(531,4,'LONDON DAIRY BIGGER','PARLE','',704.00,800.00,800.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,12,0,0.00,NULL,'2026-01-18 08:23:21','2026-01-18 08:23:21',2,8,2,0.00,'N/A',5.00),
(532,19,'KISMI GOLD BIGGER','PARLE','',704.00,800.00,800.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,2,0,0.00,NULL,'2026-01-18 08:23:48','2026-01-19 14:36:32',2,8,2,0.00,'N/A',5.00),
(533,19,'KACHHA MANGO BIGGER','PARLE','',704.00,800.00,800.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,4,0,0.00,NULL,'2026-01-18 08:24:12','2026-01-18 08:24:12',2,8,2,0.00,'N/A',5.00),
(534,6,'ZANDU BALM 43/-',NULL,'',38.70,43.00,43.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,94,0,0.00,NULL,'2026-01-18 08:25:06','2026-02-11 05:27:38',13,14,20,0.00,'N/A',5.00),
(535,16,'PEARS 20/-','HUL','',18.60,24.00,20.00,'percentage',7.00,1,0,NULL,NULL,0,0,0,60,0,0.00,'https://static.wixstatic.com/media/e1e9e8_b38a0ecd7aa64c8eaeaafef1223ff361~mv2.jpg/v1/fill/w_980,h_551,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/e1e9e8_b38a0ecd7aa64c8eaeaafef1223ff361~mv2.jpg','2026-01-19 13:23:32','2026-06-03 13:31:45',14,14,1,0.00,'N/A',5.00),
(536,6,'MENTO PLUS 10/-',NULL,'',109.20,10.00,120.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,23,0,0.00,NULL,'2026-01-19 13:42:33','2026-02-10 05:59:30',13,10,5,0.00,'N/A',5.00),
(537,18,'BRU 2/-','HUL','',0.00,2.00,0.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,13,0,0.00,'https://www.indiamart.com/proddetail/bru-coffee-rs-2-2853263254073.html?srsltid=AfmBOoo-C2alQDY7Vh5rPzKVgssjPxRmc3Q6jVMcaLFQV-kMgAv-tjuD','2026-01-19 13:43:34','2026-06-03 15:05:34',13,13,144,0.00,'N/A',5.00),
(538,18,'BRU 10/-','HUL','',108.00,10.00,120.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,48,0,0.00,'https://static.wixstatic.com/media/e1e9e8_3526256d06f047bd8bbdae0e8bce16b8~mv2.jpg/v1/fill/w_679,h_382,al_c,q_80,enc_avif,quality_auto/e1e9e8_3526256d06f047bd8bbdae0e8bce16b8~mv2.jpg','2026-01-19 13:54:50','2026-06-03 15:05:35',10,10,12,0.00,'N/A',5.00),
(539,14,'EXO KATA','HUL','',81.90,10.00,90.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,45,0,0.00,'https://balajisellsproduct.wordpress.com/2017/05/23/3-pack-of-pitambari-dishwash-soap-with-free-exo-stainless-scrubber/','2026-01-19 14:01:47','2026-02-10 11:02:30',10,10,24,0.00,'N/A',5.00),
(540,19,'MAZELO 50/-','PARLE','',45.50,50.00,50.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,50,0,0.00,'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSEhMWFhUXGRgWGBgYGBgaHxsYGBcXGhgaFx0dHSggGBolGxUXITEhJSkrMC4uGR8zODMtNygtLisBCgoKDg0OGxAQGy0lHyYvLS0tLS0vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/','2026-01-19 14:12:18','2026-01-19 14:12:18',13,13,24,0.00,'N/A',5.00),
(541,19,'MELODY 1 KG JAR','PARLE','',136.50,150.00,150.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,26,0,0.00,'https://rukminim2.flixcart.com/image/480/640/kbdz5ow0/candy-mouth-freshener/v/e/y/150-melody-chocolaty-parle-original-imafsr7hegd3jmb6.jpeg?q=90','2026-01-19 14:16:01','2026-02-11 06:20:17',2,8,12,0.00,'N/A',5.00),
(542,19,'MAZOLO 1 KG JAR','PARLE','',136.50,141.00,150.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,11,0,0.00,'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITFoL9MneKZD2W4YrgEa47jYb779CbvzgbGxUYGBoaHSggGx0lGxoXIzIhJyorLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGzIlICYtMi0tLi0vLS8tLS0vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/','2026-01-19 14:19:01','2026-01-24 10:20:16',8,8,12,0.00,'N/A',5.00),
(543,1,'PARLE MARIE 4.5/-','PARLE','',49.14,5.00,54.00,'percentage',9.00,1,0,NULL,NULL,1,0,0,714,0,0.00,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQplNm3f3dyvFRpbaX1SSOWxbAu6q60oSDecA&s','2026-01-19 14:24:48','2026-06-03 12:36:03',2,13,12,0.00,'N/A',5.00),
(544,19,'ORANGE BITE 1 KG JAR','PARLE','',136.50,150.00,150.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,6,0,0.00,'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTERITEhIWFRUXFxsYFxgYGR0ZGhUZGxUWGBkZGhcbHSkgGBsmGx0aITEhJSkrLi4uHR84ODMsNygtLisBCgoKDg0OGxAQGzcmHyUzMjUrLysvKy0tLS0tLS0rNS01MCstLTArMC0tLS4tNS0tKy0vNS0tLTUtLS0tNS0tLf/AABEIAOEA4QMBIgACEQEDEQH/','2026-01-19 14:31:01','2026-02-11 06:20:17',8,8,12,0.00,'N/A',5.00),
(545,19,'PARLE POPPIES 2/-','PARLE','',91.00,2.00,100.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,14,0,0.00,'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEBUSEhAVFhUSFxgSFhYXGRgbGBUWFhUWGhgXGBcZHSggGBsnHRcZITEhJSkrLjIuGR8zOzMtNzQvOisBCgoKDg0OGxAQGy8mICUtLy0tNS0vLy0wLy8vLS0tLTUyLS0tLS4tLS8tLS0tLS0tLS0vLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/','2026-01-19 14:33:25','2026-01-19 14:33:25',13,13,1,0.00,'N/A',5.00),
(546,19,'KISMI BAR 2/-','PARLE','',109.20,2.00,120.00,'percentage',9.00,1,0,NULL,NULL,0,0,0,16,0,0.00,'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXFx0YGBcYGBgXGBcdGhgYFxgYFxgYHSggGB0mGxcXITEiJSkrLi4uGCAzODMtNygtLisBCgoKDg0OGxAQGy0lICYtLS8tMi0tLy0vLzAtLS0tLS0tLS0tLS0vLS0tLS0tNS0tLS0tLS0tLS0tLS0tLi0tLv/AABEIANQA7gMBIgACEQEDEQH/','2026-01-19 14:46:42','2026-02-11 05:41:08',2,13,1,0.00,'N/A',5.00),
(547,1,'20 20 30Rs','PARLE','',27.30,30.00,30.00,'percentage',9.00,1,0,NULL,NULL,1,1,0,79,0,0.00,'https://www.bbassets.com/media/uploads/p/l/20004284_12-parle-20-20-butter-cookies.jpg','2026-01-22 15:24:11','2026-07-06 13:54:06',2,14,50,0.00,'N/A',5.00),
(548,18,'SPRITE 2,5L',NULL,'',85.00,110.00,110.00,'amount',25.00,0,0,NULL,NULL,0,0,0,25,0,0.00,NULL,'2026-01-22 15:25:53','2026-06-03 15:05:20',13,14,9,0.00,'N/A',5.00),
(550,3,'BADANG 5/-',NULL,'',50.00,5.00,60.00,'amount',10.00,0,0,NULL,NULL,0,0,0,15,0,0.00,NULL,'2026-01-24 06:07:31','2026-06-03 14:55:51',3,10,5,0.00,'N/A',5.00),
(552,3,'SOYSTIKS 5/-',NULL,'',50.00,5.00,60.00,'amount',10.00,0,0,NULL,NULL,0,0,0,53,0,0.00,NULL,'2026-01-24 06:09:23','2026-06-03 14:55:46',3,10,5,0.00,'N/A',5.00),
(553,3,'SHENGA 5/-',NULL,'',50.00,5.00,60.00,'amount',10.00,0,0,NULL,NULL,0,0,0,60,0,0.00,NULL,'2026-01-24 06:10:24','2026-06-03 14:55:45',3,10,5,0.00,'N/A',5.00),
(554,19,'MELODY 50RS','PARLE','',45.00,50.00,50.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,200,0,0.00,NULL,'2026-01-24 07:26:30','2026-01-24 07:26:30',2,14,48,0.00,'N/A',5.00),
(555,4,'Closeup 10/-','HUL','',108.00,10.00,120.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,9,0,0.00,NULL,'2026-01-24 10:12:12','2026-01-24 10:20:16',2,5,24,0.00,'N/A',5.00),
(556,19,'Mazelo 5Rs','PARLE','',13.20,5.00,15.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,10,0,0.00,NULL,'2026-01-24 10:14:48','2026-01-24 10:14:48',13,13,1,0.00,'N/A',5.00),
(557,7,'Indica easy 15/-',NULL,'',13.20,15.00,15.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,5,0,0.00,NULL,'2026-01-24 10:16:12','2026-01-24 10:20:16',13,13,1,0.00,'N/A',5.00),
(558,7,'Gillette 14/-',NULL,'',12.32,14.00,14.00,'percentage',12.00,1,0,NULL,NULL,0,0,0,980,0,0.00,NULL,'2026-01-24 10:16:58','2026-01-24 10:20:16',13,13,1,0.00,'N/A',5.00),
(561,2,'Annapurna oil 5ltr',NULL,'',775.00,900.00,775.00,'none',0.00,1,0,NULL,NULL,0,0,0,21,0,0.00,NULL,'2026-01-24 10:23:09','2026-01-24 10:24:12',2,8,4,0.00,'N/A',5.00),
(562,17,'Magi 10/-',NULL,'',8.90,10.00,10.00,'percentage',11.00,1,0,NULL,NULL,0,0,0,176,0,0.00,NULL,'2026-01-24 10:29:08','2026-01-24 10:32:35',14,14,1,0.00,'N/A',5.00),
(563,1,'Hideseek 10/-','PARLE','',180.00,10.00,200.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,23,0,0.00,'https://www.bbassets.com/media/uploads/p/l/302102_5-parle-hide-seek-chocolate.jpg','2026-01-24 10:34:21','2026-06-03 12:34:11',2,13,8,0.00,'N/A',5.00),
(564,1,'Fab jamin','PARLE','',106.80,10.00,120.00,'percentage',11.00,1,0,NULL,NULL,1,0,0,24,0,0.00,'https://www.bbassets.com/media/uploads/p/l/100526516_8-parle-happy-happy-jam-in-cream.jpg','2026-01-24 10:36:46','2026-06-03 12:32:27',2,13,10,0.00,'N/A',5.00),
(566,7,'Feviquick 5/-',NULL,'',110.00,5.00,110.00,'none',11.00,1,0,NULL,NULL,0,0,0,22,0,0.00,NULL,'2026-01-24 10:58:04','2026-01-24 11:00:47',13,15,3,0.00,'N/A',5.00),
(567,7,'Bajaj 1/-',NULL,'',80.00,100.00,80.00,'none',11.00,1,0,NULL,NULL,0,0,0,7,0,0.00,NULL,'2026-01-24 10:58:48','2026-02-10 07:33:06',13,13,3,0.00,'N/A',5.00),
(568,12,'Turmaric 10/-',NULL,'',10.00,10.00,10.00,'none',0.00,1,0,NULL,NULL,0,0,0,5,0,0.00,NULL,'2026-01-24 10:59:51','2026-01-24 11:00:47',10,10,1,0.00,'N/A',5.00),
(570,11,'Indica easy 30/-',NULL,'',26.00,30.00,26.00,'none',0.00,1,0,NULL,NULL,0,0,0,88,0,0.00,NULL,'2026-01-24 11:12:54','2026-01-24 11:15:06',14,14,1,0.00,'N/A',5.00),
(571,11,'Nisha 15/-',NULL,'',85.00,15.00,85.00,'none',0.00,1,0,NULL,NULL,0,0,0,24,0,0.00,NULL,'2026-01-24 11:13:49','2026-01-24 11:15:06',13,13,1,0.00,'N/A',5.00),
(572,19,'KINDER JOY 10/-',NULL,'',230.00,10.00,230.00,'none',0.00,1,0,NULL,NULL,0,0,0,11,0,0.00,NULL,'2026-01-24 11:17:34','2026-01-24 11:52:53',13,13,1,0.00,'N/A',5.00),
(574,11,'CHIK 1/-',NULL,'',13.00,1.00,13.00,'none',0.00,1,0,NULL,NULL,0,0,0,70,0,0.00,NULL,'2026-01-24 11:19:47','2026-01-24 11:19:47',2,10,60,0.00,'N/A',5.00),
(576,1,'Choco roll 10/-','PARLE','',144.00,10.00,160.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,21,0,0.00,'https://www.bbassets.com/media/uploads/p/l/40086541_5-parle-hide-seek-choco-rolls.jpg','2026-01-24 11:52:16','2026-06-03 12:05:24',2,13,8,0.00,'N/A',5.00),
(577,12,'gurella',NULL,'',150.00,150.00,150.00,'none',0.00,1,0,NULL,NULL,0,0,0,50,0,0.00,NULL,'2026-02-10 04:57:50','2026-02-10 04:57:50',9,9,1,0.00,'N/A',5.00),
(579,12,'Turmeric loose',NULL,'',200.00,240.00,200.00,'none',0.00,1,0,NULL,NULL,0,0,0,50,0,0.00,NULL,'2026-02-10 12:06:05','2026-02-10 12:06:05',9,9,1,0.00,'N/A',5.00),
(580,5,'Kadli hitt loose',NULL,'',95.00,95.00,95.00,'none',0.00,1,0,NULL,NULL,0,0,0,100,0,0.00,NULL,'2026-02-10 12:07:07','2026-02-10 12:07:07',9,9,1,0.00,'N/A',5.00),
(581,9,'SADAK GODHI',NULL,'',100.00,100.00,100.00,'none',0.00,1,0,NULL,NULL,0,0,0,25,0,0.00,NULL,'2026-02-10 12:14:51','2026-02-10 12:14:51',9,9,1,0.00,'N/A',5.00),
(582,7,'Cell(remote)',NULL,'',85.00,100.00,85.00,'none',0.00,1,0,NULL,NULL,0,0,0,10,0,0.00,NULL,'2026-02-10 12:20:55','2026-02-10 12:20:55',10,10,1,0.00,'N/A',5.00),
(583,7,'Mosquito batti(sollibatti)',NULL,'',95.00,120.00,95.00,'none',0.00,1,0,NULL,NULL,0,0,0,10,0,0.00,NULL,'2026-02-10 12:22:01','2026-02-10 13:31:06',5,5,1,0.00,'N/A',5.00),
(586,4,'Ajay hard brush',NULL,'',18.00,22.00,18.00,'none',0.00,0,0,NULL,NULL,0,0,0,0,0,0.00,NULL,'2026-02-11 04:45:14','2026-06-03 11:44:31',13,14,36,0.00,'N/A',5.00),
(587,12,'Vati kopra','','',260.00,260.00,260.00,'none',0.00,0,0,NULL,NULL,0,0,0,0,0,0.00,NULL,'2026-02-11 04:47:17','2026-06-03 11:44:29',9,9,1,0.00,'N/A',5.00),
(588,16,'NO 1 SANDAL 40/-','GODREJ','',36.00,40.00,40.00,'percentage',10.00,1,0,NULL,NULL,0,0,0,56,0,0.00,'https://m.media-amazon.com/images/I/61XzvGx10VL.jpg','2026-06-03 13:44:11','2026-06-03 13:44:11',2,14,56,0.00,'N/A',5.00);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `purchase_items`
--

DROP TABLE IF EXISTS `purchase_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchase_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `cost_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `line_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `unit_type` enum('primary','secondary') DEFAULT 'secondary',
  PRIMARY KEY (`id`),
  KEY `purchase_id` (`purchase_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `purchase_items_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`),
  CONSTRAINT `purchase_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_items`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `purchase_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_items` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_id` int(11) NOT NULL,
  `purchase_date` date DEFAULT NULL,
  `invoice_no` varchar(100) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchases`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `purchases` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchases` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `returned_goods`
--

DROP TABLE IF EXISTS `returned_goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `returned_goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `order_item_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `deliveryman_id` int(11) NOT NULL,
  `ordered_qty` int(11) NOT NULL,
  `delivered_qty` int(11) NOT NULL,
  `returned_qty` int(11) NOT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `reason` varchar(100) DEFAULT NULL,
  `status` enum('pending','restocked','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_ord` (`order_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_dm` (`deliveryman_id`),
  KEY `idx_item` (`order_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `returned_goods`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `returned_goods` DISABLE KEYS */;
/*!40000 ALTER TABLE `returned_goods` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `salesman_accounts`
--

DROP TABLE IF EXISTS `salesman_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesman_accounts` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `commission_percentage` decimal(5,2) DEFAULT 5.00,
  `status` enum('active','inactive','on_leave') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL,
  `device_id` varchar(255) DEFAULT NULL,
  `app_version` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesman_accounts`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `salesman_accounts` DISABLE KEYS */;
INSERT INTO `salesman_accounts` VALUES
(1,'SA01','SHEKAR KALLUR','s@anpmart.in','$2y$10$jQSfafOpatzNxAHf9taiv.sXDr2pUU7TutEdm6uDTCsKPSzzNyWZK','7019409814',0.10,'active','2026-06-03 15:20:27','2026-07-06 13:53:28','2026-07-06 13:53:28',NULL,NULL);
/*!40000 ALTER TABLE `salesman_accounts` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `salesman_attendance`
--

DROP TABLE IF EXISTS `salesman_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesman_attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesman_id` int(11) NOT NULL,
  `punch_in_time` datetime NOT NULL,
  `punch_in_latitude` decimal(10,8) DEFAULT NULL,
  `punch_in_longitude` decimal(11,8) DEFAULT NULL,
  `punch_in_location` varchar(255) DEFAULT NULL,
  `punch_in_address` text DEFAULT NULL,
  `punch_out_time` datetime DEFAULT NULL,
  `punch_out_latitude` decimal(10,8) DEFAULT NULL,
  `punch_out_longitude` decimal(11,8) DEFAULT NULL,
  `punch_out_location` varchar(255) DEFAULT NULL,
  `punch_out_address` text DEFAULT NULL,
  `working_hours` decimal(5,2) DEFAULT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('present','absent','half_day','on_leave') DEFAULT 'present',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `edited_by_supervisor` int(11) DEFAULT NULL,
  `edited_at` timestamp NULL DEFAULT NULL,
  `is_edited` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attendance` (`salesman_id`,`attendance_date`),
  KEY `idx_attendance_date` (`attendance_date`),
  KEY `idx_status` (`status`),
  KEY `fk_edited_supervisor` (`edited_by_supervisor`),
  KEY `idx_salesman_date` (`salesman_id`,`attendance_date`),
  KEY `idx_attendance_edited` (`is_edited`),
  CONSTRAINT `fk_edited_supervisor` FOREIGN KEY (`edited_by_supervisor`) REFERENCES `supervisor_accounts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `salesman_attendance_ibfk_1` FOREIGN KEY (`salesman_id`) REFERENCES `salesman_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesman_attendance`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `salesman_attendance` DISABLE KEYS */;
INSERT INTO `salesman_attendance` VALUES
(1,1,'2026-06-30 08:02:41',15.59476100,74.78329340,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-06-30','present',NULL,'2026-06-30 02:32:41','2026-06-30 02:32:41',NULL,NULL,0);
/*!40000 ALTER TABLE `salesman_attendance` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `salesman_beat_assignments`
--

DROP TABLE IF EXISTS `salesman_beat_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesman_beat_assignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesman_id` int(11) NOT NULL,
  `beat_id` int(11) NOT NULL,
  `assigned_by` int(11) NOT NULL COMMENT 'supervisor_id',
  `assigned_date` date NOT NULL,
  `is_active` enum('yes','no') DEFAULT 'yes',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_salesman_beat` (`salesman_id`,`beat_id`),
  KEY `idx_salesman` (`salesman_id`),
  KEY `idx_beat` (`beat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesman_beat_assignments`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `salesman_beat_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `salesman_beat_assignments` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `salesman_beat_customers`
--

DROP TABLE IF EXISTS `salesman_beat_customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesman_beat_customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `beat_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `visit_sequence` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_beat_customer` (`beat_id`,`customer_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `salesman_beat_customers_ibfk_1` FOREIGN KEY (`beat_id`) REFERENCES `salesman_beats` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesman_beat_customers`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `salesman_beat_customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `salesman_beat_customers` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `salesman_beats`
--

DROP TABLE IF EXISTS `salesman_beats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesman_beats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesman_id` int(11) NOT NULL,
  `beat_name` varchar(100) NOT NULL,
  `beat_code` varchar(50) DEFAULT NULL,
  `week_number` int(11) DEFAULT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') DEFAULT NULL,
  `area` varchar(100) DEFAULT NULL,
  `total_customers` int(11) DEFAULT 0,
  `is_active` enum('yes','no') DEFAULT 'yes',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_salesman_week` (`salesman_id`,`week_number`,`day_of_week`),
  CONSTRAINT `salesman_beats_ibfk_1` FOREIGN KEY (`salesman_id`) REFERENCES `salesman_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesman_beats`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `salesman_beats` DISABLE KEYS */;
/*!40000 ALTER TABLE `salesman_beats` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `salesman_commission_payouts`
--

DROP TABLE IF EXISTS `salesman_commission_payouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesman_commission_payouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesman_id` int(11) NOT NULL,
  `month_year` varchar(7) NOT NULL,
  `total_sales` decimal(12,2) DEFAULT 0.00,
  `total_commission` decimal(12,2) DEFAULT 0.00,
  `status` enum('pending','paid','rejected') DEFAULT 'pending',
  `paid_date` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_payout` (`salesman_id`,`month_year`),
  KEY `idx_salesman_id` (`salesman_id`),
  KEY `idx_status` (`status`),
  KEY `idx_month_year` (`month_year`),
  CONSTRAINT `salesman_commission_payouts_ibfk_1` FOREIGN KEY (`salesman_id`) REFERENCES `salesman_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesman_commission_payouts`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `salesman_commission_payouts` DISABLE KEYS */;
/*!40000 ALTER TABLE `salesman_commission_payouts` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `salesman_customers`
--

DROP TABLE IF EXISTS `salesman_customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesman_customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesman_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `assigned_date` timestamp NULL DEFAULT current_timestamp(),
  `status` enum('active','inactive') DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_assignment` (`salesman_id`,`customer_id`),
  KEY `idx_salesman_id` (`salesman_id`),
  CONSTRAINT `salesman_customers_ibfk_1` FOREIGN KEY (`salesman_id`) REFERENCES `salesman_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=705 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesman_customers`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `salesman_customers` DISABLE KEYS */;
INSERT INTO `salesman_customers` VALUES
(629,1,333,'SANTOSH RAMJI','8867526165','sant@gmail.com','2026-01-13 18:30:00','active'),
(630,1,334,'Prateek','7975727962','prateek@gmail.com','2026-01-16 18:30:00','active'),
(631,1,335,'MK STORES','6361312649','mkstores@gmail.com','2026-01-16 18:30:00','active'),
(632,1,336,'Mahalaxmi Sweets','8123798174','mahalaxmi@gmail.com','2026-01-16 18:30:00','active'),
(633,1,337,'Dairy Kirani stores','8088925874','dairy@gmail.com','2026-01-16 18:30:00','active'),
(634,1,338,'Basaveshwara Sweets','8310287618','nagu@gmail.com','2026-01-16 18:30:00','active'),
(635,1,339,'Durga Pan Shop','9902904713','vittal@gmail.com','2026-01-16 18:30:00','active'),
(636,1,340,'Bhemmapa Yaradal','7204641508','bhemmapa@gmail.com','2026-01-16 18:30:00','active'),
(637,1,341,'Rani Sweets','8217890900','rani@gmail.com','2026-01-16 18:30:00','active'),
(638,1,342,'Noorani pan shop','7760819004','noorani@gmail.com','2026-01-16 18:30:00','active'),
(639,1,343,'Brothers Pan shop','8861580496','bro@gmail.com','2026-01-16 18:30:00','active'),
(640,1,344,'Halasagi 4','7795331004','h@gmail.com','2026-01-16 18:30:00','active'),
(641,1,345,'Basavaraj hubbali','6361326698','basavaraj@gmail.com','2026-01-16 18:30:00','active'),
(642,1,346,'Parimala store','7795806251','sb@gmail.com','2026-01-16 18:30:00','active'),
(643,1,347,'Madivalppa Kammar','9164235893','madivalappa@gmail.com','2026-01-16 18:30:00','active'),
(644,1,348,'Channappa Gokavi','8151849044','gokavi@gmail.com','2026-01-16 18:30:00','active'),
(645,1,349,'Isak store','7026170209','isak@gmail.com','2026-01-16 18:30:00','active'),
(646,1,350,'Manik Angol','9535953423','manik@gmail.com','2026-01-16 18:30:00','active'),
(647,1,351,'Vinod Yaligar mk','8217027778','vinod@gmail.com','2026-01-16 18:30:00','active'),
(648,1,352,'Nagappa Tubaki','9591650992','nagappa@gmail.com','2026-01-16 18:30:00','active'),
(649,1,353,'Veerabhadra urus','7760429620','v@gmail.com','2026-01-16 18:30:00','active'),
(650,1,354,'Savadi k/s','6360282970','s@gmail.com','2026-01-16 18:30:00','active'),
(651,1,355,'Tegur kirani stores','6361898202','t@gmail.com','2026-01-16 18:30:00','active'),
(652,1,356,'Betageri kirani','8904260785','b@gmail.com','2026-01-16 18:30:00','active'),
(653,1,357,'B b RAMMANNAVAR','9845061126','shashi@gmail.com','2026-01-16 18:30:00','active'),
(654,1,358,'Laxmi stores ( YSL )','8660588994','ysl@gmail.com','2026-01-16 18:30:00','active'),
(656,1,360,'Battaru','9731570106','battaru@gmail.com','2026-01-16 18:30:00','active'),
(657,1,361,'Nagoji Kirani stores','8050392898','nagoji@gmail.com','2026-01-16 18:30:00','active'),
(664,1,368,'S s attimarad','9611687920','ssa@gmail.com','2026-01-16 18:30:00','active'),
(665,1,369,'Altaf turkarashigalli','8618582589','atlaf@gmail.com','2026-01-17 18:30:00','active'),
(666,1,370,'Buddannavar turkarashigalli','9113071417','buddannavar@gmail.com','2026-01-17 18:30:00','active'),
(667,1,371,'Niyaz betageri','9901336313','betageri@gmail.com','2026-01-21 18:30:00','active'),
(668,1,372,'Sudarshan bekary','7349295268','sud@gmail.com','2026-01-21 18:30:00','active'),
(669,1,373,'Ganesh bekary','9731202650','ganeshbekry@gmail.com','2026-01-21 18:30:00','active'),
(670,1,374,'Pijolli k/s','9880958780','pijoli@gmail.com','2026-01-21 18:30:00','active'),
(671,1,375,'Bhimsi G/s','7065922372','bhimsi@gmail.com','2026-01-21 18:30:00','active'),
(672,1,376,'Channabasav itagicross','9876543222','channabasav@gmail.com','2026-01-23 18:30:00','active'),
(673,1,377,'Kahndu haibatti','9741836800','haibat@gmail.com','2026-01-23 18:30:00','active'),
(674,1,378,'Old slv bekary','9865986598','oldslv@gmail.com','2026-01-23 18:30:00','active'),
(675,1,379,'S V SANIKOPPA','8880119799','svs@gmail.com','2026-01-23 18:30:00','active'),
(676,1,380,'Umesh shettar','9876546988','unesh@gmail.com','2026-01-23 18:30:00','active'),
(677,1,381,'Shanmuk Malapur  garag','9886594979','mlp@gmail.com','2026-01-25 18:30:00','active'),
(678,1,382,'Ganiger Kirani stores','8147240745','gn@gmail.com','2026-01-26 18:30:00','active'),
(679,2,383,'B k Hotel','9876543210','bk@gmail.com','2026-02-09 18:30:00','active'),
(680,1,384,'Kariyemma devi k/s','9632862533','ks@gmail.com','2026-02-09 18:30:00','active'),
(681,2,385,'a p h','8975431284','aph@gmail.com','2026-02-09 18:30:00','active'),
(682,2,386,'r k hubli','8457299785','rkh@gmail.com','2026-02-09 18:30:00','active'),
(683,2,387,'mkh','8953674258','mkh@gmail.com','2026-02-09 18:30:00','active'),
(684,2,388,'madina','8974685429','madina@gmail.com','2026-02-09 18:30:00','active'),
(685,2,389,'KIM','8546974523','kim@gmail.com','2026-02-09 18:30:00','active'),
(686,2,390,'yaligar old hunasikatti','8965472586','yal@gmail.com','2026-02-09 18:30:00','active'),
(687,2,391,'ck hubli','9658742588','ckh@gmail.com','2026-02-09 18:30:00','active'),
(688,2,392,'uppin','9756488547','uppin@gmail.com','2026-02-09 18:30:00','active'),
(689,1,393,'Sannidi kirani','9164511245','sdt@gmail.com','2026-02-09 18:30:00','active'),
(690,1,394,'A s hunasikatti','6363577759','ash@gmail.com','2026-02-09 18:30:00','active'),
(691,1,395,'R R BEKARY','8073582098','aks@gmail.com','2026-02-09 18:30:00','active'),
(692,2,396,'chanbasav','8965478569','cb@gmail.com','2026-02-09 18:30:00','active'),
(693,2,397,'bcnagnur','5968475869','bcn@gmail.com','2026-02-09 18:30:00','active'),
(694,2,398,'konnurks','9586947586','konnur@gmail.com','2026-02-09 18:30:00','active'),
(695,2,399,'laxmi store','8965472358','lax@gmail.com','2026-02-09 18:30:00','active'),
(696,2,400,'attar ks','8754121425','atr@gmail.com','2026-02-09 18:30:00','active'),
(697,2,401,'Hiremath ks','9685697458','hi@gmail.com','2026-02-09 18:30:00','active'),
(698,2,402,'totagi ks','9768546988','tg@gmail.com','2026-02-09 18:30:00','active'),
(699,2,403,'vaganavar','8967548821','v1@gmail.com','2026-02-09 18:30:00','active'),
(700,2,404,'murgod ks','8965723869','mu@gmail.com','2026-02-09 18:30:00','active'),
(701,1,405,'Badavar bandu','9380195634','bmp@gmail.com','2026-02-09 18:30:00','active'),
(702,1,406,'Manjunath kirani stores','9535159707','manjuks@gmail.com','2026-02-09 18:30:00','active'),
(703,2,407,'mrunal stores','7619368425','mrunal@gmail.com','2026-02-09 18:30:00','active'),
(704,1,408,'Ganesh bekary bailur','9880496849','ganeshblr@gmail.com','2026-02-10 18:30:00','active');
/*!40000 ALTER TABLE `salesman_customers` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `salesman_daily_targets`
--

DROP TABLE IF EXISTS `salesman_daily_targets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesman_daily_targets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesman_id` int(11) NOT NULL,
  `target_date` date NOT NULL,
  `daily_target_amount` decimal(15,2) DEFAULT 0.00,
  `daily_target_orders` int(11) DEFAULT 0,
  `achieved_amount` decimal(15,2) DEFAULT 0.00,
  `achieved_orders` int(11) DEFAULT 0,
  `carried_forward_amount` decimal(15,2) DEFAULT 0.00,
  `carried_forward_orders` int(11) DEFAULT 0,
  `status` enum('pending','achieved','partial','carried_forward') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_salesman_date` (`salesman_id`,`target_date`),
  CONSTRAINT `salesman_daily_targets_ibfk_1` FOREIGN KEY (`salesman_id`) REFERENCES `salesman_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesman_daily_targets`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `salesman_daily_targets` DISABLE KEYS */;
/*!40000 ALTER TABLE `salesman_daily_targets` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `salesman_notifications`
--

DROP TABLE IF EXISTS `salesman_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesman_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesman_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `message` text DEFAULT NULL,
  `type` enum('info','warning','success','promotion') DEFAULT 'info',
  `is_read` enum('yes','no') DEFAULT 'no',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_salesman_read` (`salesman_id`,`is_read`),
  CONSTRAINT `salesman_notifications_ibfk_1` FOREIGN KEY (`salesman_id`) REFERENCES `salesman_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesman_notifications`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `salesman_notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `salesman_notifications` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `salesman_order_items`
--

DROP TABLE IF EXISTS `salesman_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesman_order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesman_order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `delivered_qty` int(11) DEFAULT 0,
  `item_status` varchar(50) DEFAULT 'pending',
  `return_reason` varchar(255) DEFAULT NULL,
  `unit_price` decimal(12,2) DEFAULT NULL,
  `total_price` decimal(12,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `idx_order_id` (`salesman_order_id`),
  CONSTRAINT `salesman_order_items_ibfk_1` FOREIGN KEY (`salesman_order_id`) REFERENCES `salesman_orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `salesman_order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesman_order_items`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `salesman_order_items` DISABLE KEYS */;
INSERT INTO `salesman_order_items` VALUES
(1,1,506,'7UP Soft Drink PET Bottle (750 ml)',1,0,'pending',NULL,36.80,36.80,'2026-07-06 13:53:28'),
(2,1,547,'20 20 30Rs',50,0,'pending',NULL,26.89,1344.50,'2026-07-06 13:53:28'),
(3,2,256,'Aashirvaad chakki fresh Atta 5 kg',1,0,'pending',NULL,250.00,250.00,'2026-07-06 13:54:06'),
(4,2,421,'BRITANIA BOURBON 10/-(20P)',7,0,'pending',NULL,177.50,1242.50,'2026-07-06 13:54:06'),
(5,2,436,'amar 1kg leaf',20,0,'pending',NULL,280.70,5614.00,'2026-07-06 13:54:06'),
(6,2,506,'7UP Soft Drink PET Bottle (750 ml)',1,0,'pending',NULL,36.80,36.80,'2026-07-06 13:54:06'),
(7,2,547,'20 20 30Rs',50,0,'pending',NULL,26.89,1344.50,'2026-07-06 13:54:06');
/*!40000 ALTER TABLE `salesman_order_items` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `salesman_orders`
--

DROP TABLE IF EXISTS `salesman_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesman_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesman_id` int(11) NOT NULL,
  `deliveryman_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `order_number` varchar(50) DEFAULT NULL,
  `total_amount` decimal(12,2) DEFAULT NULL,
  `delivery_charge` decimal(10,2) DEFAULT 0.00,
  `commission_amount` decimal(12,2) DEFAULT NULL,
  `commission_percentage` decimal(5,2) DEFAULT NULL,
  `payment_status` enum('pending','paid','partially_paid') DEFAULT 'pending',
  `order_status` enum('draft','confirmed','processing','completed','cancelled') DEFAULT 'draft',
  `order_date` datetime DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `beat_id` int(11) DEFAULT NULL,
  `visit_type` enum('planned','unplanned') DEFAULT 'planned',
  `visit_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `idx_salesman_id` (`salesman_id`),
  KEY `idx_order_date` (`order_date`),
  KEY `deliveryman_id` (`deliveryman_id`),
  CONSTRAINT `salesman_orders_ibfk_1` FOREIGN KEY (`salesman_id`) REFERENCES `salesman_accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `salesman_orders_ibfk_2` FOREIGN KEY (`deliveryman_id`) REFERENCES `deliverymen` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesman_orders`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `salesman_orders` DISABLE KEYS */;
INSERT INTO `salesman_orders` VALUES
(1,1,NULL,701,'Badavar bandu','9380195634',NULL,'SO-6A4BB3582FD43',1381.30,0.00,1.38,0.10,'','confirmed','2026-07-06 19:23:28','2026-07-06 13:53:28','2026-07-06 13:53:28',NULL,'planned',NULL),
(2,1,NULL,677,'Shanmuk Malapur garag','9886594979',NULL,'SO-6A4BB37E552DB',8487.80,0.00,8.49,0.10,'','confirmed','2026-07-06 19:24:06','2026-07-06 13:54:06','2026-07-06 13:54:06',NULL,'planned',NULL);
/*!40000 ALTER TABLE `salesman_orders` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `salesman_sales`
--

DROP TABLE IF EXISTS `salesman_sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesman_sales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesman_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `sale_amount` decimal(12,2) DEFAULT NULL,
  `commission_amount` decimal(12,2) DEFAULT NULL,
  `commission_percentage` decimal(5,2) DEFAULT NULL,
  `commission_status` enum('pending','paid','rejected') DEFAULT 'pending',
  `sale_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_sale` (`salesman_id`,`order_id`),
  KEY `order_id` (`order_id`),
  KEY `idx_sale_date` (`sale_date`),
  CONSTRAINT `salesman_sales_ibfk_1` FOREIGN KEY (`salesman_id`) REFERENCES `salesmen` (`id`) ON DELETE CASCADE,
  CONSTRAINT `salesman_sales_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesman_sales`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `salesman_sales` DISABLE KEYS */;
/*!40000 ALTER TABLE `salesman_sales` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `salesman_targets`
--

DROP TABLE IF EXISTS `salesman_targets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesman_targets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesman_id` int(11) NOT NULL,
  `target_amount` decimal(12,2) DEFAULT 0.00,
  `target_orders` int(11) DEFAULT 0,
  `target_month` int(11) NOT NULL,
  `target_year` int(11) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `salesman_id` (`salesman_id`,`target_month`,`target_year`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `salesman_targets_ibfk_1` FOREIGN KEY (`salesman_id`) REFERENCES `salesman_accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `salesman_targets_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `supervisor_accounts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesman_targets`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `salesman_targets` DISABLE KEYS */;
/*!40000 ALTER TABLE `salesman_targets` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `salesman_today_beat`
--

DROP TABLE IF EXISTS `salesman_today_beat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesman_today_beat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesman_id` int(11) NOT NULL,
  `beat_id` int(11) NOT NULL,
  `selected_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_salesman_date` (`salesman_id`,`selected_date`),
  KEY `beat_id` (`beat_id`),
  CONSTRAINT `salesman_today_beat_ibfk_1` FOREIGN KEY (`salesman_id`) REFERENCES `salesman_accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `salesman_today_beat_ibfk_2` FOREIGN KEY (`beat_id`) REFERENCES `salesman_beats` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesman_today_beat`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `salesman_today_beat` DISABLE KEYS */;
/*!40000 ALTER TABLE `salesman_today_beat` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `salesman_weekly_targets`
--

DROP TABLE IF EXISTS `salesman_weekly_targets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesman_weekly_targets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesman_id` int(11) NOT NULL,
  `week_start_date` date NOT NULL,
  `week_end_date` date NOT NULL,
  `weekly_target_amount` decimal(15,2) DEFAULT 0.00,
  `weekly_target_orders` int(11) DEFAULT 0,
  `achieved_amount` decimal(15,2) DEFAULT 0.00,
  `achieved_orders` int(11) DEFAULT 0,
  `year` int(11) NOT NULL,
  `week_number` int(11) NOT NULL,
  `status` enum('pending','achieved','partial') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_salesman_week` (`salesman_id`,`year`,`week_number`),
  CONSTRAINT `salesman_weekly_targets_ibfk_1` FOREIGN KEY (`salesman_id`) REFERENCES `salesman_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesman_weekly_targets`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `salesman_weekly_targets` DISABLE KEYS */;
/*!40000 ALTER TABLE `salesman_weekly_targets` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `salesmen`
--

DROP TABLE IF EXISTS `salesmen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesmen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `employee_id` varchar(50) DEFAULT NULL,
  `commission_percentage` decimal(5,2) DEFAULT 5.00,
  `status` enum('active','inactive','on_leave') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `employee_id` (`employee_id`),
  KEY `idx_status` (`status`),
  KEY `idx_email` (`email`),
  CONSTRAINT `salesmen_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesmen`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `salesmen` DISABLE KEYS */;
/*!40000 ALTER TABLE `salesmen` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `stock_movements`
--

DROP TABLE IF EXISTS `stock_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_movements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `movement_type` enum('PURCHASE','SALE','ADJUSTMENT','RETURN') NOT NULL,
  `ref_type` varchar(50) DEFAULT NULL,
  `ref_id` int(11) DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `stock_movements_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_movements`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `stock_movements` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_movements` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `supervisor_accounts`
--

DROP TABLE IF EXISTS `supervisor_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `supervisor_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `department` varchar(50) DEFAULT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `email_2` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supervisor_accounts`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `supervisor_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `supervisor_accounts` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `supervisor_assignments`
--

DROP TABLE IF EXISTS `supervisor_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `supervisor_assignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supervisor_id` int(11) NOT NULL,
  `salesman_id` int(11) NOT NULL,
  `assigned_date` timestamp NULL DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_assignment` (`supervisor_id`,`salesman_id`),
  KEY `supervisor_id` (`supervisor_id`),
  KEY `salesman_id` (`salesman_id`),
  CONSTRAINT `supervisor_assignments_ibfk_1` FOREIGN KEY (`supervisor_id`) REFERENCES `supervisor_accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `supervisor_assignments_ibfk_2` FOREIGN KEY (`salesman_id`) REFERENCES `salesman_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supervisor_assignments`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `supervisor_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `supervisor_assignments` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `supervisor_attendance`
--

DROP TABLE IF EXISTS `supervisor_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `supervisor_attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supervisor_id` int(11) NOT NULL,
  `attendance_date` date NOT NULL,
  `punch_in_time` datetime DEFAULT NULL,
  `punch_in_location` varchar(255) DEFAULT NULL,
  `punch_in_latitude` decimal(10,8) DEFAULT NULL,
  `punch_in_longitude` decimal(11,8) DEFAULT NULL,
  `punch_out_time` datetime DEFAULT NULL,
  `punch_out_location` varchar(255) DEFAULT NULL,
  `punch_out_latitude` decimal(10,8) DEFAULT NULL,
  `punch_out_longitude` decimal(11,8) DEFAULT NULL,
  `working_hours` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attendance` (`supervisor_id`,`attendance_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supervisor_attendance`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `supervisor_attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `supervisor_attendance` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `supervisor_notes`
--

DROP TABLE IF EXISTS `supervisor_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `supervisor_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salesman_id` int(11) NOT NULL,
  `supervisor_id` int(11) NOT NULL,
  `note_text` text NOT NULL,
  `note_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `salesman_id` (`salesman_id`,`note_date`),
  KEY `supervisor_id` (`supervisor_id`),
  CONSTRAINT `supervisor_notes_ibfk_1` FOREIGN KEY (`salesman_id`) REFERENCES `salesman_accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `supervisor_notes_ibfk_2` FOREIGN KEY (`supervisor_id`) REFERENCES `supervisor_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supervisor_notes`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `supervisor_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `supervisor_notes` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `gstin` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `units` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES
(1,'bag','2025-09-22 16:43:43'),
(2,'box','2025-09-22 16:43:43'),
(3,'bundle','2025-09-22 16:43:43'),
(4,'case','2025-09-22 16:43:43'),
(5,'dozen','2025-09-22 16:43:43'),
(6,'drum','2025-09-22 16:43:43'),
(7,'gms','2025-09-22 16:43:43'),
(8,'jar','2025-09-22 16:43:43'),
(9,'kgs','2025-09-22 16:43:43'),
(10,'line','2025-09-22 16:43:43'),
(11,'metre','2025-09-22 16:43:43'),
(12,'n.a','2025-09-22 16:43:43'),
(13,'pack','2025-09-22 16:43:43'),
(14,'pcs','2025-09-22 16:43:43'),
(15,'stripe','2025-09-22 16:43:43'),
(16,'tonne','2025-09-22 16:43:43'),
(17,'units','2025-09-22 16:43:43'),
(18,'Gms.','2025-09-22 16:49:21'),
(19,'Kgs.','2025-09-22 16:49:21'),
(20,'N.A.','2025-09-22 16:49:21'),
(21,'Pcs.','2025-09-22 16:49:21');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `user_details`
--

DROP TABLE IF EXISTS `user_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_details` (
  `user_id` int(11) NOT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `location_captured_at` timestamp NULL DEFAULT NULL,
  `additional_info` text DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_details`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `user_details` DISABLE KEYS */;
INSERT INTO `user_details` VALUES
(322,'kittur','kittur','','591115','India',15.59951700,74.78034100,'2026-05-10 14:47:39',NULL),
(332,'kitur','kitur',NULL,'',NULL,NULL,NULL,NULL,NULL),
(333,'bailur','bailur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(334,'Mk hubli','Mk hubli',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(335,'Mk hubbali','Mk hubballi',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(336,'Mk HUBBALI','Mk hubali',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(337,'Mk hubali','MK hubali',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(338,'MK hubali','Mk hubali',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(339,'MK hubali','Mk hubli',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(340,'Mutnal','Mutnal',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(341,'MK hubali','MK hubali',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(342,'MK hubali','MK hubali',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(343,'MK hubali','MK hubballi',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(344,'Mk hubballi','Mk hubballi',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(345,'Mutnal','Mutnal',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(346,'Mutnal','Mutnal',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(347,'MK hubballi','MK hubballi',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(348,'MK hubballi','MK hubballi',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(349,'MK hubballi','MK hubballi',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(350,'MK hubballi','MK hubballi',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(351,'MK hubballi','MK hubballi',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(352,'MK hubballi','MK hubballi',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(353,'MK hubali','MK hubballi',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(354,'Kittur','Kittur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(355,'Kittur','Kittur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(356,'Kittur','Kittur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(357,'Kittur','Kittur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(358,'Kittur','Kittur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(359,'Kittur','Kittur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(360,'KITTUR','KITTUR',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(361,'KITTUR','KITTUR',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(362,'Kittur','Kittur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(363,'Kittur','Kittur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(364,'Kittur','Kittur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(365,'Kittur','Kittur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(366,'Kittur','Kittur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(367,'Kittur','Kittur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(368,'Kittur','Kittur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(369,'Turkarashigalli','Turkarashigalli',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(370,'Turkarashigalli','Turkarashigalli',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(371,'Bailur','Bailur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(372,'Bailur','Bailur',NULL,'',NULL,NULL,NULL,NULL,NULL),
(373,'Bailur','Bailur',NULL,'',NULL,NULL,NULL,NULL,NULL),
(374,'Bailur','Bailur',NULL,'',NULL,NULL,NULL,NULL,NULL),
(375,'State Highway 56','Kittur','Karnataka','591115','India',15.59528520,74.77336230,'2026-01-22 07:36:20',NULL),
(376,'Itagicross','Itagicross',NULL,'',NULL,NULL,NULL,NULL,NULL),
(377,'Kadrolli','Kadrolli',NULL,'',NULL,NULL,NULL,NULL,NULL),
(378,'Kittur','Kittur',NULL,'',NULL,NULL,NULL,NULL,NULL),
(379,'Kittur','Kittur',NULL,'',NULL,NULL,NULL,NULL,NULL),
(380,'Kittur','Kittur',NULL,'',NULL,NULL,NULL,NULL,NULL),
(381,'Garaga','Garag',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(382,'Tegur','Tegur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(383,'turmari','turmari',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(384,'Tegur','Tegur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(385,'turmari','turmari',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(386,'turmari','turmari',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(387,'turmari','turmari',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(388,'turmari','turmari',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(389,'hunasikatti','hunasikatti',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(390,'hunasikatti','hunasikatti',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(391,'hunasikatti','hunasikatti',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(392,'hunasikatti','hunasikatti',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(393,'Tegur','Tegur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(394,'Tegur','Tegur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(395,'Tegur','Tegur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(396,'hunasikatti','hunasikatti',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(397,'hunasikatti','hunasikatti',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(398,'hunasikatti','hunasikatti',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(399,'hunasikatti','hunasikatti',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(400,'hunasikatti','hunasikatti',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(401,'hunasikatti','hunasikatti',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(402,'hunasikatti','hunasikatti',NULL,'59115',NULL,NULL,NULL,NULL,NULL),
(403,'hunasikatti','hunasikatti',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(404,'hunasikatti','hunasikatti',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(405,'Ramapur','Ramapur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(406,'Ramapur','Ramapur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(407,'hunsikatti','hunsikatti',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(408,'Bailur','Bailur',NULL,'591115',NULL,NULL,NULL,NULL,NULL),
(411,'Sumit Deogade, House no 1/503;  Celibration KH4, CHS, Vastu Vihar, Sector 17, Kharghar, Panvel','KHARGHAR, New mumbai','Maharashtra','410210','India',NULL,NULL,NULL,NULL),
(413,'House number 1579 \r\nHosamni koot , khanapur road , m.k.hubli','M.k.hubli','KARNATAKA','591118','India',0.00000000,0.00000000,'2026-06-05 03:19:49',NULL),
(414,'Flat no 3 near Deccan college','Gulbarga','Karnataka','585104','India',NULL,NULL,NULL,NULL),
(415,'Pannipoori shivanna building 2nd paravathipura hosakote','Hosakote','Karnataka','562114','India',13.07802760,77.79370700,'2026-07-11 12:27:19',NULL);
/*!40000 ALTER TABLE `user_details` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `role` enum('customer','salesman','admin') DEFAULT 'customer',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=416 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(322,'praveen','','$2y$10$THFpHFRm6EzhxlgbsTTZSuVuTQxWjMPOHeTl7l4jMo.4LXoWozH7i','7795966127','2026-01-10 13:40:35','2026-01-10 13:40:35','customer'),
(332,'manikant','mani@yopmail.com','$2y$10$Ujj.KIxC6Hcof6iT65kD3ulRsFAl7SuXW5Tp86mRhttOJfOwMcw3y','9080706050','2026-01-12 08:35:56','2026-01-12 08:35:56','customer'),
(333,'SANTOSH RAMJI','sant@gmail.com','$2y$10$4DMi11zpCuqmP0PwuKYawOU8w2FDRYbAEX2R.vUeLyk7duAOnSLpu','8867526165','2026-01-14 00:39:48','2026-01-14 00:39:48','customer'),
(334,'Prateek','prateek@gmail.com','$2y$10$WMp0dRowc4S8fop.JLG6Bu3acAehBDEdujBSo0VpCQ71bJRxNFnOy','7975727962','2026-01-17 07:05:38','2026-01-17 07:05:38','customer'),
(335,'MK STORES','mkstores@gmail.com','$2y$10$VeInr4ueihN4xCHHPGmH3OSU5scfB2EMZShlObX7pX85bT2UFNeTa','6361312649','2026-01-17 07:39:35','2026-01-17 07:39:35','customer'),
(336,'Mahalaxmi Sweets','mahalaxmi@gmail.com','$2y$10$KGk4lKJFrkXNcvrzBFOIbOxVjJ4d6D5RfLIubmsaJm1tbWoBythzG','8123798174','2026-01-17 07:40:45','2026-01-17 07:40:45','customer'),
(337,'Dairy Kirani stores','dairy@gmail.com','$2y$10$k88eml18dMDDCdjA04GJAelIjwiVGtD7NG.KwMOdR7UpDH1PgIroS','8088925874','2026-01-17 07:41:59','2026-01-17 07:41:59','customer'),
(338,'Basaveshwara Sweets','nagu@gmail.com','$2y$10$igaDG4IDOT8NcF6zqWcxcuHax7oiRrVTT1W4/jWcinppaeOSOSeES','8310287618','2026-01-17 07:42:43','2026-01-17 07:42:43','customer'),
(339,'Durga Pan Shop','vittal@gmail.com','$2y$10$nl8WDsuCEV6eGNTKMZlb4.Rpr07yhFE5Q2DhVAThbnRsTmiPZa8C6','9902904713','2026-01-17 07:43:44','2026-01-17 07:43:44','customer'),
(340,'Bhemmapa Yaradal','bhemmapa@gmail.com','$2y$10$gQr.xWJHw0leanH6EoGjd.zsLw9Yg6HNIiHS2PaJx.IQ7dq77UjQy','7204641508','2026-01-17 07:47:42','2026-01-17 07:47:42','customer'),
(341,'Rani Sweets','rani@gmail.com','$2y$10$oFJ7sqi0a6WUvpZJD6n9q.PZ4h5meC.8rqYt08keLUN1FMmhL1uOe','8217890900','2026-01-17 07:59:22','2026-01-17 07:59:22','customer'),
(342,'Noorani pan shop','noorani@gmail.com','$2y$10$UNbR5ZzOBTt0kgy296NWH.QvFbcY/7o/qsYB/AL.dOZvYWHWglNhC','7760819004','2026-01-17 08:00:35','2026-01-17 08:00:35','customer'),
(343,'Brothers Pan shop','bro@gmail.com','$2y$10$IOkCZZFELAMY0OrGLzyVAeON2a4NsiymwUK3mOEeow4DAg/1P.3DG','8861580496','2026-01-17 08:01:24','2026-01-17 08:01:24','customer'),
(344,'Halasagi 4','h@gmail.com','$2y$10$m4WzJeK3HKXHw3HciY0T6.GxYLBIANYegyuIloQXc33m89a59dZwi','7795331004','2026-01-17 08:02:47','2026-01-17 08:02:47','customer'),
(345,'Basavaraj hubbali','basavaraj@gmail.com','$2y$10$z66wPZw4DyHCUrN2jAu1YOrJliVay.n6JoWX/3sraSE42vyHh98q6','6361326698','2026-01-17 08:03:57','2026-01-17 08:03:57','customer'),
(346,'Parimala store','sb@gmail.com','$2y$10$GMkLhZr5p8kg6ydn2QwkfeVjYaDkW10qJ0V23eZ8MyvVR2uO2KCdC','7795806251','2026-01-17 08:04:55','2026-01-17 08:04:55','customer'),
(347,'Madivalppa Kammar','madivalappa@gmail.com','$2y$10$yRmgEkSQ1SAwuSrFECxY7e6z6oQIVx0fOpjaw9bknjLBkRFyv9FAi','9164235893','2026-01-17 08:18:29','2026-01-17 08:18:29','customer'),
(348,'Channappa Gokavi','gokavi@gmail.com','$2y$10$nLho6mljaFoBlJkN/piBeu43xSLlHHFbA0C5wB6ZAUMJ3QA8gEgjC','8151849044','2026-01-17 08:20:16','2026-01-17 08:20:16','customer'),
(349,'Isak store','isak@gmail.com','$2y$10$JurX6fM6WfxFtxAmjkKw0Oxz/5wKCBy2auwYqjSC3KCRwZXnUDzYu','7026170209','2026-01-17 08:21:49','2026-01-17 08:21:49','customer'),
(350,'Manik Angol','manik@gmail.com','$2y$10$GUIlsXSHQNuEwcqRGgPBmu.iaQ7QFkkmA1FW8hyxSOEC6pfHKmJCC','9535953423','2026-01-17 08:22:27','2026-01-17 08:22:27','customer'),
(351,'Vinod Yaligar mk','vinod@gmail.com','$2y$10$zI1zlY/DsE2vMpMS7Wzsq.L4QebV9fgVBPNYSshoRZBYaqfguSUrO','8217027778','2026-01-17 08:23:30','2026-01-17 08:23:30','customer'),
(352,'Nagappa Tubaki','nagappa@gmail.com','$2y$10$83sUco9EVm7yyx9fckLMFuNX6ZJ58lbza0uIDEQa6Q9278DFcDJ6i','9591650992','2026-01-17 08:24:33','2026-01-17 08:24:33','customer'),
(353,'Veerabhadra urus','v@gmail.com','$2y$10$HE5EkhqsFO180Otn4QZTqO.ynSFSo0AVCeS5bni2421V2TZ37rZYK','7760429620','2026-01-17 08:29:52','2026-01-17 08:29:52','customer'),
(354,'Savadi k/s','s@gmail.com','$2y$10$/tcg9s/TSXY2m.ShJP4rS.IkLOfPlSqi8DO98OeHm2N750jthf0ZK','6360282970','2026-01-17 12:44:56','2026-01-17 12:44:56','customer'),
(355,'Tegur kirani stores','t@gmail.com','$2y$10$0EZX6cbYBudP59JTBZf4xuJN.ApcWI3GucpkzPn0h3ykAH.kzIDWe','6361898202','2026-01-17 12:51:02','2026-01-17 12:51:02','customer'),
(356,'Betageri kirani','b@gmail.com','$2y$10$MN7IMsCJ9mr0oVlr2fQXou30PuPt5QiJQg5Q82MlmYm4NdaPwNQLG','8904260785','2026-01-17 12:58:18','2026-01-17 12:58:18','customer'),
(357,'B b RAMMANNAVAR','shashi@gmail.com','$2y$10$l1MKyd6nQCtS4cdUhQxYReyNsYw/2zLatUrrS/lwW5Bog8wxBBHqK','9845061126','2026-01-17 13:01:13','2026-01-17 13:01:13','customer'),
(358,'Laxmi stores ( YSL )','ysl@gmail.com','$2y$10$JTKRLNYKPk4MMYILRiWxEuhZAB68e48qvMb9.capAAEQzKbJ1RX8q','8660588994','2026-01-17 13:05:52','2026-01-17 13:05:52','customer'),
(359,'Old ganesh s/m','oldgg@gamil.com','$2y$10$dCCcHcyy.LPmhZ4BfRLOXeImow7Pc5wZVY.jhTQDL2ocdS0PkE3sG','5876431997','2026-01-17 13:09:23','2026-01-17 13:09:23','customer'),
(360,'Battaru','battaru@gmail.com','$2y$10$KWANHe2JNw8O0C5RP.jEzeFWhKMSmuDs/bcgUxnU0G1GDvZRBtTVS','9731570106','2026-01-17 13:10:15','2026-01-17 13:10:15','customer'),
(361,'Nagoji Kirani stores','nagoji@gmail.com','$2y$10$SiCbPM9UZJPlooEKg2grsu57L4iaNB1YS17EYWDh.1Z5hKFKZchsa','8050392898','2026-01-17 13:11:32','2026-01-17 13:11:32','customer'),
(362,'Shedegali','she@gmail.com','$2y$10$bedKfxqPoZzIMG5teayM6.mB3BQTWbEpmbw.YdHv4ly1ReRcMUKUm','8687287759','2026-01-17 13:11:33','2026-01-17 13:11:33','customer'),
(363,'Narendr','nar@gmail.com','$2y$10$3jGglKM5WNdNYP3.y/bT/OuC9tOrzWUqfr1eMP0hxOSBCsDEwmxuK','8952478536','2026-01-17 13:12:19','2026-01-17 13:12:19','customer'),
(364,'S b ramannavar','sbr@gmail.com','$2y$10$P6nXRvZkBmhpdnWJfNnuJuo2JAvSdy8iiLIYqAjRdhHKhBxMue6Mi','8569385697','2026-01-17 13:13:12','2026-01-17 13:13:12','customer'),
(365,'Hht','hht@gmail.com','$2y$10$kBKAHejapViP9lkc1UiVD.ynn4N61m/9FTa7f1JWN/o45NHW/ZlaC','7596842369','2026-01-17 13:13:57','2026-01-17 13:13:57','customer'),
(366,'Savadi 2','s2@gmail.com','$2y$10$k4xutAsdN8Cx/LVnm2Jn3u2PHSmZvBKucauFQfGkcJ.zQQxbsgPtC','8957423698','2026-01-17 13:14:46','2026-01-17 13:14:46','customer'),
(367,'Ramdev','ram@gmail.com','$2y$10$NQiHJPjLM8FmuUWplY0BHeWWfQKwclX308I6FgIaiL.ricZAAf2Ya','8965471239','2026-01-17 13:15:35','2026-01-17 13:15:35','customer'),
(368,'S s attimarad','ssa@gmail.com','$2y$10$/wqAlB4qR8FA16fdaOZ1K.lYbeM0etG.S4d/S9KyULEq4Ec82rFna','9611687920','2026-01-17 14:36:00','2026-01-17 14:36:00','customer'),
(369,'Altaf turkarashigalli','atlaf@gmail.com','$2y$10$algdfGMli1Wbw7DVv2TiGuZJLxoP9ppkTN8V8twtBadzHhmhsU88i','8618582589','2026-01-18 05:12:52','2026-01-18 05:12:52','customer'),
(370,'Buddannavar turkarashigalli','buddannavar@gmail.com','$2y$10$sU0ibi0k3i8kJ43oOzq6.e6LLZtUuchkmOXRwJyfV3fd2rHVTr7Yq','9113071417','2026-01-18 05:16:18','2026-01-18 05:16:18','customer'),
(371,'Niyaz betageri','betageri@gmail.com','$2y$10$4INg6kmw.adHCk/Z/5zY/OgoMmOtzh.NEe4gmGxurrjhVszs0pVaO','9901336313','2026-01-22 04:00:18','2026-01-22 04:00:18','customer'),
(372,'Sudarshan bekary','sud@gmail.com','$2y$10$OtxEiz7r3.jNJDNxyVGFDeFo4sGB0l3lyO2yMeEf.F.8UkAO0q1U2','7349295268','2026-01-22 05:02:16','2026-01-22 05:02:16','customer'),
(373,'Ganesh bekary','ganeshbekry@gmail.com','$2y$10$1nfvdiF/sbrX6s4OKr0B.erRpGBdUtN9XtMlmrk0J4XK3EJ0umfT6','9731202650','2026-01-22 05:22:55','2026-01-22 05:22:55','customer'),
(374,'Pijolli k/s','pijoli@gmail.com','$2y$10$suaf.gwsyT8pusi9HZ3pXOgADOBRuQUC3E/uT.zlXUjKMLfeoHsRm','9880958780','2026-01-22 06:03:31','2026-01-22 06:03:31','customer'),
(375,'Bhimsi G/s','bhimsi@gmail.com','$2y$10$FG2a.uzdPSxA1Km.EHW0NOA/cVarCUzc8eyZRTzvxgl0RlEPR62SS','7065922372','2026-01-22 07:23:34','2026-01-22 07:23:34','customer'),
(376,'Channabasav itagicross','channabasav@gmail.com','$2y$10$xhGgYx5z/EYOQedFR/OwhuiZVnFQr6TTeP13g.EwYYeB3fu6G.EB6','9876543222','2026-01-24 11:04:15','2026-01-24 11:04:15','customer'),
(377,'Kahndu haibatti','haibat@gmail.com','$2y$10$EbZ3s8kHYHZAe0c8pCcNreYdz5jKAPvsbCFZlYfY33/1UImhz0V/e','9741836800','2026-01-24 11:08:14','2026-01-24 11:08:14','customer'),
(378,'Old slv bekary','oldslv@gmail.com','$2y$10$CCF3Bs/LyMsmM6kvOXbNu.IcXLDeXBy2GwbH0MyhO2O5C4KO03zoS','9865986598','2026-01-24 11:50:22','2026-01-24 11:50:22','customer'),
(379,'S V SANIKOPPA','svs@gmail.com','$2y$10$J7Oc8u1cjJmpJPsTNr9mUOWwtv430X1qdi4HMCzIm0Jou5CevcGya','8880119799','2026-01-24 11:56:27','2026-01-24 11:56:27','customer'),
(380,'Umesh shettar','unesh@gmail.com','$2y$10$UUQ4KfJvLUE4BONbbG/8yOIhFRlz5F5Ody4LSFjMp5d/6nC7yMlkK','9876546988','2026-01-24 12:03:21','2026-01-24 12:03:21','customer'),
(381,'Shanmuk Malapur  garag','mlp@gmail.com','$2y$10$P/HQvPFB1iWwOsmIDIGl4ub.94uF5xiTs33lMoDgwi/L6O1z/RsO.','9886594979','2026-01-26 06:36:33','2026-01-26 06:36:33','customer'),
(382,'Ganiger Kirani stores','gn@gmail.com','$2y$10$.cEEUkfCDS.Tyf9SSsn42O1zg817vlwYVCf5rSxCyK8u/zU3R8CHK','8147240745','2026-01-27 05:22:59','2026-01-27 05:22:59','customer'),
(383,'B k Hotel','bk@gmail.com','$2y$10$Ts2PAqRNaWDr9h7JQt.05eM7k3MOYDWCTAyfb5EmUssdzEA/Fhrvq','9876543210','2026-02-10 04:49:44','2026-02-10 04:49:44','customer'),
(384,'Kariyemma devi k/s','ks@gmail.com','$2y$10$f9llFL39sN/78KFFzLVtBuhb6YFShhN8wUP5GK3FfzVUkk50HOdKK','9632862533','2026-02-10 05:31:20','2026-02-10 05:31:20','customer'),
(385,'a p h','aph@gmail.com','$2y$10$HEq/vHqlu63AT2BKyJv.OuMtw50W0.S7yfCzDk3P3Lpn/qLn4QtcW','8975431284','2026-02-10 06:08:09','2026-02-10 06:08:09','customer'),
(386,'r k hubli','rkh@gmail.com','$2y$10$P53NaD5iGOuGgtmAkAIst.vx1b1X8vSUSz3Si9SrTYxCThhLfnHn6','8457299785','2026-02-10 06:20:18','2026-02-10 06:20:18','customer'),
(387,'mkh','mkh@gmail.com','$2y$10$g9xDaUJBQiStom0IvPLUcehvRJIGksiSuv1bsxYoRPBvEbBuuMyRq','8953674258','2026-02-10 06:25:13','2026-02-10 06:25:13','customer'),
(388,'madina','madina@gmail.com','$2y$10$/2nATeE8m9NZtGizAgWXNOC4J0iEelRhUrCs9VxN50uMWkF3fn69y','8974685429','2026-02-10 06:49:46','2026-02-10 06:49:46','customer'),
(389,'KIM','kim@gmail.com','$2y$10$Ws3y.5YIuG1UAX5tTAMUvOpE2l0cbDFjHp57s7UfIzAOjNMo9qkMu','8546974523','2026-02-10 07:02:04','2026-02-10 07:02:04','customer'),
(390,'yaligar old hunasikatti','yal@gmail.com','$2y$10$236dzvbwbKpJ7UmYLkE0tOTz6Nhgza08uphQO3BItS54XHjXlCWP.','8965472586','2026-02-10 07:07:18','2026-02-10 07:07:18','customer'),
(391,'ck hubli','ckh@gmail.com','$2y$10$KBg/8mA5vAI0GzALA4qnjeOI3OTgKJAAVR74QTSFgHzTr88FPJpcu','9658742588','2026-02-10 07:10:18','2026-02-10 07:10:18','customer'),
(392,'uppin','uppin@gmail.com','$2y$10$b2qoEBvOJ14zTlB1ABZI5ejqaOpYt4LCJZqGcXhxyL1Nxp.8JB6sC','9756488547','2026-02-10 07:18:57','2026-02-10 07:18:57','customer'),
(393,'Sannidi kirani','sdt@gmail.com','$2y$10$ebKJR74/VE9IdqOAiIr9tuc337rCa9HiQDPlmM4I7N0t43.odKfF.','9164511245','2026-02-10 07:29:21','2026-02-10 07:29:21','customer'),
(394,'A s hunasikatti','ash@gmail.com','$2y$10$QuoLDanuQzu9HzB3MIY5w.Rdd/9A1XnQcjFLiHmoDTp22Jxrt5xAW','6363577759','2026-02-10 07:33:55','2026-02-10 07:33:55','customer'),
(395,'R R BEKARY','aks@gmail.com','$2y$10$4.iWS3mvtJL9iZElO9C5E.jlMYuFTiU2rDpg.Vikb0yV7beHnC43e','8073582098','2026-02-10 07:37:06','2026-02-10 07:37:06','customer'),
(396,'chanbasav','cb@gmail.com','$2y$10$yWtNf3BvFOVSyXRsr3eLwe7u58dbgiX01lbTvhflw4fP.dyQ13NCy','8965478569','2026-02-10 07:43:43','2026-02-10 07:43:43','customer'),
(397,'bcnagnur','bcn@gmail.com','$2y$10$tJATGn56rURmEl64ZlHkYOS0KRVvzVyqlhDSU2hXkrGwunBXrii/W','5968475869','2026-02-10 08:01:19','2026-02-10 08:01:19','customer'),
(398,'konnurks','konnur@gmail.com','$2y$10$YWf4QDvB9pGjUg0W.P6Umu9ySWNNeQLjlnOhJT.RJv6og9Q33pD.m','9586947586','2026-02-10 08:03:27','2026-02-10 08:03:27','customer'),
(399,'laxmi store','lax@gmail.com','$2y$10$ZZgiF7cZj7rmpnCUWcU5H.iEs3MVpfYCOVSRgY5z3tmgC3fbilMky','8965472358','2026-02-10 08:16:38','2026-02-10 08:16:38','customer'),
(400,'attar ks','atr@gmail.com','$2y$10$y7.UTw22QGXr7GgPTfpDcutjaZnG4zCPmxp51QISSl/mWNbeAYdkq','8754121425','2026-02-10 08:22:25','2026-02-10 08:22:25','customer'),
(401,'Hiremath ks','hi@gmail.com','$2y$10$AlFdJeEvrKQLQGtZj0R5weeu5Ck90IXOIgPFDqRVHi0sVMs78x2ca','9685697458','2026-02-10 08:30:50','2026-02-10 08:30:50','customer'),
(402,'totagi ks','tg@gmail.com','$2y$10$69An.jPewIVy8.n30bDMjuN0plYS8he9gM8KlsajO19vi6.2u5O9q','9768546988','2026-02-10 08:37:44','2026-02-10 08:37:44','customer'),
(403,'vaganavar','v1@gmail.com','$2y$10$NTkeHQphs5PikLb0sQ8lF.BEM2iUUbledJfwx/rJcbgj/q960v/Sm','8967548821','2026-02-10 08:47:08','2026-02-10 08:47:08','customer'),
(404,'murgod ks','mu@gmail.com','$2y$10$WX1dbyKdvgmzjmfUFC4cu.ciJVXScsZb4VDgRc64RbIZ1ce7dTi0S','8965723869','2026-02-10 09:08:24','2026-02-10 09:08:24','customer'),
(405,'Badavar bandu','bmp@gmail.com','$2y$10$VyeVQT7rzvRGzWi2LOwRpeAvuj3fCuPs84pu3.Cme./nfbSmjdvYC','9380195634','2026-02-10 10:32:05','2026-02-10 10:32:05','customer'),
(406,'Manjunath kirani stores','manjuks@gmail.com','$2y$10$z0fSeG2tF11cKobkmNo48./GaCA5Z4m2WkvF8Tzw8Af6dsK0gXblG','9535159707','2026-02-10 11:04:56','2026-02-10 11:04:56','customer'),
(407,'mrunal stores','mrunal@gmail.com','$2y$10$6/pRzJOuo0xVxGrVkEyn/OoMuaBf.wIecEuNZ20O9pptJPZCaH59G','7619368425','2026-02-10 12:38:25','2026-02-10 12:38:25','customer'),
(408,'Ganesh bekary bailur','ganeshblr@gmail.com','$2y$10$coYpzUCOuaQfUC7ugQsdueYMEsLj0c2b3OxfF2gEcGhXM/47VoXpi','9880496849','2026-02-11 05:33:08','2026-02-11 05:33:08','customer'),
(409,'cino','moontontlol321@gmail.com','$2y$10$x1gTMuhrbRJMdYyZazXVQ.eJ0/AxsiFidIPEkBsP3esDRXlq1ZG0.','8989898989','2026-05-19 21:27:27','2026-05-19 21:27:27','customer'),
(410,'Ganesh pujari','ganeshpujari760@gmail.com','$2y$10$VofQBC7a.6SMZ558/CHuI.nV1yTubqVKcLUoyhSgqZOx8jr.jIrtK','9844067982','2026-05-23 03:46:01','2026-05-23 03:46:01','customer'),
(411,'Sumit Deogade','sumitdeogade68@gmail.com','$2y$10$MJWeDcnqkNgkRuH22/el6.ciXtBHeHQopt9XAdjylUvScNCm5QgiC','7415423343','2026-06-02 10:41:17','2026-06-02 10:41:17','customer'),
(412,'Dummy','d@gmail.com','$2y$10$ZFZLBw7nHpuLZPjdyV/TrugdPUUOdEWDPofYzyxT6dqsy5SReKPdu','9876543211','2026-06-03 08:59:30','2026-06-03 08:59:30','customer'),
(413,'Sachin J patil','sachinkomal05@gmail.com','$2y$10$zFEq0NPZp12ffmIyKI7SC.4xfI/yD7bc2OfpuPSDaQ0TImZupAszy','9632713515','2026-06-05 03:18:30','2026-06-05 03:18:30','customer'),
(414,'Md javeed','mdmeeraj073@gmail.com','$2y$10$yp3bEnZs8JDE4jXtejlnh.iiSEdo4RQvxAGUB7LN3AXEaMdlpNaWW','9611377846','2026-06-06 17:06:19','2026-06-06 17:06:19','customer'),
(415,'SUNILKUMAR','sunilsk06972@gmail.com','$2y$10$elU.Ca2ndnXUxnGH8feL8.VkwsXfoXHWh3OFscWRJEVoUCqBVnLhC','9008206665','2026-07-11 12:25:06','2026-07-11 12:25:06','customer');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping routines for database 'u661310939_byit'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-08-06 17:03:44
