from datetime import datetime;
import uuid;

class InMemoryRepository():
  __store = {};

  def create(self, doc):
    my_uuid = str(uuid.uuid4());

    self.__store[my_uuid] = {
      "id": my_uuid,
      "createdDate": str(datetime.now()),
      "lastModified": "n/a",
      "doc": doc 
    };
    return my_uuid;

  def find_one(self, id):
    return self.__store[id];

  def find_all(self):
    return self.__store.values();

  def update(self, id, doc):
    self.__store[id]["doc"].update(doc);
    self.__store[id].update({"lastModified": str(datetime.now())});

  def delete(self, id):
    del self.__store[id];

####InMemoryRepository####