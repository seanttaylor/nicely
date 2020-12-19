
CREATE TABLE IF NOT EXISTS `post_likes`
(
 `post_id` varchar(64) NOT NULL ,
 `user_id` varchar(64) NOT NULL ,

KEY `fkIdx_215` (`post_id`),
CONSTRAINT `FK_215` FOREIGN KEY `fkIdx_215` (`post_id`) REFERENCES `posts` (`id`),
KEY `fkIdx_218` (`user_id`),
CONSTRAINT `FK_218` FOREIGN KEY `fkIdx_218` (`user_id`) REFERENCES `users` (`id`),
  UNIQUE INDEX(`post_id`, `user_id`)
);