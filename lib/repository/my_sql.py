from datetime import datetime;
import os;
import uuid;
import mysql.connector;

class MySQLRepository():
  _table_name = "posts";

  def __init__(self):
    self._db_connection = mysql.connector.connect(
      host = os.getenv("DATABASE_HOSTNAME"),
      user = os.getenv("DATABASE_USERNAME"),
      password = os.getenv("DATABASE_PASSWORD"),
      database = os.getenv("DATABASE_NAME")
    )

  def create(self, doc):
    db_cursor = self._db_connection.cursor();
    my_uuid = str(uuid.uuid4());
    created_date = datetime.now();
    query = ("INSERT INTO posts (id, author, body, created_date) VALUES (%s, %s, %s, %s)");

    doc.update({"id": my_uuid, "created_date": created_date});
    db_cursor.execute(query, (my_uuid, doc["author"], doc["body"], doc["created_date"]));
    self._db_connection.commit();

    return my_uuid;

  def find_one(self, id):
    pass;

  def find_all(self):
    post_list = []
    db_cursor = self._db_connection.cursor();
    db_cursor.execute("SELECT * FROM posts");
    result = db_cursor.fetchall();

    for post in result:
      post_list.append(self.on_read_post(post));

    return post_list;


  def update(self, id, doc):
    pass;
    ##self.__store[id]["doc"].update(doc);
    ##self.__store[id].update({"lastModified": str(datetime.now())});

  def delete(self, id):
    pass;



  def on_read_post(self, post_record):
    return {
      "id": post_record[0],
      "author": post_record[1],
      "body": post_record[2],
      "created_date": post_record[3]
    }

####SQLite3Repository###