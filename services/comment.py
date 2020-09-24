from datetime import datetime;

class Comment():

  def __init__(self, repo, doc):
    self._body = doc["body"];
    self._author = doc["author"];
    self._repo = repo;


  def on_post(self, post_id):
    self._post_id = post_id;


  def save(self):
    id = self._repo.create({
      "body": self._body,
      "author": self._author,
      "post_id": self._post_id
    });
    self._id = id;
    return id;


####Comment####


class CommentService():

  def __init__(self, repo):
    self._repo = repo;
    #self._validator = validator;
    self._Comment = Comment;


  def create_comment(self, **kwargs):
    #self._validator.validate(kwargs);
    return self._Comment(
      self._repo,
      kwargs
    );

  def find_all_comments(self):
    return self._repo.find_all_comments();


####CommentService####