
CREATE TABLE IF NOT EXISTS `comments`
(
 `id`            varchar(64) NOT NULL ,
 `post_id`       varchar(64) NOT NULL ,
 `user_id`       varchar(64) NOT NULL ,
 `body`          varchar(150) NOT NULL ,
 `created_date`  mediumtext NOT NULL ,
 `last_modified` mediumtext NULL ,
 `like_count`    integer NULL DEFAULT 0,

PRIMARY KEY (`id`),
KEY `fkIdx_152` (`post_id`),
CONSTRAINT `FK_152` FOREIGN KEY `fkIdx_152` (`post_id`) REFERENCES `posts` (`id`)
);