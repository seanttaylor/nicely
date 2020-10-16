from lib.hypermedia.hal_curies import curies;
from lib.hypermedia.hal_rel import link_rels;

def feed_post_to_HAL(post):
    return {
        "_links": {
            "self": {
                "href": "/api/v1/users/{user_id}/posts/{post_id}".format(user_id=post["data"]["user_id"], post_id=post["id"])
            },
            "post:comments": {
                "href": "/{id}/comments".format(id=post["id"])
            },
            "user:posts": {
                "href": "/{id}/posts".format(id=post["data"]["user_id"])
            },
            "user:account": {
                "href": "/{id}".format(id=post["data"]["user_id"]),
                "title": "View this user's profile"
            }
        },
        "author": post["data"]["author"],
        "body": post["data"]["body"],
        "comment_count": post["data"]["comment_count"],
        "created_date": post["created_date"]
    }

def feed_posts(data=[]):
    doc = {
        "_links": {
            "self": {
                "href": "/api/v1/feed",
                "title": "Get latest published posts from users in reverse chronological order",
            },
            "docs": link_rels["docs"],
            "curies": curies,
            "schema:users": {
                "href": "/user"
            },
            "schema:posts": {
                "href": "/posts"
            },
            "schema:comments": {
                "href": "/comments"
            },
           "feed:realtime_updates": {
                "href": "/subscribe",
                "title": "Subscribe to real-time updates as new posts are published to the feed"
            },
            "status": link_rels["status"]
        },
        "_embedded": {
            "posts": list(map(lambda p: feed_post_to_HAL(p), data["data"]))
        },
        "entries": data["entries"]
    }

    return doc;
