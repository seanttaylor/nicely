from datetime import datetime;
from interfaces.comment_repository import ICommentRepository;

import os;
import uuid;
import mysql.connector;

# Implements ICommentRepository interface for connecting to a MySQL database.
# See interfaces/comment_repository for method documentation


class CommentMySQLRepository(ICommentRepository):
    _table_name = "comments";


    def __init__(self, field_map):
        """
        @param (object) self
        @param (dict) field_map - Map of fields returned for database queries returned from MySQL connector; used to create an instance of a specific class after the raw data is fetched from the database.
        @returns (None)
        """
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
        query = ("INSERT INTO comments (id, post_id, user_id, body, created_date) VALUES (%s, %s, %s, %s, %s)");

        doc.update({"id": my_uuid, "created_date": created_date});
        db_cursor.execute(query, (my_uuid, doc["post_id"], doc["user_id"], doc["body"], doc["created_date"]));
        self._db_connection.commit();
        db_cursor.close();

        return { "id": my_uuid, "created_date": str(created_date) };


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


    def edit_comment(self, id, text):
        db_cursor = self._db_connection.cursor();
        last_modified = datetime.now();
        query = ("UPDATE comments SET body = '{}', last_modified = '{}' WHERE id = '{}'".format(text, id, last_modified));

        db_cursor.execute(query);
        self._db_connection.commit();
        db_cursor.close();

        return { "id": id, "last_modified": str(last_modified) };


    def incr_like_count(self, id):
        db_cursor = self._db_connection.cursor();
        query = ("UPDATE comments SET like_count = like_count + 1 WHERE id = '{}'".format(id));

        db_cursor.execute(query);
        self._db_connection.commit();
        db_cursor.close();


    def on_read_comment(self, record):
        return {
          "id": record[self._field_map["id"]],
          "post_id": record[self._field_map["post_id"]],
          "user_id": record[self._field_map["user_id"]],
          "body": record[self._field_map["body"]],
          "like_count": record[self._field_map["like_count"]],
          "created_date": record[self._field_map["created_date"]]
        }

####CommentMySQLRepository###