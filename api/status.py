from flask_restful import Resource;
from flask import jsonify;
import os;

class StatusAPI(Resource):
    def get(self):
        return jsonify({
            "STATUS": "OK",
            "COMMIT": os.getenv("FAKE_COMMIT_HASH")
        })
