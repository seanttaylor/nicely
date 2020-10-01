####FeedService Unit Tests####

from app_config.app import app_config;
from services.post import PostService, PostValidator;
from services.feed import FeedService;
from lib.repository.post.my_sql import PostMySQLRepository;

test_post_validator = PostValidator(app_config["posts"]);
test_post_mysql_repo = PostMySQLRepository(app_config["posts"]["fields"]);
test_post_service = PostService(test_post_mysql_repo, test_post_validator);
test_feed_service = FeedService(test_post_service);


####Tests####

def test_should_return_list_of_length_equal_to_batch_size():
  test_batch_size = 1;
  test_feed_gen = test_feed_service.batch_get_posts(
    sequence_no=0,
    batch_size=test_batch_size
  );

  result = next(test_feed_gen);

  assert len(result) == test_batch_size;
