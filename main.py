#!/usr/bin/env python3


from app_config.app import app_config;
from app_config.startup import startup_config;
#Services
from services.comment import CommentService;
from services.post import PostService, PostValidator;
from services.user import UserService, UserValidator;
#Repositories
from lib.repository.post.my_sql import PostMySQLRepository;
from lib.repository.comment.my_sql import CommentMySQLRepository;
from lib.repository.user.my_sql import UserMySQLRepository;


def main():
  print(startup_config["launch_banner"]);
  post_validator = PostValidator(app_config["posts"]);
  user_validator = UserValidator(app_config["users"]);


  post_mysql_repo = PostMySQLRepository(app_config["posts"]["fields"]);
  comment_mysql_repo = CommentMySQLRepository(app_config["comments"]["fields"]);
  user_mysql_repo = UserMySQLRepository(app_config["users"]["fields"]);

  post_service = PostService(post_mysql_repo, post_validator);
  comment_service = CommentService(comment_mysql_repo);
  user_service = UserService(user_mysql_repo, user_validator);

  bbanner_user= user_service.create_user(
    handle="@hulk",
    motto="Hulk smash!",
    email_address="bbanner@avengers.io",
    first_name="Bruce",
    last_name="Banner",
    phone_number="12125552727"
  );

  banner_doc_id = bbanner_user.save();

  thor_comment = comment_service.create_comment(
    body="Still not worthy. LOL",
    user_id="b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09",
    author="@thor");

  thor_comment.incr_like_count();
  thor_comment.edit("You people are so petty. And tiny.");




if __name__ == "__main__": main();