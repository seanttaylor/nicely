#!/usr/bin/env python3
from flask import Flask, jsonify;
from app_config.app import app_config;
from app_config.startup import startup_config;
import json;
#APIs
from api.status import StatusAPIBlueprintFactory;
from api.post import PostAPIBlueprintFactory;

#Services
from services.post import PostService, PostValidator;
from services.user import UserService, UserValidator;
from services.feed import FeedService;

#Repositories
from lib.repository.post.my_sql import PostMySQLRepository;
from lib.repository.user.my_sql import UserMySQLRepository;

#Libraries
from lib.hypermedia.hal import HALHyperMediaService;
from lib.publisher.stdout import StdoutPublisher;
from lib.publisher.sse import SSEPublisher;
from lib.events.event_emitter import EventEmitter;
from services.feed import FeedService;
from tests.utils.utils import random_email_address, random_phone_number, random_user_handle



def main():
    print(startup_config["launch_banner"]);
    app = Flask(__name__);
    event_emitter = EventEmitter();
    user_validator = UserValidator(app_config["users"]);
    user_mysql_repo = UserMySQLRepository();
    user_service = UserService(user_mysql_repo, user_validator);
    post_validator = PostValidator(app_config["posts"], user_service);
    post_mysql_repo = PostMySQLRepository();
    post_service = PostService(post_mysql_repo, post_validator, event_emitter);
    feed_service = FeedService(post_service, SSEPublisher(), event_emitter);
    hal_service = HALHyperMediaService();

    app.register_blueprint(StatusAPIBlueprintFactory(hypermedia=hal_service));
    app.register_blueprint(PostAPIBlueprintFactory(service=post_service, hypermedia_service=hal_service));

    @app.route("/api/v1")
    def api_root():
        return (json.dumps(hal_service.api_root), {"content-type": "application/hal+json"});
    
    @app.route("/index.html")
    def index():
        return app.send_static_file("index.html")

    app.run(debug=True, host="0.0.0.0", threaded=True);

if __name__ == "__main__": main();