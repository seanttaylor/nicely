from lib.hypermedia.hal_curies import curies;
from lib.hypermedia.hal_rel import link_rels;

def user_post_to_HAL(post):
    return {
        "_links": {
            "self": {
                "href": "/api/v1/users/{user_id}/posts/{post_id}".format(user_id=post["data"]["user_id"], post_id=post["id"])
            },
            "post:comments": {
                "href": "/{id}/comments".format(id=post["id"]),
                "title": "Comments on this post"
            },
            "user:posts": {
                "href": "/{id}/posts".format(id=post["data"]["user_id"]),
                "title": "Posts from this user"
            },
            "user:account": {
                "href": "/{id}".format(id=post["data"]["user_id"]),
                "title": "This user's profile"
            }
        },
        "author": post["data"]["author"],
        "first_name": post["data"]["first_name"],
        "last_name": post["data"]["last_name"],
        "body": post["data"]["body"],
        "comment_count": post["data"]["comment_count"],
        "created_date": post["created_date"]
    }

def user_post(data=[]):
    doc = {
        "_links": {
            "self": {
                "href": "/api/v1/feed",
                "title": "Get latest published posts from users in reverse chronological order",
            },
            "spec": link_rels["spec"],
            "curies": curies,
            "schema:users": {
                "href": "/user",
                "title": "User JSON Schema document"
            },
            "schema:posts": {
                "href": "/posts",
                "title": "Post JSON Schema document"
            },
            "schema:comments": {
                "href": "/comments",
                "title": "Comment JSON Schema document"
            },
           "feed:realtime_updates": {
                "href": "/subscribe",
                "title": "Subscribe to real-time updates as new posts are published to the feed"
            },
            "status": link_rels["status"]
        },
        **list(map(lambda p: user_post_to_HAL(p), data["data"]))[0]
    }

    return doc;