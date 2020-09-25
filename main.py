#!/usr/bin/env python3

#Services
from config.app import app_config
from services.comment import CommentService
from services.post import PostService, PostValidator
#Repositories
from lib.repository.post.my_sql import PostMySQLRepository
from lib.repository.comment.my_sql import CommentMySQLRepository
#Interfaces
from interfaces.post_repository import IPostRepository
from interfaces.comment_repository import ICommentRepository

def main():
  print(app_config["main"]["launch_banner"]);
  post_validator = PostValidator(app_config["posts"]);

  post_mysql_repo = IPostRepository(PostMySQLRepository(app_config["posts"]["fields"]));
  comment_mysql_repo = ICommentRepository(CommentMySQLRepository(app_config["comments"]["fields"]));

  post_service = PostService(post_mysql_repo, post_validator);
  comment_service = CommentService(comment_mysql_repo);

  tstark_post = post_service.create_post(body="Playboy. Billionaire. Genius",
  author="@tstark")
  bbanner_post = post_service.create_post(body="Hulk smash!",
  author="@bbanner");
  fdrake_post = post_service.create_post(body="Sic parvis magna",
  author="@francisdrake");
  genie_post = post_service.create_post(
    body="Phenomenal cosmic powers. Itty bitty living space.",
    author="@genie"
  );
  princess_jasmine_comment = comment_service.create_comment(body="True story. FR.", author="@jazzyjasmine");

  tstark_post.save();
  bbanner_post.save();
  fdrake_post.save();
  doc_id = genie_post.save();

  genie_post.add_comment(princess_jasmine_comment);
  princess_jasmine_comment.incr_like_count();

  genie_post.edit("Phenomenal cosmic powers. Teeny tiny living space.");

  print(genie_post);


if __name__ == "__main__": main();