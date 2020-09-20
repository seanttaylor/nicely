import urllib.request;

class Post():

  def __init__(self, repo):
    self.__repo = repo;

  def of(self, **kwargs):
    self.__body = kwargs["body"];
    self.__author = kwargs["author"];
    return self;

  def save(self):
    id = self.__repo.create({
      "body": self.__body, 
      "author": self.__author
    });
    self.__id = id;
    return id;
  
  def update(self, doc):
    id = self.__id;
    print(f"Updating {id}")
    self.__repo.update(id, doc);
    return self;

####Post####

class PostService():

  def __init__(self, repo, validator):
    self.__repo = repo;
    self.__validator = validator;
    self.__Post = Post(repo);

  def create_post(self, **kwargs):
    self.__validator.validate(kwargs);
    return self.__Post.of(body=kwargs["body"], author=kwargs["author"]);

  def find_post_by_id(self, id):
    return self.__repo.find_one(id);
  
  def find_all_posts(self):
    return self.__repo.find_all();
  
  def delete_post(self, id):
    return self.__repo.delete(id);

####PostService####  

class PostValidator():
  __messages = {
    "postCharacterLimitExceeded": "ValidationError: Post body must be (150) characters or less",
    "invalidUserHandle": "ValidationError: {} is not a valid user handle",
    "serviceError": "ValidationFailure: The Sentiment Service returned a {} response"
  }

  def __init__(self, config):
    self.__config = config;

  def validate(self, post_data):
    if len(post_data["body"]) > self.__config["post_character_limit"]:
      raise Exception(self.__messages["postCharacterLimitExceeded"])
    
    if len(post_data["author"]) < 4:
      raise Exception(self.__messages["invalidUserHandle"].format(post_data["author"]))
    
    with urllib.request.urlopen(self.__config["sentiment_service"]["url"]) as response:
      response_code = response.getcode();
      if response_code > 400:
          raise Exception(self.__messages["serviceError"].format(response_code))

####PostValidator####  
  


