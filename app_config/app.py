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
      "user_id": 1,
      "sequence_no": 2,
      "body": 3,
      "created_date": 4,
      "last_modified": 5,
      "comment_count": 6,
      "like_count": 7,
      "is_published": 8,
      "is_archived": 9,
      "author": 10
    }
  },
  "comments": {
    "fields": {
      "__comments": "Indices mapping to database table field values returned from the mysql connector inqueries.",
      "id": 0,
      "post_id": 1,
      "user_id": 2,
      "body": 3,
      "created_date": 4,
      "last_modified": 5,
      "like_count": 6
    }
  },
  "users": {
    "__comments": "Indices mapping to database table field values returned from the mysql connector inqueries.",
    "fields": {
      "id": 0,
      "handle": 1,
      "email_address": 2,
      "motto": 3,
      "is_verified": 4,
      "first_name": 5,
      "last_name": 6,
      "created_date": 7,
      "last_modified": 8
    },
    "email_regex": "^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$",
    "handle_regex": "(?<![\w.-])@[A-Za-z][\w-]+"
  }
}