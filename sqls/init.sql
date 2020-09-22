CREATE DATABASE IF NOT EXISTS asiago;

USE asiago;

CREATE TABLE IF NOT EXISTS `posts` (
  `id` varchar(64) NOT NULL,
  `body` varchar(150) NOT NULL,
  `author` varchar(64) NOT NULL,
  `created_date` mediumtext NOT NULL,
  `last_modified` mediumtext NULL,
  `comments` integer NULL,
  `likes` integer NULL,

  PRIMARY KEY(`id`)
);
