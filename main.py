#!/usr/bin/env python3


from app_config.app import app_config;
from app_config.startup import startup_config;
#Services
from services.post import PostService, PostValidator;
from services.feed import FeedService;
#Repositories
from lib.repository.post.my_sql import PostMySQLRepository;
#Libraries
from lib.publisher.stdout import StdoutPublisher;
from lib.publisher.sse import SSEPublisher;
from lib.events.event_emitter import EventEmitter;
from services.feed import FeedService;


def main():
    print(startup_config["launch_banner"]);
    event_emitter = EventEmitter();
    post_validator = PostValidator(app_config["posts"]);
    post_mysql_repo = PostMySQLRepository(app_config["posts"]["fields"]);
    post_service = PostService(post_mysql_repo, post_validator, event_emitter);
    feed_service = FeedService(post_service, SSEPublisher(), event_emitter);

    post = post_service.create_post(
        body="Everybody wants a happy ending, right? But it doesn’t always roll #that way.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        author="@tstark"
    );

    post_id = post.save();


if __name__ == "__main__": main();