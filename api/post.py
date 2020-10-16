from services.post import PostService;
from flask import Blueprint, abort, jsonify, request;
import json;


def PostAPIBlueprintFactory(**kwargs):
    PostService = kwargs["service"];
    hal_service = kwargs["hypermedia_service"];
    post_api = Blueprint("post_api", __name__);

    @post_api.route("/api/v1/feed", methods=["GET"])
    def on_get_feed():
        post_list = PostService.find_all_posts();
        post_list_json = list(map(lambda p: p.toJSON(), post_list));
        payload = {
            "entries": len(post_list_json),
            "data": post_list_json
        };
        
        return (json.dumps(hal_service.toHAL(curie="feed:posts", data=payload)), {"content-type": "application/hal+json"});
        #return (json.dumps(payload), {"content-type": "application/json"});


    @post_api.route("/api/v1/users/<user_id>/posts", methods=["GET", "POST"])
    def on_create_post():
        post_list = PostService.find_all_posts();
        post_list_json = list(map(lambda p: p.toJSON(), post_list));
        return jsonify({
            "entries": len(post_list_json),
            "data": post_list_json
        });


    @post_api.route("/api/v1/users/<user_id>/posts/<post_id>", methods=["GET","PUT"])
    def on_get_or_update_post_by_id(post_id):
        if request.method == "GET":
            post_list = PostService.find_post_by_id(post_id);
            post_list_json = list(map(lambda p: p.toJSON(), post_list));
            return jsonify({
                "entries": len(post_list_json),
                "data": post_list_json
            });
        # data = request.get_json()
        # post_list = PostService.find_post_by_id(post_id);
        # post = post_list[0]
        # post.edit(data);


    return post_api;

