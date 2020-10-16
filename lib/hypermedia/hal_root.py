hal_root = {
    "_links": {
        "self": {
            "href": "/",
            "title": "Nicely. A nice social network for nice people."
        },
        "curies": [
             {
                "name": "nicely",
                "href": "/api/schemas/{rel}/latest",
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
        "feed_posts": {
            "href": "/api/v1/feed",
            "title": "Get latest published posts from users in reverse chronological order"
        },
        "feed_realtime_updates": {
            "href": "/api/sse",
            "title": "Connect to this endpoint to receive real-time updates of new posts over the wire (compliant with Server-Sent Events specification)",
            "ny_auth_required": True
        },
        "post_comments": {
            "href": "/api/v1/users/{id}/posts/{id}/comments/{id}",
            "title": "Create comment on a post, view all of a specified post's comments or edit an existing comment with provided {id} param; comments can only be edited by the authenticated author of the comment",
            "templated": True,
            "ny_auth_required": True
        },
        "user_posts": {
            "href": "/api/v1/users/{id}/posts/{id}",
            "title": "Create an *unpublished* post by a specified user, view all published posts by a specified user or edit an existing post with provided {id} param; viewing unpublished posts or editing existing posts only available to the authenticated author of the post",
            "templated": True,
            "ny_auth_required": True
        },
        "user_accounts": {
            "href": "/api/v1/users/{id}",
            "title": "Create new user account, view all verified users or edit an existing user with provided {id} param; users can only edited by the authenticated owner of the user account",
        },
        "status": {
            "href": "/status",
            "title": "Get the status of the platfrom (i.e. is it down?)"
        },
        "docs": {
            "href": "/api/docs/{version_no}",
            "title": "Platform API documentation, defaults to latest version if no version specified"
        }
    }
}
