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
    @returns (None)
    """

    def __init__(self):
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
        query = ("INSERT INTO users (id, handle, email_address, motto, phone_number, first_name, last_name, created_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)");

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
        query = ("SELECT id, handle, email_address, motto, is_verified, first_name, last_name, follower_count, created_date FROM users WHERE id = '{}'".format(id));

        db_cursor.execute(query);
        result = db_cursor.fetchall();

        return list(map(lambda p: self.on_read_user(p), result));


    def find_one_by_email(self, email_address):
        db_cursor = self._db_connection.cursor();
        query = ("SELECT id, handle, email_address, motto, is_verified, first_name, last_name, follower_count, created_date FROM users WHERE email_address = '{}'".format(email_address));

        db_cursor.execute(query);
        result = db_cursor.fetchall();

        return list(map(lambda p: self.on_read_user(p), result));


    def find_one_by_handle(self, handle):
        db_cursor = self._db_connection.cursor();
        query = ("SELECT id, handle, email_address, motto, is_verified, first_name, last_name, follower_count, created_date FROM users WHERE handle = '{}'".format(handle));

        db_cursor.execute(query);
        result = db_cursor.fetchall();

        return list(map(lambda p: self.on_read_user(p), result));


    def find_all(self):
        user_list = []
        db_cursor = self._db_connection.cursor();
        db_cursor.execute("SELECT id, handle, email_address, motto, is_verified, first_name, last_name, follower_count, created_date FROM users");
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


    def create_subscription(self, current_user_id, target_user_id):
        try:
            db_cursor = self._db_connection.cursor();
            insert_subscription = ("INSERT INTO user_followers (user_id, follower_id) VALUES(%s, %s)");
            increment_follower_count = ("UPDATE users SET follower_count = follower_count + 1 WHERE id = '{}'".format(target_user_id));

            db_cursor.execute(insert_subscription, (target_user_id, current_user_id));
            db_cursor.execute(increment_follower_count);
            self._db_connection.commit();

        except mysql.connector.Error as transaction_error:
            self._db_connection.rollback();
            print("TransactionError: {}".format(transaction_error));
        finally:
            db_cursor.close();


    def subscription_exists(self, current_user_id, target_user_id):
        db_cursor = self._db_connection.cursor();
        query = ("SELECT COUNT(*) FROM user_followers WHERE user_id = '{}' AND follower_id = '{}'".format(target_user_id, current_user_id));
        db_cursor.execute(query);

        result = db_cursor.fetchall();
        db_cursor.close();

        return result[0][0];


    def get_subscribers_of(self, current_user_id):
        user_list = [];
        db_cursor = self._db_connection.cursor();
        query = ("SELECT users.id, users.handle, users.email_address, users.motto, users.is_verified, users.first_name, users.last_name, users.follower_count, users.created_date, user_followers.* FROM user_followers JOIN users ON user_followers.follower_id = users.id WHERE user_followers.user_id = '{}'".format(current_user_id));
        db_cursor.execute(query);

        result = db_cursor.fetchall();
        db_cursor.close();

        for user in result:
            user_list.append(self.on_read_user(user));

        return user_list;


    def get_user_subscriptions(self, current_user_id):
        user_list = [];
        db_cursor = self._db_connection.cursor();
        query = ("SELECT users.*, user_followers.* FROM user_followers JOIN users ON user_followers.user_id = users.id WHERE user_followers.follower_id = '{}'".format(current_user_id));
        db_cursor.execute(query);

        result = db_cursor.fetchall();
        db_cursor.close();

        for user in result:
            user_list.append(self.on_read_user(user));

        return user_list;


    def delete(self, id):
        pass;


    def on_read_user(self, record):
        return {
          "id": record[0],
          "handle": record[1],
          "email_address": record[2],
          "motto": record[3],
          "is_verified": record[4],
          "first_name": record[5],
          "last_name": record[6],
          "follower_count": record[7],
          "created_date": record[8]
        }

####PostMySQLRepository###