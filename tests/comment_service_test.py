####CommentService Unit Tests####
import pytest;
from app_config.app import app_config;
from services.exceptions import CommentServiceError;
from services.comment import CommentService, CommentValidator, Comment;
from lib.repository.comment.my_sql import CommentMySQLRepository;

test_comment_validator = CommentValidator(app_config["comments"]);
test_comment_mysql_repo = CommentMySQLRepository(app_config["comments"]["fields"]);
test_comment_service = CommentService(test_comment_mysql_repo, test_comment_validator);

####Tests####

def test_should_return_new_comment_instance():
    test_comment = test_comment_service.create_comment(
        body="True story. FR.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        post_id="test_post_id"
    );
    test_comment.save();

    assert isinstance(test_comment, Comment) == True;


def test_should_return_list_of_comment_instances():
    test_comment = test_comment_service.create_comment(
        body="True story. FR.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        post_id="test_post_id"
    );
    test_doc_id = test_comment.save();
    result = test_comment_service.find_all_comments();

    assert isinstance(result, list);
    assert isinstance(result[0], Comment) == True;


def test_should_delete_comment():
    #delete_comment FUNCTIONALITY NOT IMPLEMENTED YET
    assert True == True;


def test_should_return_comment_id_on_save():
    test_comment = test_comment_service.create_comment(
        body="True story. FR.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        post_id="test_post_id"
    );
    test_doc_id = test_comment.save();

    assert isinstance(test_doc_id, str) == True;


def test_should_return_updated_comment_matching_test_text():
    test_edit = "True story. No doubt.";
    test_comment = test_comment_service.create_comment(
        body="True story. FR.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        post_id="test_post_id"
    );
    test_doc_id = test_comment.save();
    test_comment.edit(test_edit);

    assert test_comment._data["body"] == test_edit;


def test_should_increment_comment_like_count():
    test_comment = test_comment_service.create_comment(
        body="True story. FR.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        post_id="test_post_id"
    );

    test_comment.save();
    test_comment.incr_like_count();

    assert test_comment._data["like_count"] == 1;


def test_should_throw_exception_when_attempting_to_create_invalid_comment():
    with pytest.raises(CommentServiceError) as exception_info:
        test_comment = test_comment_service.create_comment();

    assert "MissingCommentBody" in str(exception_info.value);


def test_should_throw_exception_when_user_id_missing():
    with pytest.raises(CommentServiceError) as exception_info:
        test_comment = test_comment_service.create_comment(
            body="True story. FR.",
            post_id="fake_post_id"
        );

    assert "MissingUserId" in str(exception_info.value);


def test_should_throw_exception_when_post_id_missing():
    with pytest.raises(CommentServiceError) as exception_info:
        test_comment = test_comment_service.create_comment(
            body="True story. FR.",
            user_id="fake_user_id"
        );

    assert "MissingPostId" in str(exception_info.value);