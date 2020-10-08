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
from lib.sse.server_sent_event import ServerSentEvent;

from lib.events.event_emitter import EventEmitter;

def main():
    print(startup_config["launch_banner"]);
    post_validator = PostValidator(app_config["posts"]);
    post_mysql_repo = PostMySQLRepository(app_config["posts"]["fields"]);
    post_service = PostService(post_mysql_repo, post_validator);

    post = post_service.create_post(
        body="Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        author="@tstark"
    );

    doc_id = post.save();

    my_event_emitter = EventEmitter()

    def on_new_post(event_data):
        print("a new post is in!", event_data.value());


    my_event_emitter.on("new-post", on_new_post);
    my_event_emitter.emit("new-post", {"foo": "bar"})



if __name__ == "__main__": main();