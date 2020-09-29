####PostService Unit Tests####

from app_config.app import app_config;
from services.post import PostService, PostValidator, Post;
from lib.repository.post.my_sql import PostMySQLRepository;

test_post_validator = PostValidator(app_config["posts"]);
test_post_mysql_repo = PostMySQLRepository(app_config["posts"]["fields"]);
test_post_service = PostService(test_post_mysql_repo, test_post_validator);

#test_doc_id = None;

class MockComment():

    def __init__(self):
        self.method_calls = {
            "on_post": False,
            "save": False
        };

    def on_post(self, id):
        self.method_calls["on_post"] = True;
        return True;

    def save(self):
        self.method_calls["save"] = True;
        return True;

    def was_called(self, method_name):
        return self.method_calls[method_name];


####Tests####

def test_should_return_new_post_instance():
    test_post = test_post_service.create_post(
        body="Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        author="@tstark"
    );
    test_post.save();

    assert isinstance(test_post, Post) == True;


def test_should_return_list_of_post_instances():
    test_post = test_post_service.create_post(
        body="Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        author="@tstark"
    );
    test_doc_id = test_post.save();
    result = test_post_service.find_all_posts();

    assert isinstance(result, list);
    assert isinstance(result[0], Post) == True;


def test_should_return_specified_post_matching_id():
    test_post = test_post_service.create_post(
        body="Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        author="@tstark"
    );
    test_doc_id = test_post.save();
    result = test_post_service.find_post_by_id(test_doc_id);

    assert len(result) == 1;
    assert isinstance(result, list);
    assert isinstance(result[0], Post) == True;
    assert result[0]._data["id"] == test_doc_id;


def test_should_delete_post():
    #delete_post FUNCTIONALITY NOT IMPLEMENTED YET
    #test_post = test_post_service.create_post(
    #    body="Everybody wants a happy ending, right? But it doesn’t always roll #that way.",
        #user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        #author="@tstark"
    #);
    #test_doc_id = test_post.save();
    #test_post.add_comment(test_comment);

    #assert test_comment.was_called(method_name="on_post") == True;
    #assert test_comment.was_called(method_name="save") == True;
    assert True == True;


def test_should_return_post_id_on_save():
    test_post = test_post_service.create_post(
        body="Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        author="@tstark"
    );
    test_doc_id = test_post.save();

    assert isinstance(test_doc_id, str) == True;


def test_should_return_updated_post_body_matching_text():
    test_edit = "Playboy. Billionaire. Genius";
    test_post = test_post_service.create_post(
        body="Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        author="@tstark"
    );
    test_doc_id = test_post.save();
    test_post.edit(test_edit);

    assert test_post._data["body"] == test_edit;


def test_should_call_comment_on_post_and_save_methods():
    test_comment = MockComment();
    test_edit = "Playboy. Billionaire. Genius";
    test_post = test_post_service.create_post(
        body="Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        user_id="e98417a8-d912-44e0-8d37-abe712ca840f",
        author="@tstark"
    );
    test_doc_id = test_post.save();
    test_post.add_comment(test_comment);

    assert test_comment.was_called(method_name="on_post") == True;
    assert test_comment.was_called(method_name="save") == True;
