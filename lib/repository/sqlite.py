from datetime import datetime;
import uuid;
import sqlite3;

class SQLite3Repository():
  _table_name = "";

  def __init__(self, database_file_path):
    #TODO: check if database file exists
    self._conn = sqlite3.connect(database_file_path);

  def create(self, doc):
    my_uuid = str(uuid.uuid4());
    self._conn.execute("INSERT INTO {} (body, author) VALUES({}, {})".format(self._table_name, doc["body"], doc["author"]));
    return my_uuid;

  def find_one(self, id):
    pass;

  def find_all(self):
    pass;

  def update(self, id, doc):
    pass;
    ##self.__store[id]["doc"].update(doc);
    ##self.__store[id].update({"lastModified": str(datetime.now())});

  def delete(self, id):
    pass;

####SQLite3Repository###