def feed_post_to_HAL(post):
    return {
        "_links": {
            "self": {
                "href": "/api/v1/users/{user_id}/posts/{post_id}".format(user_id=post["data"]["user_id"], post_id=post["id"]),
                "title": "Get latest published posts from users in reverse chronological order"
            },
            "post_comments": {
                "href": "/api/v1/users/{user_id}/posts/{post_id}/comments".format(user_id=post["data"]["user_id"], post_id=post["id"]),
                "title": "View or create comments on this post"
            },
            "user_feed": {
                "href": "/api/v1/users/{id}/posts/{id}",
                "title": "Create an *unpublished* post by a specified user, view all published posts by a specified user or edit an existing post with provided {id} param; viewing unpublished posts or editing existing posts only available to the authenticated author of the post",
                "templated": True,
                "ny_auth_required": True
            },
            "user": {
                "href": "/api/v1/users/{user_id}".format(user_id=post["data"]["user_id"]),
                "title": "Learn more about this user",
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
            "docs": {
                "href": "/api/docs/latest/index.html#feed",
                "title": "The Feed documentation"
            },
            "curies": [
                {
                    "name": "nicely",
                    "href": "/api/schemas/{rel}/latest",
                    "title": "Learn more about Compact URIs at https://tools.ietf.org/html/draft-kelly-json-hal-06#section-8.2",
                    "templated": True
                }
            ],
            "nicely:users": {
                "href": "/user"
            },
            "nicely:posts": {
                "href": "/posts"
            },
            "nicely:comments": {
                "href": "/comments"
            },
            "realtime_updates": {
                "href": "/api/sse",
                "title": "Connect to this endpoint to receive real-time updates of new posts over the wire (compliant with Server-Sent Events specification)",
                "ny_auth_required": True
            },
            "status": {
                "href": "/status",
                "title": "Get the status of the platfrom (i.e. is it down?)"
            }
        },
        "_embedded": {
            "posts": list(map(lambda p: feed_post_to_HAL(p), data["data"]))
        },
        "entries": data["entries"]
    }

    return doc;
