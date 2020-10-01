import urllib.request;
import pprint;

pp = pprint.PrettyPrinter(indent=2);

class Post():

  def __init__(self, repo, doc):
    self._data = doc;
    self._repo = repo;


  def __str__(self):
    pp.pprint({
      "id": self._id,
      "created_date": self._data["created_date"],
      "last_modified": self._data["last_modified"],
      "data": {
        "author": self._data["author"],
        "user_id": self._data["user_id"],
        "body": self._data["body"],
        "comment_count": self._data["comment_count"]
      }
    });
    return "#####"


  def save(self):
    """
    Saves a new post to the data store.
    @param (object) self
    @returns (str) - a uuid for the new post
    """
    post = self._repo.create({
      "body": self._data["body"],
      "user_id": self._data["user_id"]
    });

    self._id = post["id"];
    self._data["created_date"] = post["created_date"];
    self._data["last_modified"] = None;

    return post["id"];


  def add_comment(self, comment):
    """
    Associates a comment with a post; updates post['comment_count'] property.
    @param (object) self
    @param (Comment) comment - an instance of the Comment class
    @returns (str) - a uuid for the new post
    """
    comment.on_post(self._id);
    comment.save();
    self._repo.incr_comment_count(self._id);
    if "comment_count" in self._data:
      self._data["comment_count"] = self._data["comment_count"] + 1
    else:
      self._data["comment_count"] = 1


  def edit(self, text):
    """
    Updates the post['body'] property; saves the update to the data store
    @param (object) self
    @param (str) text - the updated text
    @returns (None)
    """
    id = self._id;
    last_modified = self._repo.edit_post(id, text)["last_modified"];
    self._data["body"] = text;
    self._data["last_modified"] = last_modified;

    return self;

####Post####


class PostService():

  # Manages collection operations on `Post` objects

  def __init__(self, repo, validator):
    self._repo = repo;
    self._validator = validator;
    self._Post = Post;


  def create_post(self, **kwargs):
    self._validator.validate(kwargs);
    return self._Post(
      self._repo,
      kwargs
    );


  def find_post_by_id(self, id):
    post = self._repo.find_one(id)[0];
    return [self._Post(self._repo, post)];


  def find_all_posts(self):
    posts = self._repo.find_all();
    return list(map(lambda p: self._Post(self._repo, p), posts));


  def delete_post(self, id):
    #return self._repo.delete(id);
    pass;


  def get_total_post_count(self):
    return self._repo.get_total_post_count()["count"][0];


  def get_batch_by_sequence_no(self, starting_with, ending_with, batch_size):
    return self._repo.get_batch_by_sequence_no(
      starting_with,
      ending_with,
      batch_size
    );

####PostService####

class PostValidator():

  # Provides validation logic for `Post` objects.

  _messages = {
    "postCharacterLimitExceeded": "ValidationError: Post body must be (150) characters or less",
    "invalidUserId": "ValidationError: {} is not a valid user id",
    "serviceError": "ValidationFailure: The Sentiment Service returned a {} response"
  }

  def __init__(self, config):
    self._config = config;

  def validate(self, post_data):
    if len(post_data["body"]) > self._config["post_character_limit"]:
      raise Exception(self._messages["postCharacterLimitExceeded"])

    if len(post_data["user_id"]) < 32:
      raise Exception(self._messages["invalidUserId"].format(post_data["user_id"]))

    with urllib.request.urlopen(self._config["sentiment_service"]["url"]) as response:
      response_code = response.getcode();
      if response_code > 400:
          raise Exception(self._messages["serviceError"].format(response_code))

####PostValidator####



