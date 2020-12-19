
CREATE TABLE IF NOT EXISTS `user_credentials`
(
 `user_email_address` varchar(128) NOT NULL UNIQUE,
 `user_password`      mediumtext NOT NULL 
);