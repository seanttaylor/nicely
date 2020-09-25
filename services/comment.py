from datetime import datetime;
import pprint;

pp = pprint.PrettyPrinter(indent=2);

class Comment():

  def __init__(self, repo, doc):
    self._data = doc;
    self._repo = repo;


  def __str__(self):
    pp.pprint(self._data);
    return "###"



  def on_post(self, post_id):
    self._data["post_id"] = post_id;


  def save(self):
    id = self._repo.create({
      "body": self._data["body"],
      "author": self._data["author"],
      "post_id": self._data["post_id"]
    });
    self._id = id;
    return id;

  def incr_like_count(self):
    self._repo.incr_like_count(self._id);
    if "like_count" in self._data:
      self._data["like_count"] = self._data["like_count"] + 1
    else:
      self._data["like_count"] = 1


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
    comments = self._repo.find_all_comments();
    return list(map(lambda c: self._Comment(self._repo, c), comments));


####CommentService####