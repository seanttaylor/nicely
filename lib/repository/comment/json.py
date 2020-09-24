from datetime import datetime;
import uuid;
import json;

# Implements IRepository interface for reading/writing comments to a JSON file.
# See interfaces/comment_repository for method documentation


class CommentJSONRepository():

  def __init__(self, file_path="data.json"):
    self.__file_path = file_path;
    with open(file_path, "r") as json_file:
      self.__db = json.load(json_file);


  def create(self, doc):
    my_uuid = str(uuid.uuid4());

    self.__db[my_uuid] = {
      "id": my_uuid,
      "createdDate": str(datetime.now()),
      "lastModified": "n/a",
      "doc": doc
    };

    self.save_to_json_file();
    return my_uuid;


  def find_one(self, id):
    return self.__db[id];


  def find_all(self):
    return self.__db.values();


  def update_comment(self, id, doc):
    #self.__db[id]["doc"].update(doc);
    #self.__db[id].update({"lastModified": str(datetime.now())});
    #self.save_to_json_file();
    pass;


  def save_to_json_file(self):
    doc = json.dumps(self.__db, indent=2);
    with open(self.__file_path, "w") as json_file:
      json_file.write(doc);



####JSONRepository####