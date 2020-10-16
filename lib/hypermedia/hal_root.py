from lib.hypermedia.hal_curies import curies;
from lib.hypermedia.hal_rel import link_rels;

hal_root = {
    "_links": {
        "self": {
            "href": "/",
            "title": "Nicely. A nice social network for nice people."
        },
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
        "feed:posts": {
            "href": "/",
            "title": "See all recently published posts"
        },        
        "post:comments": {
            "href": "/{user_id}/posts/{post_id}/comments",
            "title": "Get the comments on a specified post",
            "templated": True
        },
        "user:posts": {
            "href": "/{user_id}/posts",
            "title": "Get all the *published* posts from a specified user",
            "templated": True
        },
        "user:accounts": {
            "href": "/{id}",
            "title": "View a specified user account",
            "templated": True
        },
        "status": link_rels["status"],
        "docs": link_rels["docs"]
    }
}
