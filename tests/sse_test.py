####Server-Sent Event Unit Tests####

from app_config.app import app_config;
from services.post import PostService, PostValidator;
from lib.sse.server_sent_event import ServerSentEvent;
from lib.repository.post.my_sql import PostMySQLRepository;
from lib.events.event_emitter import EventEmitter;

test_event_emitter = EventEmitter();
test_post_validator = PostValidator(app_config["posts"]);
test_post_mysql_repo = PostMySQLRepository(app_config["posts"]["fields"]);
test_post_service = PostService(test_post_mysql_repo, test_post_validator, test_event_emitter);
sse = ServerSentEvent();

####Tests####

def test_should_return_new_string_complying_with_event_stream_format():
    test_post = test_post_service.create_post(
        body="Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        author="@tstark"
    );
    test_post.save();

    test_event = sse.of(event_name="NewPost", event_data=test_post._data);

    assert test_event.find("NewPost") != -1;
    assert test_event.find("header") != -1;
    assert test_event.find("data") != -1;
    assert test_event.find("payload") != -1;
    assert test_event.find("timestamp") != -1;
    assert test_event.find("uuid") != -1;
    assert test_event.find("Everybody wants a happy ending, right? But it doesn’t always roll that way.") != -1;

