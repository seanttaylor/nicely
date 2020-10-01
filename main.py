#!/usr/bin/env python3


from app_config.app import app_config;
from app_config.startup import startup_config;
#Services
from services.post import PostService, PostValidator;
from services.feed import FeedService;
#Repositories
from lib.repository.post.my_sql import PostMySQLRepository;



def main():
  print(startup_config["launch_banner"]);
  post_validator = PostValidator(app_config["posts"]);
  post_mysql_repo = PostMySQLRepository(app_config["posts"]["fields"]);
  post_service = PostService(post_mysql_repo, post_validator);
  feed_service = FeedService(post_service);

  print(next(feed_service.get_posts(offset=5)));

if __name__ == "__main__": main();