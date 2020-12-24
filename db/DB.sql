DROP DATABASE IF EXISTS share_videos;
CREATE DATABASE share_videos;

drop user if exists ruben;
FLUSH PRIVILEGES;

CREATE USER 'ruben'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
GRANT ALL PRIVILEGES ON share_videos.* TO 'ruben'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

USE share_videos;

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `password` varchar(255),
  `email` varchar(255) UNIQUE
);

CREATE TABLE `playlists` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `title` varchar(255)
);

CREATE TABLE `videos` (
  `id` int,
  `title` varchar(255),
  `url` varchar(255)
);

ALTER TABLE `playlists` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `videos` ADD FOREIGN KEY (`id`) REFERENCES `playlists` (`id`);
