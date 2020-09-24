CREATE DATABASE IF NOT EXISTS asiago;

USE asiago;

CREATE TABLE IF NOT EXISTS `posts`
(
 `id`            varchar(64) NOT NULL ,
 `body`          varchar(150) NOT NULL ,
 `author`        varchar(64) NOT NULL ,
 `created_date`  mediumtext NOT NULL ,
 `last_modified` mediumtext NULL ,
 `comment_count` integer DEFAULT 0 ,
 `like_count`    integer DEFAULT 0 ,

PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `comments`
(
 `id`            varchar(64) NOT NULL ,
 `post_id`       varchar(64) NOT NULL ,
 `body`          varchar(150) NOT NULL ,
 `author`        varchar(64) NOT NULL ,
 `like_count`    integer DEFAULT 0 ,
 `created_date`  mediumtext NOT NULL ,
 `last_modified` mediumtext NULL ,

PRIMARY KEY (`id`),
KEY `fkIdx_152` (`post_id`),
CONSTRAINT `FK_152` FOREIGN KEY `fkIdx_152` (`post_id`) REFERENCES `posts` (`id`)
);
