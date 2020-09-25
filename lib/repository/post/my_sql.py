from datetime import datetime;
from interfaces.post_repository import IPostRepository;

import os;
import uuid;
import mysql.connector;

# Implements IPostRepository interface for connecting to a MySQL database.
# See interfaces/post_repository for method documentation


class PostMySQLRepository(IPostRepository):
  _table_name = "posts";

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
    query = ("INSERT INTO posts (id, author, body, created_date) VALUES (%s, %s, %s, %s)");

    doc.update({"id": my_uuid, "created_date": created_date});
    db_cursor.execute(query, (my_uuid, doc["author"], doc["body"], doc["created_date"]));
    self._db_connection.commit();
    db_cursor.close();

    return { "id": my_uuid, "created_date": str(created_date) };


  def find_one(self, id):
    db_cursor = self._db_connection.cursor();
    query = ("SELECT * FROM posts WHERE id = '{}'".format(id));

    db_cursor.execute(query);
    result = db_cursor.fetchall();

    return list(map(lambda p: self.on_read_post(p), result));


  def find_all(self):
    post_list = []
    db_cursor = self._db_connection.cursor();
    db_cursor.execute("SELECT * FROM posts");
    result = db_cursor.fetchall();

    for post in result:
      post_list.append(self.on_read_post(post));

    return post_list;


  def edit_post(self, id, text):
    db_cursor = self._db_connection.cursor();
    last_modified = datetime.now();
    query = ("UPDATE posts SET body = '{}', last_modified = '{}' WHERE id = '{}'".format(text, id, last_modified));

    db_cursor.execute(query);
    self._db_connection.commit();
    db_cursor.close();

    return { "id": id, "last_modified": str(last_modified) };


  def delete(self, id):
    pass;


  def incr_comment_count(self, id,):
    db_cursor = self._db_connection.cursor();
    query = ("UPDATE posts SET comment_count = comment_count + 1 WHERE id = '{}'".format(id));

    db_cursor.execute(query);
    self._db_connection.commit();
    db_cursor.close();


  def on_read_post(self, record):
    return {
      "id": record[self._field_map["id"]],
      "author": record[self._field_map["author"]],
      "body": record[self._field_map["body"]],
      "comment_count": record[self._field_map["comment_count"]],
      "like_count": record[self._field_map["like_count"]],
      "created_date": record[self._field_map["created_date"]]
    }

####PostMySQLRepository###