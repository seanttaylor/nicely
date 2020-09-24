import urllib.request;

class Post():

  def __init__(self, repo, doc):
    self._doc = doc;
    #self._body = args[0];
    #self._author = args[1];
    #self._created_date = kwargs.get("created_date");
    #self._last_modified = kwargs.get("last_modified");
    #self._comments = kwargs.get("comments");
    #self._likes = kwargs.get("likes");
    self._repo = repo;


  def save(self):
    id = self._repo.create({
      "body": self._doc["body"],
      "author": self._doc["author"]
    });
    self._id = id;
    return id;


  def add_comment(self, comment):
    comment.on_post(self._id);
    comment.save();
    self._repo.incr_comment_count(self._id);
    if "comment_count" in self._doc:
      self._doc["comment_count"] = self._doc["comment_count"] + 1
    else:
      self._doc["comment_count"] = 1


  def update(self, doc):
    id = self._id;
    self._repo.update(id, doc);
    return self;

####Post####


class PostService():

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
    return self._repo.delete(id);


####PostService####

class PostValidator():
  _messages = {
    "postCharacterLimitExceeded": "ValidationError: Post body must be (150) characters or less",
    "invalidUserHandle": "ValidationError: {} is not a valid user handle",
    "serviceError": "ValidationFailure: The Sentiment Service returned a {} response"
  }

  def __init__(self, config):
    self._config = config;

  def validate(self, post_data):
    if len(post_data["body"]) > self._config["post_character_limit"]:
      raise Exception(self._messages["postCharacterLimitExceeded"])

    if len(post_data["author"]) < 4:
      raise Exception(self._messages["invalidUserHandle"].format(post_data["author"]))

    with urllib.request.urlopen(self._config["sentiment_service"]["url"]) as response:
      response_code = response.getcode();
      if response_code > 400:
          raise Exception(self._messages["serviceError"].format(response_code))

####PostValidator####



