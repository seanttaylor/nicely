####FeedService Unit Tests####

from app_config.app import app_config;
from services.post import PostService, PostValidator, Post;
from services.feed import FeedService;
from lib.repository.post.my_sql import PostMySQLRepository;

test_post_validator = PostValidator(app_config["posts"]);
test_post_mysql_repo = PostMySQLRepository(app_config["posts"]["fields"]);
test_post_service = PostService(test_post_mysql_repo, test_post_validator);
test_feed_service = FeedService(test_post_service);


####Tests####

def test_should_return_list_of_length_equal_to_batch_size():
  test_batch_size = 1;
  test_feed_gen = test_feed_service.replay_posts(
    sequence_no=0,
    batch_size=test_batch_size
  );

  result = next(test_feed_gen);

  assert len(result) == test_batch_size;


def test_should_publish_a_post():
  test_post = test_post_service.create_post(
    body="Everybody wants a happy ending, right? But it doesn’t always roll that way.",
    user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
    author="@tstark"
  );

  test_post.save();
  test_feed_service.publish_post(test_post);

  #assert isinstance(test_posts, list) == True;
  #assert isinstance(test_posts[0], Post) == True;


def test_should_return_list_of_most_recent_published_posts():
  test_posts = test_feed_service.get_recent_posts();


  assert isinstance(test_posts, list) == True;
  assert isinstance(test_posts[0], Post) == True;