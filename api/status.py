from flask import Blueprint, abort, jsonify;
import os, json;


def StatusAPIBlueprintFactory(**kwargs):
    status_api = Blueprint("status_api", __name__);
    hal_service = kwargs["hypermedia"];

    @status_api.route("/status")
    def on_get_status():
        response = {
            **hal_service.api_root,
            "STATUS": "OK",
            "COMMIT": os.getenv("FAKE_COMMIT_HASH")
        }
        return json.dumps(response);

    return status_api;
