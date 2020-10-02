####FeedService Unit Tests####

from app_config.app import app_config;
from services.post import PostService, PostValidator, Post;
from services.feed import FeedService;
from lib.repository.post.my_sql import PostMySQLRepository;
from lib.publisher.stdout import StdoutPublisher;

test_post_validator = PostValidator(app_config["posts"]);
test_post_mysql_repo = PostMySQLRepository(app_config["posts"]["fields"]);
test_post_service = PostService(test_post_mysql_repo, test_post_validator);
test_feed_service = FeedService(test_post_service, StdoutPublisher());


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
        self.method_calls = {
            "mark_as_published": False
        };


    def mark_as_published(self, fake_post):
        self.method_calls["mark_as_published"] = True;
        return True;


    def was_called(self, method_name):
        return self.method_calls[method_name];


####Tests####

#def test_should_return_list_of_length_equal_to_batch_size():
    #TODO: Decide wether the `replay_posts` method should be a generator
#    test_batch_size = 1;
#    test_feed_gen = test_feed_service.replay_posts(
#      sequence_no=0,
#      batch_size=test_batch_size
#    );
#
#    result = next(test_feed_gen);
#
#    assert len(result) == test_batch_size;


def test_should_publish_a_post():
    fake_post = {
        "_id": "foo",
        "_data": {
            "is_published": False
        }
    };
    test_publish_service = MockPublisher();
    test_mock_post_service = MockPostService();
    test_feed_service2 = FeedService(
        test_mock_post_service,
        test_publish_service
    );


    test_feed_service2.publish_post(fake_post);

    assert test_publish_service.was_called("publish") == True;
    assert test_mock_post_service.was_called("mark_as_published") == True;


def test_should_return_list_of_most_recent_published_posts():
    test_posts = test_feed_service.get_recent_posts();

    assert isinstance(test_posts, list) == True;
    assert isinstance(test_posts[0], Post) == True;