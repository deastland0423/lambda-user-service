-- --------------------------------------------------------
-- Host:                         campaign-test-3.cjojv7gsvzpz.us-east-1.rds.amazonaws.com
-- Server version:               8.0.20 - Source distribution
-- Server OS:                    Linux
-- HeidiSQL Version:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table oseitu.adventures
CREATE TABLE IF NOT EXISTS `adventures` (
  `adventure_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `session_id` int NOT NULL DEFAULT '0',
  `location_id` int NOT NULL DEFAULT '0',
  `character_count` int NOT NULL DEFAULT '0' COMMENT 'Number of characters currently signed up',
  PRIMARY KEY (`adventure_id`),
  KEY `adventures_session_id_sessions_session_id` (`session_id`),
  KEY `adventures_location_id_locations_location_id` (`location_id`),
  CONSTRAINT `adventures_location_id_locations_location_id` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`),
  CONSTRAINT `adventures_session_id_sessions_session_id` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='An adventure is a reservation of a session at a given location, with a number of characters.';

-- Data exporting was unselected.

-- Dumping structure for table oseitu.adventure_participants
CREATE TABLE IF NOT EXISTS `adventure_participants` (
  `adventure_id` int NOT NULL,
  `character_id` int NOT NULL,
  KEY `adventure_participants_adventure_id_adventures` (`adventure_id`),
  KEY `adventure_participants_character_id_characters` (`character_id`),
  CONSTRAINT `adventure_participants_adventure_id_adventures` FOREIGN KEY (`adventure_id`) REFERENCES `adventures` (`adventure_id`),
  CONSTRAINT `adventure_participants_character_id_characters` FOREIGN KEY (`character_id`) REFERENCES `characters` (`character_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='List the characters that are participating in each adventure';

-- Data exporting was unselected.

-- Dumping structure for table oseitu.characters
CREATE TABLE IF NOT EXISTS `characters` (
  `character_id` int NOT NULL AUTO_INCREMENT,
  `owner_user_id` int NOT NULL,
  `name` varchar(250) NOT NULL DEFAULT '',
  `class` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `level` int NOT NULL DEFAULT '1',
  `gold` decimal(20,2) DEFAULT NULL,
  `home_base_settlement_id` int DEFAULT '1',
  PRIMARY KEY (`character_id`),
  KEY `characters_owner_user_id_users` (`owner_user_id`),
  KEY `characters_home_base_settlement_id_settlements` (`home_base_settlement_id`),
  CONSTRAINT `characters_home_base_settlement_id_settlements` FOREIGN KEY (`home_base_settlement_id`) REFERENCES `settlements` (`settlement_id`),
  CONSTRAINT `characters_owner_user_id_users` FOREIGN KEY (`owner_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='List of all characters for Adventure Time';

-- Data exporting was unselected.

CREATE TABLE IF NOT EXISTS `hexes` (
  `hex_id` int NOT NULL AUTO_INCREMENT,
  `map_id` int NOT NULL DEFAULT '1',
  `name` varchar(250) NOT NULL,
  `coords` varchar(10) NOT NULL COMMENT 'x,y coordiantes of the hex on the world map',
  `is_explored` tinyint NOT NULL DEFAULT '0',
  `is_polite` tinyint NOT NULL DEFAULT '0',
  `terrain_type` enum('LIGHT_FOREST','DENSE_FOREST','GRASSLAND','MOUNTAIN','SWAMP') NOT NULL,
  UNIQUE KEY `map_id_coords` (`map_id`, `coords`),
  PRIMARY KEY (`hex_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Defines a hex on the main map.';

-- Dumping structure for table oseitu.locations
CREATE TABLE IF NOT EXISTS `locations` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL DEFAULT '',
  `map_id` int NOT NULL DEFAULT '1',
  `hex_id` int NOT NULL,
  `sub_hex` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '0' COMMENT 'Small hex within hex',
  CONSTRAINT `hexes_hex_id_hexes` FOREIGN KEY (`hex_id`) REFERENCES `hexes` (`hex_id`),
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Any location within a hex on the campaign map. Typically a dungeon.';

-- Data exporting was unselected.

CREATE TABLE IF NOT EXISTS `login_sessions` (
  `login_session_uuid` CHAR(36) NOT NULL,
  `user_id` int NOT NULL,
  `expires_at` int NOT NULL,
  PRIMARY KEY (`login_session_uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Tracks active login sessions for web app users.';


-- Dumping structure for table oseitu.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` int NOT NULL AUTO_INCREMENT,
  `host_user_id` int NOT NULL,
  `start_time` timestamp NOT NULL,
  `duration` int NOT NULL DEFAULT '180' COMMENT 'Number of minutes for the session.',
  `max_characters` int NOT NULL DEFAULT '6',
  `reserved` tinyint NOT NULL DEFAULT '0' COMMENT '1 if reserved, otherwise 0',
  PRIMARY KEY (`session_id`),
  KEY `sessions_host_user_id_user_id` (`host_user_id`),
  CONSTRAINT `sessions_host_user_id_user_id` FOREIGN KEY (`host_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Open time slots being offered by DMs for players to sign up.';

-- Data exporting was unselected.

-- Dumping structure for table oseitu.settlements
CREATE TABLE IF NOT EXISTS `settlements` (
  `settlement_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  PRIMARY KEY (`settlement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table oseitu.users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email_address` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `username` varchar(250) NOT NULL,
  `prefs` JSON,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_address` (`email_address`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table oseitu.user_roles
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` int DEFAULT NULL,
  `role` enum('PLAYER','DM','ADMIN') DEFAULT NULL,
  KEY `user_roles_user_id` (`user_id`),
  CONSTRAINT `user_roles_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Lists all of the roles for each user';

CREATE TABLE IF NOT EXISTS `character_possessions` (
	`possession_id` INT(10) NOT NULL AUTO_INCREMENT,
	`character_id` INT(10) NULL DEFAULT NULL,
	`name` VARCHAR(512) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`player_description` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`admin_description` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`value` DECIMAL(20,4) NULL DEFAULT '0.0000',
	`in_inventory` TINYINT(3) NULL DEFAULT '0',
	PRIMARY KEY (`possession_id`) USING BTREE,
	INDEX `character_possession_fk` (`character_id`) USING BTREE,
	CONSTRAINT `character_possession_fk` FOREIGN KEY (`character_id`) REFERENCES `oseitu`.`characters` (`character_id`) ON UPDATE NO ACTION ON DELETE NO ACTION
) COLLATE=utf8mb4_0900_ai_ci ENGINE=InnoDB AUTO_INCREMENT=6 CHARSET=utf8mb4;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
