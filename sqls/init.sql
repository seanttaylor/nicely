CREATE DATABASE IF NOT EXISTS asiago;

USE asiago;

CREATE USER 'nicely'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON *.* TO 'nicely'@'localhost' WITH GRANT OPTION;
CREATE USER 'nicely'@'%' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON *.* TO 'nicely'@'%' WITH GRANT OPTION;

CREATE TABLE IF NOT EXISTS `users`
(
 `id`             varchar(64) NOT NULL ,
 `handle`         varchar(64) NOT NULL UNIQUE,
 `email_address`  varchar(128) NOT NULL UNIQUE,
 `motto`          varchar(128) NULL ,
 `phone_number`   varchar(32) NOT NULL UNIQUE,
 `is_verified`    boolean NOT NULL DEFAULT 0 ,
 `first_name`     varchar(32) NOT NULL ,
 `last_name`      varchar(32) NOT NULL ,
 `follower_count` integer NOT NULL DEFAULT 0,
 `avatar_URL`     mediumtext NULL ,
 `last_modified`  mediumtext NULL ,
 `created_date`   mediumtext NOT NULL ,

PRIMARY KEY (`id`)
);


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

CREATE TABLE IF NOT EXISTS `status`
(
 `id`           varchar(64) NOT NULL ,
 `created_date` mediumtext  NOT NULL 
);


CREATE TABLE IF NOT EXISTS `user_followers`
(
 `user_id`     varchar(64) NOT NULL ,
 `follower_id` varchar(64) NOT NULL ,

KEY `fkIdx_181` (`user_id`),
CONSTRAINT `FK_181` FOREIGN KEY `fkIdx_181` (`user_id`) REFERENCES `users` (`id`),
UNIQUE INDEX(`user_id`, `follower_id`)
);

CREATE TABLE IF NOT EXISTS `user_credentials`
(
 `user_email_address` varchar(128) NOT NULL UNIQUE,
 `user_password`           mediumtext NOT NULL 
);

CREATE TABLE IF NOT EXISTS `user_roles`
(
 `user_id` varchar(64) NOT NULL UNIQUE,
 `role`    mediumtext NOT NULL ,

KEY `fkIdx_197` (`user_id`),
CONSTRAINT `FK_197` FOREIGN KEY `fkIdx_197` (`user_id`) REFERENCES `users` (`id`)
);

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



INSERT INTO users (id, handle, email_address, phone_number, first_name, last_name, created_date) VALUES("e98417a8-d912-44e0-8d37-abe712ca840f", "@tstark", "tstark@avengers.io", "12125552424", "Tony", "Stark", "2020-09-26T23:08:27.645Z");

INSERT INTO users (id, handle, email_address, phone_number, first_name, last_name, created_date) VALUES("b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09", "@thor", "thor@avengers.io", "12125552020", "Thor", "Odinson", "2020-09-26T23:08:27.645Z");

INSERT INTO posts (id, user_id, body, created_date, is_published) VALUES("d343fd4b-654a-40ae-bb54-05dd1f5b4791", "e98417a8-d912-44e0-8d37-abe712ca840f", "Playboy. Billionaire. Genius.", "2020-09-26T23:08:27.645Z");

INSERT INTO posts (id, user_id, body, created_date, is_published) VALUES("f4c5c046-5cbb-4619-8358-639d2c0e898b", "e98417a8-d912-44e0-8d37-abe712ca840f", "Is it better to be feared or respected? I say: it is too much to ask for both?", "2020-09-26T23:08:27.645Z", 1);

INSERT INTO comments (id, post_id, user_id, body, created_date) VALUES("a3a8b0dc-abb8-47d9-9545-00e6c24cc12d", "d343fd4b-654a-40ae-bb54-05dd1f5b4791", "@thor", "Yawn.", "2020-09-26T23:08:27.645Z");

INSERT INTO user_followers (user_id, follower_id) VALUES("e98417a8-d912-44e0-8d37-abe712ca840f", "b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09");

UPDATE users SET follower_count = follower_count + 1 WHERE id = "e98417a8-d912-44e0-8d37-abe712ca840f";

INSERT INTO user_roles (user_id, role) VALUES("e98417a8-d912-44e0-8d37-abe712ca840f", "admin");

INSERT INTO user_credentials (user_email_address, user_password) VALUES("tstark@avengers.io", "$2y$10$Zgd2BY7KhfZ0p2fpzB/fGeJIPRIOd4UKmZuQC.0f4kjIXjFi1VsSu");

INSERT INTO user_credentials (user_email_address, user_password) VALUES("thor@avengers.io", "$2y$10$JGt.9x9ZOOZ7//S5fSRo7uKOck96G3Nz18aZ7oZ9pGqD8z7pPbR7O");

INSERT INTO post_likes (post_id, user_id) VALUES("f4c5c046-5cbb-4619-8358-639d2c0e898b", "b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09");

