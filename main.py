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
from tests.utils.utils import random_email_address, random_phone_number, random_user_handle


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

    test_user_no_1 = user_service.create_user(
        handle=random_user_handle(),
        motto="Hulk smash!",
        email_address=random_email_address(),
        first_name="Bruce",
        last_name="Banner",
        phone_number=random_phone_number()
    );
    test_user_no_1.save();

    test_user_no_2 = user_service.create_user(
        handle=random_user_handle(),
        motto="Let's do this!",
        email_address=random_email_address(),
        first_name="Steve",
        last_name="Rogers",
        phone_number=random_phone_number()
    );
    test_user_no_2.save();
    test_user_no_2.follow(test_user_no_1);

    print("is_following?", test_user_no_2.is_following(test_user_no_1))





if __name__ == "__main__": main();