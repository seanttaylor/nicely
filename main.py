
#!/usr/bin/env python3
#Maintainer: Sean Travis Taylor

from post import PostService, PostValidator
from in_memory_repository import InMemoryRepository
from json_repository import JSONRepository
# from sqlite3_repository import SQLite3Repository


#def welcome_message(name):
#  print("Well hello there, {}".format(name));

class IRepository():

  def __init__(self, myImpl): 

    self.__name = "myRepo";
    self.__create = myImpl.create;
    self.__find_one = myImpl.find_one;
    self.__find_all = myImpl.find_all;
    self.__update = myImpl.update;
    self.__delete = myImpl.delete;

  def create(self, doc):
    return self.__create(doc);

  def find_one(self, id):
    return self.__find_one(id);

  def find_all(self):
    return self.__find_all();

  def update(self, id, doc):
    return self.__update(id, doc);

  def delete(self, id):
    return self.__delete(id);

####IRepository####

post_validator_config = {
  "post_character_limit": 150,
  "base_sentiment_score": 2,
  "average_post_sentiment_score": 3,
  "post_limit_per_hour": 5,
  "sentiment_service": {
    "url": "http://httpbin.org/status/200"
  } 
}

def main():
  post_validator = PostValidator(post_validator_config);
  post_repo = IRepository(InMemoryRepository());
  json_repo = IRepository(JSONRepository());

  post_service = PostService(post_repo, post_validator);
  json_post_service = PostService(json_repo, post_validator);

  tstark_post = post_service.create_post(body="Playboy. Billionaire. Genius", author="@tstark")
  bbanner_post = json_post_service.create_post(body="Hulk smash!", author="@bbanner");
  fdrake_post = json_post_service.create_post(body="Sic parvis magna", author="@francisdrake");

  doc_id = tstark_post.save();
  doc_id_1 = bbanner_post.save();

  print(doc_id_1)



  bbanner_post.update({"comments": 42});
  #bbanner_post.update({"likes": 1042});

  #print(list(post_service.find_all_posts()));
  
  #post_service.delete_post(doc_id);
  #json_post_service.delete_post(doc_id_1);
  #print(list(post_service.find_all_posts()));

  print(list(json_post_service.find_all_posts()));

  


if __name__ == "__main__": main();