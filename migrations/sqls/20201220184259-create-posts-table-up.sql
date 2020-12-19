
CREATE TABLE IF NOT EXISTS `posts`
(
 `id`              varchar(64) NOT NULL ,
 `user_id`         varchar(64) NOT NULL ,
 `sequence_no`     integer NOT NULL AUTO_INCREMENT,
 `body`            varchar(150) NOT NULL ,
 `created_date`    mediumtext NOT NULL ,
 `last_modified`   mediumtext NULL ,
 `comment_count`   integer NULL DEFAULT 0 ,
 `like_count`      integer NULL DEFAULT 0,
 `sentiment_score` varchar(8) NULL,
 `magnitude`       integer NULL,
 `is_archived`     boolean NOT NULL DEFAULT FALSE,
 `is_published`    boolean NOT NULL DEFAULT FALSE,
 `publish_date`    mediumtext NULL,

PRIMARY KEY (`id`),
KEY `fkIdx_169` (`user_id`),
KEY (`sequence_no`),
CONSTRAINT `FK_169` FOREIGN KEY `fkIdx_169` (`user_id`) REFERENCES `users` (`id`)
);