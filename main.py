
#!/usr/bin/env python3
#Maintainer: Sean Travis Taylor

from services.post import PostService, PostValidator
from lib.repository.in_memory import InMemoryRepository
from lib.repository.json import JSONRepository
from interfaces.repository import IRepository
# from lib.repository.sqlite import SQLite3Repository


#def welcome_message(name):
#  print("Well hello there, {}".format(name));

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
  fdrake_post.save();



  bbanner_post.update({"comments": 42});
  bbanner_post.update({"likes": 1042});

  #print(list(post_service.find_all_posts()));
  
  #post_service.delete_post(doc_id);
  #json_post_service.delete_post(doc_id_1);
  #print(list(post_service.find_all_posts()));

  print(list(json_post_service.find_all_posts()));

  


if __name__ == "__main__": main();