
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