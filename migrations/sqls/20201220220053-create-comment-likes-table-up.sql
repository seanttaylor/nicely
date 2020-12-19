
CREATE TABLE IF NOT EXISTS `comment_likes`
(
 `comment_id` varchar(64) NOT NULL ,
 `user_id`    varchar(64) NOT NULL ,

KEY `fkIdx_222` (`comment_id`),
CONSTRAINT `FK_222` FOREIGN KEY `fkIdx_222` (`comment_id`) REFERENCES `comments` (`id`),
KEY `fkIdx_225` (`user_id`),
CONSTRAINT `FK_225` FOREIGN KEY `fkIdx_225` (`user_id`) REFERENCES `users` (`id`),
UNIQUE INDEX(`comment_id`, `user_id`)
);