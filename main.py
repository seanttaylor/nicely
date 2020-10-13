#!/usr/bin/env python3
from flask import Flask;
from flask_restful import Resource, Api;
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

from api.status import StatusAPI;

def main():
    print(startup_config["launch_banner"]);
    app = Flask(__name__);
    api = Api(app);
    event_emitter = EventEmitter();
    user_validator = UserValidator(app_config["users"]);
    user_mysql_repo = UserMySQLRepository();
    user_service = UserService(user_mysql_repo, user_validator);
    post_validator = PostValidator(app_config["posts"], user_service);
    post_mysql_repo = PostMySQLRepository();
    post_service = PostService(post_mysql_repo, post_validator, event_emitter);
    feed_service = FeedService(post_service, SSEPublisher(), event_emitter);

    api.add_resource(StatusAPI, '/status');
    app.run(debug=True, host="0.0.0.0");

if __name__ == "__main__": main();