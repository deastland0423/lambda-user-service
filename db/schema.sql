CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email_address` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_address` (`email_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  KEY `fk_user_roles_user_id` (`user_id`),
  KEY `fk_user_roles_role_id` (`role_id`),
  CONSTRAINT `fk_user_roles_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  CONSTRAINT `fk_user_roles_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Links each user to the various roles they have in the application. A user can have many roles.';

CREATE TABLE `locations` (
  `location_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`location_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `game_sessions` (
    `game_session_id` int NOT NULL AUTO_INCREMENT,
    `creator_dm_user_id` int NOT NULL,
    `start_timestamp` TIMESTAMP NOT NULL,
    `duration_min` int NOT NULL,
    PRIMARY KEY (`game_session_id`),
    KEY `fk_game_sessions_creator_dm_user_id` (`creator_dm_user_id`),
    CONSTRAINT `fk_game_sessions_creator_dm_user_id` FOREIGN KEY (`creator_dm_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
