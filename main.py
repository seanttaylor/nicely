#!/usr/bin/env python3


from app_config.app import app_config;
from app_config.startup import startup_config;
#Services
from services.post import PostService, PostValidator;
from services.user import UserService, UserValidator;
from services.feed import FeedService;
#Repositories
from lib.repository.post.my_sql import PostMySQLRepository;
from lib.repository.user.my_sql import UserMySQLRepository;

#Libraries
from lib.publisher.stdout import StdoutPublisher;
from lib.publisher.sse import SSEPublisher;
from lib.events.event_emitter import EventEmitter;
from services.feed import FeedService;


def main():
    print(startup_config["launch_banner"]);
    event_emitter = EventEmitter();
    user_validator = UserValidator(app_config["users"]);
    user_mysql_repo = UserMySQLRepository(app_config["users"]["fields"]);
    user_service = UserService(user_mysql_repo, user_validator);
    post_validator = PostValidator(app_config["posts"], user_service);
    post_mysql_repo = PostMySQLRepository(app_config["posts"]["fields"]);
    post_service = PostService(post_mysql_repo, post_validator, event_emitter);
    feed_service = FeedService(post_service, SSEPublisher(), event_emitter);

    post = post_service.create_post(
        body="Everybody wants a happy ending, right? But it doesn’t always roll #that way.",
        user_id="1a417a6b-8e3f-4e4d-abb7-fc322be611e7",
        author="@tstark"
    );

    post_id = post.save();

    #user_service = UserService(repo, UserValidator, PostService, CommentService)
    #user = user_service.create_user({})
    #post = user.create_post({})
    #comment = user.create_comment({})
    #comment_id = comment.save()
    #post_id = post.save()



if __name__ == "__main__": main();