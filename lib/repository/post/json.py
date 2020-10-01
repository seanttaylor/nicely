from datetime import datetime;
import uuid;
import json;

# Implements IRepository interface for reading/writing posts to a JSON file.
# See interfaces/post_repository for method documentation


class PostJSONRepository():

    def __init__(self, file_path="data.json"):
        self._file_path = file_path;
        with open(file_path, "r") as json_file:
            self._db = json.load(json_file);


    def create(self, doc):
        my_uuid = str(uuid.uuid4());

        self._db[my_uuid] = {
          "id": my_uuid,
          "createdDate": str(datetime.now()),
          "lastModified": "n/a",
          "doc": doc
        };

        self.save_to_json_file();
        return my_uuid;


    def find_one(self, id):
        return self._db[id];


    def find_all(self):
        return self._db.values();


    def update(self, id, doc):
        self._db[id]["doc"].update(doc);
        self._db[id].update({"lastModified": str(datetime.now())});
        self.save_to_json_file();


    def incr_comment_count(self, post_id):
        pass;


    def delete(self, id):
        del self._db[id];
        self.save_to_json_file();


    def save_to_json_file(self):
        doc = json.dumps(self.__db, indent=2);
        with open(self._file_path, "w") as json_file:
            json_file.write(doc);



####PostJSONRepository####