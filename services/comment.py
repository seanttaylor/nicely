from datetime import datetime;
import pprint;

pp = pprint.PrettyPrinter(indent=2);

class Comment():

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
        "like_count": self._data["like_count"]
      }
    });
    return "###"



  def on_post(self, post_id):
    """
    Associates a comment with a specified post
    @param (str) post_id - id of the post being commented on
    @returns (None)
    """
    self._data["post_id"] = post_id;


  def save(self):
    """
    Saves a new comment to the data store.
    @param (object) self
    @returns (str) - a uuid for the new comment
    """
    comment = self._repo.create({
      "body": self._data["body"],
      "user_id": self._data["user_id"],
      "post_id": self._data["post_id"]
    });

    self._id = comment["id"];
    self._data["created_date"] = comment["created_date"];
    self._data["last_modified"] = None;

    return comment["id"];


  def incr_like_count(self):
    """
    Increments the comment['like_count'] property
    @param (object) self
    @returns (None)
    """
    self._repo.incr_like_count(self._id);
    if "like_count" in self._data:
      self._data["like_count"] = self._data["like_count"] + 1
    else:
      self._data["like_count"] = 1


  def edit(self, text):
    """
    Updates the comment['body'] property
    @param (object) self
    @param (string) text - of the updated comment
    @returns (object) self
    """

    id = self._id;
    last_modified = self._repo.edit_comment(id, text)["last_modified"];
    self._data["body"] = text;
    self._data["last_modified"] = last_modified;

    return self;


####Comment####


class CommentService():

  def __init__(self, repo, validator):
    self._repo = repo;
    self._validator = validator;
    self._Comment = Comment;


  def create_comment(self, **kwargs):
    #self._validator.validate(kwargs);
    return self._Comment(
      self._repo,
      kwargs
    );

  def find_all_comments(self):
    comments = self._repo.find_all_comments();
    return list(map(lambda c: self._Comment(self._repo, c), comments));


####CommentService####

class CommentValidator():

  # Provides validation logic for `Comment` objects.
  # TODO: Actually create validation logic

  def __init__(self, config):
    self._config = config;

  def validate(self, comment_data):
    pass;

####CommentValidator####