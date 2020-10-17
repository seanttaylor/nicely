#Frequently used Link Relations on the Nicely platform

link_rels = {
    "user_posts": {
        "href": "/api/v1/users/{id}/posts/{id}",
        "title": "Create an *unpublished* post by a specified user, view all published posts by a specified user or edit an existing post with provided {id} param; viewing unpublished posts or editing existing posts only available to the authenticated author of the post",
        "templated": True,
        "ny_auth_required": True
    },
    "user_accounts": {
        "href": "/api/v1/users/{id}",
        "title": "Create new user account, view all verified users or edit an existing user with provided {id} param; users can only edited by the authenticated owner of the user account",
        "templated": True
    },
    "user": {
        "href": "/api/v1/users/{user_id}",
        "title": "Learn more about this user",
    },
    "post_comments": {
        "href": "/api/v1/users/{id}/posts/{id}/comments/{id}",
        "title": "Create comment on a post, view all of a specified post's comments or edit an existing comment with provided {id} param; comments can only be edited by the authenticated author of the comment",
        "templated": True,
        "ny_auth_required": True
    },
    "realtime_updates": {
        "href": "/api/sse",
        "title": "Connect to this endpoint to receive real-time updates of new posts over the wire (compliant with Server-Sent Events specification)",
        "ny_auth_required": True
    },
    "docs": {
        "href": "https://github.com/seanttaylor/nicely",
        "title": "Nicely platform API documentation"
    },
    "spec": {
        "href": "https://tools.ietf.org/html/draft-kelly-json-hal-06",
        "title": "Specification for the HAL hypermedia format this API complies with"
    },
    "westl": {
        "href": "/static/js/westl.json",
        "title": "Web Services Transition Language document specifiying application state transitions in hypertext"
    },
    "status": {
        "href": "/status",
        "title": "Get the status of the platfrom (i.e. is it down?)"
    }
}