
CREATE TABLE IF NOT EXISTS `user_followers`
(
 `user_id`     varchar(64) NOT NULL ,
 `follower_id` varchar(64) NOT NULL ,

KEY `fkIdx_181` (`user_id`),
CONSTRAINT `FK_181` FOREIGN KEY `fkIdx_181` (`user_id`) REFERENCES `users` (`id`),
UNIQUE INDEX(`user_id`, `follower_id`)
);