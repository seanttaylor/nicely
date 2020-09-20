import urllib.request;

class Post():

  def __init__(self, repo, body, author):
    self.__body = body;
    self.__author = author;
    self.__repo = repo;

  def save(self):
    id = self.__repo.create({
      "body": self.__body, 
      "author": self.__author
    });
    self.__id = id;
    return id;
  
  def update(self, doc):
    id = self.__id;
    self.__repo.update(id, doc);
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
      repo=self._repo, 
      body=kwargs["body"], 
      author=kwargs["author"]
    );

  def find_post_by_id(self, id):
    return self._repo.find_one(id);
  
  def find_all_posts(self):
    return self._repo.find_all();
  
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
  


