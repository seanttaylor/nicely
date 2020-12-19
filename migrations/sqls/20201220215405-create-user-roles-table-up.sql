
CREATE TABLE IF NOT EXISTS `user_roles`
(
 `user_id` varchar(64) NOT NULL UNIQUE,
 `role`    mediumtext NOT NULL ,

KEY `fkIdx_197` (`user_id`),
CONSTRAINT `FK_197` FOREIGN KEY `fkIdx_197` (`user_id`) REFERENCES `users` (`id`)
);
