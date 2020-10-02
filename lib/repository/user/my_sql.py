from datetime import datetime;
from interfaces.user_repository import IUserRepository;

import os;
import uuid;
import mysql.connector;

# Implements IPostRepository interface for connecting to a MySQL database.
# See interfaces/post_repository for method documentation


class UserMySQLRepository(IUserRepository):
    _table_name = "users";

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
        query = ("INSERT INTO users (id, handle, email_address, motto, phone_number,  first_name, last_name, created_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)");

        doc.update({"id": my_uuid, "created_date": created_date});
        db_cursor.execute(query, (
            my_uuid,
            doc["handle"],
            doc["email_address"],
            doc["motto"],
            doc["phone_number"],
            doc["first_name"],
            doc["last_name"],
            created_date
        ));
        self._db_connection.commit();
        db_cursor.close();

        return { "id": my_uuid, "created_date": str(created_date) };


    def find_one(self, id):
        db_cursor = self._db_connection.cursor();
        query = ("SELECT * FROM users WHERE id = '{}'".format(id));

        db_cursor.execute(query);
        result = db_cursor.fetchall();

        return list(map(lambda p: self.on_read_user(p), result));


    def find_all(self):
        user_list = []
        db_cursor = self._db_connection.cursor();
        db_cursor.execute("SELECT id, handle, email_address, motto, is_verified, first_name, last_name, created_date FROM users");
        result = db_cursor.fetchall();

        for user in result:
            user_list.append(self.on_read_user(user));

        return user_list;


    def edit_motto(self, id, text):
        db_cursor = self._db_connection.cursor();
        last_modified = datetime.now();
        query = ("UPDATE users SET motto = '{}', last_modified = '{}' WHERE id = '{}'".format(text, last_modified, id));

        db_cursor.execute(query);
        self._db_connection.commit();
        db_cursor.close();

        return { "id": id, "last_modified": str(last_modified) };


    def edit_name(self, id, doc):
        db_cursor = self._db_connection.cursor();
        last_modified = datetime.now();
        query = ("UPDATE users SET first_name = '{}', last_name = '{}', last_modified = '{}' WHERE id = '{}'".format(
            doc["first_name"],
            doc["last_name"],
            last_modified,
            id
        ));

        db_cursor.execute(query);
        self._db_connection.commit();
        db_cursor.close();

        return { "id": id, "last_modified": str(last_modified) };


    def edit_phone_number(self, id, phone_number):
        db_cursor = self._db_connection.cursor();
        last_modified = datetime.now();
        query = ("UPDATE users SET phone_number = '{}', last_modified = '{}' WHERE id = '{}'".format(
            phone_number,
            last_modified,
            id
        ));

        db_cursor.execute(query);
        self._db_connection.commit();
        db_cursor.close();

        return { "id": id, "last_modified": str(last_modified) };


    def delete(self, id):
        pass;


    def on_read_user(self, record):
        return {
          "id": record[self._field_map["id"]],
          "handle": record[self._field_map["handle"]],
          "motto": record[self._field_map["motto"]],
          "email_address": record[self._field_map["email_address"]],
          "is_verified": record[self._field_map["is_verified"]],
          "first_name": record[self._field_map["first_name"]],
          "last_name": record[self._field_map["last_name"]],
          "created_date": record[self._field_map["created_date"]]
        }

####PostMySQLRepository###