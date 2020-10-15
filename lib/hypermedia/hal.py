api_root = {
    "_links": {
        "self": {
            "href": "/",
            "title": "Nicely. A nice social network for nice people."
        },
        "curies": [
            {
                "name": "post",
                "href": "/api/schemas/{name}/latest",
                "title": "The Post JSON Schema document",
                "templated": True
            },
            {
                "name": "user",
                "href": "/api/schemas/{name}/latest",
                "title": "The User JSON Schema document",
                "templated": True
            },
            {
                "name": "comment",
                "href": "/api/schemas/{name}/latest",
                "title": "The Comment JSON Schema document",
                "templated": True
            },
            {
                "name": "feed",
                "href": "/api/docs/latest/index.html#feed",
                "title": "The Feed documentation"
            }
        ],
        "feed:posts": {
            "href": "/api/v1/feed",
            "title": "Get latest published posts from users in reverse chronological order"
        },
        "feed:realtime-updates": {
            "href": "/api/sse",
            "title": "Connect to this endpoint to receive real-time updates of new posts over the wire (compliant with Server-Sent Events specification)",
            "ny_auth_required": True
        },
        "post:comments": {
            "href": "/api/v1/users/{id}/posts/{id}/comments",
            "title": "Create comment or view a specified post's comments",
            "templated": True,
            "ny_auth_required": True
        },
        "user:feed": {
            "href": "/api/v1/users/{id}/posts?include_unpublished={true|false}",
            "title": "Create post or view a specified user's posts; unpublished posts are only available to the authenticated author of the post",
            "templated": True,
            "ny_auth_required": True
        },
        "user:post": {
            "href": "/api/v1/users/{id}/posts",
            "title": "Create an unpublished post by a specified user",
            "templated": True,
            "ny_req_method": "PUT",
            "ny_auth_required": True
        },
        "user:existing_post": {
            "href": "/api/v1/users/{id}/posts/{id}",
            "title": "Update or view a specified published user post; posts can only be edited by the authenticated author of the post",
            "templated": True,
            "ny_req_method": "PUT",
            "ny_auth_required": True
        },
        "user:post:existing_comment": {
            "href": "/api/v1/users/{id}/posts/{id}/comments/{id}",
            "title": "Update or view a specified post comment",
            "templated": True,
            "ny_auth_required": True
        },
        "user:existing_account": {
            "href": "/api/v1/users/{id}",
            "title": "Update or view a specified verified user; users can only edited by the authenticated owner of the user account",
            "templated": True,
            "ny_req_method": "PUT",
            "ny_auth_required": True
        },
        "user:account": {
            "href": "/api/v1/users",
            "title": "Create new platform user account"
        },
        "status": {
            "href": "/status",
            "title": "Get the status of the platfrom (i.e. is it down?)"
        },
        "docs": {
            "href": "/api/docs/{semver_version_no}",
            "title": "Platform API documentation, defaults to latest version if no version specified"
        }
    }
}

class HALHyperMediaService():
    api_root = api_root;

    def __init__(self):
        pass;

    def toHAL(self, curie, data):
        pass;
