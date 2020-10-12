from datetime import datetime;
from interfaces.post_repository import IPostRepository;

import os;
import uuid;
import mysql.connector;

# Implements IPostRepository interface for connecting to a MySQL database.
# See interfaces/post_repository for method documentation


class PostMySQLRepository(IPostRepository):
    _table_name = "posts";



    def __init__(self):
        """
        @param (object) self
        @returns (None)
        """
        self._db_connection = mysql.connector.connect(
          host = os.getenv("DATABASE_HOSTNAME"),
          user = os.getenv("DATABASE_USERNAME"),
          password = os.getenv("DATABASE_PASSWORD"),
          database = os.getenv("DATABASE_NAME")
        );


    def create(self, doc):
        db_cursor = self._db_connection.cursor();
        my_uuid = str(uuid.uuid4());
        created_date = datetime.now();
        query = ("INSERT INTO posts (id, user_id, body, created_date) VALUES (%s, %s, %s, %s)");

        doc.update({"id": my_uuid, "created_date": created_date});
        db_cursor.execute(query, (my_uuid, doc["user_id"], doc["body"], doc["created_date"]));
        self._db_connection.commit();
        db_cursor.close();

        return { "id": my_uuid, "created_date": str(created_date) };


    def find_one(self, id):
        db_cursor = self._db_connection.cursor();
        query = ("SELECT posts.*, users.handle FROM posts JOIN users ON posts.user_id = users.id  WHERE posts.id = '{}'".format(id));

        db_cursor.execute(query);
        result = db_cursor.fetchall();

        return list(map(lambda p: self.on_read_post(p), result));


    def find_all(self):
        post_list = []
        db_cursor = self._db_connection.cursor();
        db_cursor.execute("SELECT posts.id, posts.user_id, posts.body, posts.comment_count, posts.like_count, posts.sequence_no, posts.created_date, users.handle FROM posts JOIN users ON posts.user_id = users.id");
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


    def get_total_post_count(self):
        db_cursor = self._db_connection.cursor();
        query = ("SELECT COUNT(*) from posts");

        db_cursor.execute(query);
        result = db_cursor.fetchone();
        db_cursor.close();

        return {"count": result};


    def get_batch_by_sequence_no(self, starting_with, ending_with, batch_size):
        post_list = [];
        db_cursor = self._db_connection.cursor();
        query = ("SELECT * from posts WHERE sequence_no >= {} AND sequence_no <= {} ORDER BY sequence_no DESC LIMIT {}".format(ending_with, starting_with, batch_size));

        db_cursor.execute(query);
        result = db_cursor.fetchall();

        for post in result:
          post_list.append(self.on_read_post(post));

        db_cursor.close();

        return post_list;


    def get_recent_posts(self):
        post_list = [];
        db_cursor = self._db_connection.cursor();
        query = ("SELECT posts.*, users.handle from posts JOIN users ON posts.user_id = users.id WHERE is_published = 1 ORDER BY sequence_no DESC LIMIT 35");

        db_cursor.execute(query);
        result = db_cursor.fetchall();

        for post in result:
          post_list.append(self.on_read_post(post));

        db_cursor.close();

        return post_list;


    def mark_as_published(self, id):
        db_cursor = self._db_connection.cursor();
        query = ("UPDATE posts SET is_published = 1 WHERE id = '{}'".format(id));

        db_cursor.execute(query);
        self._db_connection.commit();
        db_cursor.close();


    def on_read_post(self, record):
        return {
          "id": record[0],
          "user_id": record[1],
          "author": record[2],
          "body": record[3],
          "comment_count": record[4],
          "like_count": record[5],
          "sequence_no": record[6],
          "created_date": record[7]
        }

####PostMySQLRepository###