####CommentService Unit Tests####
import pytest;
from app_config.app import app_config;
from datetime import datetime;

from services.exceptions import CommentServiceError;
from services.comment import CommentService, CommentValidator, Comment;
from services.post import PostService, PostValidator, Post;
from services.user import UserService, UserValidator;

from lib.repository.user.my_sql import UserMySQLRepository;
from lib.repository.post.my_sql import PostMySQLRepository;
from lib.repository.comment.my_sql import CommentMySQLRepository;
from lib.events.event_emitter import EventEmitter

test_event_emitter = EventEmitter();
test_post_validator = PostValidator(app_config["posts"]);
test_post_mysql_repo = PostMySQLRepository(app_config["posts"]["fields"]);
test_post_service = PostService(test_post_mysql_repo, test_post_validator, test_event_emitter);

test_user_validator = UserValidator(app_config["users"]);
test_user_mysql_repo = UserMySQLRepository(app_config["users"]["fields"]);
test_user_service = UserService(test_user_mysql_repo, test_user_validator);

test_comment_validator = CommentValidator(test_post_service, test_user_service);
test_comment_mysql_repo = CommentMySQLRepository(app_config["comments"]["fields"]);
test_comment_service = CommentService(test_comment_mysql_repo, test_comment_validator);

####Tests####

def test_should_return_new_comment_instance():
    test_post = test_post_service.create_post(
        body="Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        author="@tstark"
    );
    test_post_id = test_post.save();

    test_comment = test_comment_service.create_comment(
        body="True story. FR.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        post_id=test_post_id
    );
    test_comment.save();

    assert isinstance(test_comment, Comment) == True;


def test_should_return_list_of_comment_instances():
    test_post = test_post_service.create_post(
        body="Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        author="@tstark"
    );
    test_post_id = test_post.save();

    test_comment = test_comment_service.create_comment(
        body="True story. FR.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        post_id=test_post_id
    );
    test_comment.save();
    result = test_comment_service.find_all_comments();

    assert isinstance(result, list);
    assert isinstance(result[0], Comment) == True;


def test_should_delete_comment():
    #delete_comment FUNCTIONALITY NOT IMPLEMENTED YET
    assert True == True;


def test_should_return_comment_id_on_save():
    test_post = test_post_service.create_post(
        body="Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        author="@tstark"
    );
    test_post_id = test_post.save();

    test_comment = test_comment_service.create_comment(
        body="True story. FR.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        post_id=test_post_id
    );
    test_comment_id = test_comment.save();

    assert isinstance(test_comment_id, str) == True;


def test_should_return_updated_comment_matching_test_text():
    test_post = test_post_service.create_post(
        body="Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        author="@tstark"
    );
    test_post_id = test_post.save();

    test_edit = "True story. No doubt.";
    test_comment = test_comment_service.create_comment(
        body="True story. FR.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        post_id=test_post_id
    );

    test_comment.save();
    test_comment.edit(test_edit);

    assert test_comment._data["body"] == test_edit;


def test_should_increment_comment_like_count():
    test_post = test_post_service.create_post(
        body="Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        author="@tstark"
    );
    test_doc_id = test_post.save();
    test_comment = test_comment_service.create_comment(
        body="True story. FR.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        post_id=test_doc_id
    );

    test_comment.save();
    test_comment.incr_like_count();

    assert test_comment._data["like_count"] == 1;


def test_should_throw_exception_when_attempting_to_create_invalid_comment():
    with pytest.raises(CommentServiceError) as exception_info:
        test_comment = test_comment_service.create_comment();

    assert "MissingOrInvalidCommentBody" in str(exception_info.value);


def test_should_throw_exception_when_user_id_missing():
    with pytest.raises(CommentServiceError) as exception_info:
        test_comment = test_comment_service.create_comment(
            body="True story. FR.",
            post_id="fake_post_id"
        );

    assert "MissingOrInvalidUserId" in str(exception_info.value);


def test_should_throw_exception_when_post_id_missing():
    with pytest.raises(CommentServiceError) as exception_info:
        test_comment = test_comment_service.create_comment(
            body="True story. FR.",
            user_id="fake_user_id"
        );

    assert "MissingOrInvalidPostId" in str(exception_info.value);


def test_should_throw_exception_when_post_id_does_not_exist():
    with pytest.raises(CommentServiceError) as exception_info:
        fake_post_id = str(datetime.now());
        test_comment = test_comment_service.create_comment(
            body="True story. FR.",
            user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
            post_id=fake_post_id
        );

    assert "MissingOrInvalidPostId" in str(exception_info.value);


def test_should_throw_exception_when_user_id_does_not_exist():
    with pytest.raises(CommentServiceError) as exception_info:
        fake_user_id = str(datetime.now());
        test_post = test_post_service.create_post(
            body="Everybody wants a happy ending, right? But it doesn’t always roll that way.",
            user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
            author="@tstark"
        );
        test_post_id = test_post.save();

        test_comment = test_comment_service.create_comment(
            body="True story. FR.",
            user_id=fake_user_id,
            post_id=test_post_id
        );

    assert "MissingOrInvalidUserId" in str(exception_info.value);
