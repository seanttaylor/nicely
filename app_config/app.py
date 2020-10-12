app_config = {
  "__comments": "Non-secret configuration for application modules.",
  "posts" : {
    "post_character_limit": 150,
    "base_sentiment_score": 2,
    "average_post_sentiment_score": 3,
    "post_limit_per_hour": 5,
    "sentiment_service": {
      "url": "http://httpbin.org/status/200"
    }
  },
  "users": {
    "email_regex": "^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$",
    "handle_regex": "(?<![\w.-])@[A-Za-z][\w-]+"
  }
}