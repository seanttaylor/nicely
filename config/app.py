app_config = {
  "main": {
    "launch_banner": """
NNNNNNNN        NNNNNNNN  iiii                                         lllllll
N:::::::N       N::::::N i::::i                                        l:::::l
N::::::::N      N::::::N  iiii                                         l:::::l
N:::::::::N     N::::::N                                               l:::::l
N::::::::::N    N::::::Niiiiiii     cccccccccccccccc    eeeeeeeeeeee    l::::lyyyyyyy           yyyyyyy
N:::::::::::N   N::::::Ni:::::i   cc:::::::::::::::c  ee::::::::::::ee  l::::l y:::::y         y:::::y
N:::::::N::::N  N::::::N i::::i  c:::::::::::::::::c e::::::eeeee:::::eel::::l  y:::::y       y:::::y
N::::::N N::::N N::::::N i::::i c:::::::cccccc:::::ce::::::e     e:::::el::::l   y:::::y     y:::::y
N::::::N  N::::N:::::::N i::::i c::::::c     ccccccce:::::::eeeee::::::el::::l    y:::::y   y:::::y
N::::::N   N:::::::::::N i::::i c:::::c             e:::::::::::::::::e l::::l     y:::::y y:::::y
N::::::N    N::::::::::N i::::i c:::::c             e::::::eeeeeeeeeee  l::::l      y:::::y:::::y
N::::::N     N:::::::::N i::::i c::::::c     ccccccce:::::::e           l::::l       y:::::::::y
N::::::N      N::::::::Ni::::::ic:::::::cccccc:::::ce::::::::e         l::::::l       y:::::::y
N::::::N       N:::::::Ni::::::i c:::::::::::::::::c e::::::::eeeeeeee l::::::l        y:::::y
N::::::N        N::::::Ni::::::i  cc:::::::::::::::c  ee:::::::::::::e l::::::l       y:::::y
NNNNNNNN         NNNNNNNiiiiiiii    cccccccccccccccc    eeeeeeeeeeeeee llllllll      y:::::y
                                                                                    y:::::y
                                                                                   y:::::y
                                                                                  y:::::y
                                                                                 y:::::y
                                                                                yyyyyyy
"""
  },
  "posts" : {
    "post_character_limit": 150,
    "base_sentiment_score": 2,
    "average_post_sentiment_score": 3,
    "post_limit_per_hour": 5,
    "sentiment_service": {
      "url": "http://httpbin.org/status/200"
    },
    "fields": {
      "__comments": "Indices mapping to database table field values returned from the mysql connector inqueries.",
      "id": 0,
      "body":1,
      "author": 2,
      "created_date": 3,
      "last_modified": 4,
      "comment_count": 5,
      "like_count": 6
    }
  },
  "comments": {
    "fields": {
      "__comments": "Indices mapping to database table field values returned from the mysql connector inqueries.",
      "id": 0,
      "post_id": 1,
      "body": 2,
      "author": 3,
      "like_count": 4,
      "created_date": 5,
      "last_modified": 6
    }
  }
}