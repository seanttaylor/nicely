app_config = {
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