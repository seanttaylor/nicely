####FeedService Unit Tests####

from app_config.app import app_config;
from services.post import PostService, PostValidator, Post;
from services.feed import FeedService;
from services.user import UserService, UserValidator;
from lib.repository.user.my_sql import UserMySQLRepository;
from lib.repository.post.my_sql import PostMySQLRepository;
from lib.publisher.stdout import StdoutPublisher;
from lib.events.event_emitter import EventEmitter;
from tests.utils.utils import random_email_address, random_phone_number, random_user_handle

test_user_validator = UserValidator(app_config["users"]);
test_user_mysql_repo = UserMySQLRepository();
test_user_service = UserService(test_user_mysql_repo, test_user_validator);

test_event_emitter = EventEmitter();
test_post_validator = PostValidator(app_config["posts"], test_user_service);
test_post_mysql_repo = PostMySQLRepository();
test_post_service = PostService(test_post_mysql_repo, test_post_validator, test_event_emitter);
test_feed_service = FeedService(test_post_service, StdoutPublisher(), test_event_emitter);


class MockPublisher():

    def __init__(self):
        self.method_calls = {
            "publish": False
        };


    def publish(self, fake_post):
        self.method_calls["publish"] = True;
        return True;

    def was_called(self, method_name):
        return self.method_calls[method_name];


class MockPostService():

    def __init__(self):
        self.method_calls = {};


    def was_called(self, method_name):
        return self.method_calls[method_name];


class MockEventEmitter():

    def __init__(self):
        self.method_calls = {
            "on": False
        };


    def on(self, event_name, event_handler):
        self.method_calls["on"] = True;
        return True;


    def was_called(self, method_name):
        return self.method_calls[method_name];

####Tests####

def test_should_publish_a_post():
    fake_post = {
        "_id": "foo",
        "_data": {
            "is_published": False
        }
    };
    test_publish_service = MockPublisher();
    test_mock_post_service = MockPostService();
    test_event_emitter = MockEventEmitter();
    test_feed_service2 = FeedService(
        test_mock_post_service,
        test_publish_service,
        test_event_emitter
    );


    test_feed_service2.publish_post(fake_post);

    assert test_publish_service.was_called("publish") == True;


def test_should_return_list_of_most_recent_published_posts():
    test_posts = test_feed_service.get_recent_posts();

    assert isinstance(test_posts, list) == True;
    assert isinstance(test_posts[0], Post) == True;


def test_should_return_a_list_of_posts_from_all_followed_users():
    test_user_handle = random_user_handle();
    test_user_no_1 = test_user_service.create_user(
        handle=test_user_handle,
        motto="Hulk smash!",
        email_address=random_email_address(),
        first_name="Bruce",
        last_name="Banner",
        phone_number=random_phone_number()
    );

    test_user_no_2 = test_user_service.create_user(
        handle=random_user_handle(),
        motto="Let's do this!",
        email_address=random_email_address(),
        first_name="Steve",
        last_name="Rogers",
        phone_number=random_phone_number()
    );
    test_user_no_1_id = test_user_no_1.save();
    test_user_no_2.save();

    test_post = test_post_service.create_post(
        body="Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        user_id=test_user_no_1_id,
        author=test_user_handle
    );

    test_post.save();
    test_user_no_2.follow_user(test_user_no_1);

    test_user_no_2_feed = test_feed_service.get_feed_of(test_user_no_2);

    assert type(test_user_no_2_feed) == list;
    assert test_user_no_2_feed[0]._data["handle"] == test_user_handle;
    assert isinstance(test_user_no_2_feed[0], Post);
    assert len(test_user_no_2_feed) == 1;



