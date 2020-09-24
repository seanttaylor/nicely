from datetime import datetime;
import os;
import uuid;
import mysql.connector;

#Implements ICommentRepository interface for connecting to a MySQL database.

class CommentMySQLRepository():
  _table_name = "comments";

  """
  @param (object) self
  @param (dict) field_map - Map of fields returned for database queries returned from MySQL connector; used to create an instance of a specific class after the raw data is fetched from the database.
  @returns (None)
  """

  def __init__(self, field_map):
    self._db_connection = mysql.connector.connect(
      host = os.getenv("DATABASE_HOSTNAME"),
      user = os.getenv("DATABASE_USERNAME"),
      password = os.getenv("DATABASE_PASSWORD"),
      database = os.getenv("DATABASE_NAME")
    );
    self._field_map = field_map;


  def create(self, doc):
    db_cursor = self._db_connection.cursor();
    my_uuid = str(uuid.uuid4());
    created_date = datetime.now();
    query = ("INSERT INTO comments (id, post_id, author, body, created_date) VALUES (%s, %s, %s, %s, %s)");

    doc.update({"id": my_uuid, "created_date": created_date});
    db_cursor.execute(query, (my_uuid, doc["post_id"], doc["author"], doc["body"], doc["created_date"]));
    self._db_connection.commit();
    db_cursor.close();

    return my_uuid;


  def find_one(self, id):
    db_cursor = self._db_connection.cursor();
    query = ("SELECT * FROM posts WHERE id = '{}'".format(id));

    db_cursor.execute(query);
    result = db_cursor.fetchall();

    return list(map(lambda c: self.on_read_comment(c), result));


  def find_all_comments(self):
    comment_list = []
    db_cursor = self._db_connection.cursor();
    db_cursor.execute("SELECT * FROM comments");
    result = db_cursor.fetchall();

    for comment in result:
      comment_list.append(self.on_read_comment(comment));

    return comment_list;


  def update_comment(self, id, doc):
    pass;
    ##self.__store[id]["doc"].update(doc);
    ##self.__store[id].update({"lastModified": str(datetime.now())});


  def on_read_comment(self, record):
    return {
      "id": record[self._field_map["id"]],
      "post_id": record[self._field_map["post_id"]],
      "author": record[self._field_map["author"]],
      "body": record[self._field_map["body"]],
      "created_date": record[self._field_map["created_date"]]
    }

####CommentMySQLRepository###