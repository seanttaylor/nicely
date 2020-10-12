import re;
import urllib.request;
import pprint;
from services.exceptions import UserServiceException;

pp = pprint.PrettyPrinter(indent=2);

class User():

    def __init__(self, repo, doc):
        self._data = doc;
        self._repo = repo;
        self._id = doc.get("id", None);
        self._data["is_verified"] = doc.get("is_verified", None);
        self._data["motto"] = doc.get("motto", None);


    def __str__(self):
        pp.pprint({
          "id": self._id,
          "created_date": self._data["created_date"],
          "last_modified": self._data.get("last_modified", None),
          "data": {
            "motto": self._data["motto"],
            "handle": self._data["handle"],
            "first_name": self._data["first_name"],
            "last_name": self._data["last_name"],
            "email_address": self._data["email_address"],
            "is_verified": self._data["is_verified"]
          }
        });
        return "####"


    def save(self):
        """
        Saves a new user to the data store.
        @param (object) self
        @returns (str) - a uuid for the new user
        """
        user = self._repo.create({
          "handle": self._data["handle"],
          "email_address": self._data["email_address"],
          "motto": self._data["motto"],
          "phone_number": self._data["phone_number"],
          "first_name": self._data["first_name"],
          "last_name": self._data["last_name"]
        });
        self._id = user["id"];
        self._data["created_date"] = user["created_date"];
        self._data["last_modified"] = None;

        return user["id"];


    def edit_name(self, **kwargs):
        """
        Edit first_name and/or last_name on an existing user in the data store.
        @param (object) self
        @param (str) first_name - updated first name
        @param (str) last_name - updated last name
        @returns (None)
        """

        #The second argument to `get` returns a default value if key is not found.
        self._data["first_name"] = kwargs.get("first_name", self._data["first_name"]);
        self._data["last_name"] = kwargs.get("last_name", self._data["last_name"]);

        user = self._repo.edit_name(self._id, {
          "first_name": self._data["first_name"],
          "last_name": self._data["last_name"]
        });

        self._id = user["id"];
        self._data["last_modified"] = user["last_modified"];

        return user["id"];



    def edit_phone_number(self, phone_number):
        """
        Edit phone_number property of an existing user in the data store.
        @param (object) self
        @param (str) phone_number - a telephone number
        @returns (None)
        """

        if phone_number: self._data["phone_number"] = phone_number;

        user = self._repo.edit_phone_number(self._id, self._data["phone_number"]);

        self._id = user["id"];
        self._data["last_modified"] = user["last_modified"];

        return user["id"];


    def edit_motto(self, motto_text):
        """
        Edit phone_number property of an existing user in the data store.
        @param (object) self
        @param (str) phone_number - a telephone number
        @returns (None)
        """

        if motto_text: self._data["motto"] = motto_text;

        user = self._repo.edit_motto(self._id, self._data["motto"]);

        self._id = user["id"];
        self._data["last_modified"] = user["last_modified"];

        return user["id"];


    def follow_user(self, target_user):
        """
        Subscribe the current user to the feed of another user on the platform
        @param (object) self
        @param (User) target_user - an instance of the User class; the user to be followed
        @returns (None)
        """

        self._repo.create_subscription(self._id, target_user._id);


    def is_following(self, target_user):
        """
        Indicates whether the current instance of User follows a user specified (i.e. target_user)
        @param (object) self
        @param (User) target_user - an instance of the User class; the user being inquired about
        @return (bool)
        """
        return self._repo.subscription_exists(self._id, target_user._id) == 1


    def get_followers(self):
        """
        Returns a list of the users following the current user
        @param (object) self
        @return (list)
        """
        users = self._repo.get_subscribers_of(self._id);
        return list(map(lambda u: User(self._repo, u), users))


    def follows(self):
        """
        Returns a list of users the current user is following
        @param (object) self
        @return (list)
        """
        users = self._repo.get_user_subscriptions(self._id);
        return list(map(lambda u: User(self._repo, u), users))


####User####


class UserService():

    def __init__(self, repo, validator):
        self._repo = repo;
        self._validator = validator;
        self._User = User;


    def create_user(self, **kwargs):
        self._validator.validate(self, kwargs);
        return self._User(
          self._repo,
          kwargs
        );


    def find_user_by_id(self, id):
        user = self._repo.find_one(id)[0];
        return [self._User(self._repo, user)];


    def find_all_users(self):
        users = self._repo.find_all();
        return list(map(lambda u: self._User(self._repo, u), users));


    def delete_user(self, id):
        return self._repo.delete(id);


    def user_exists(self, id):
        result = self._repo.find_one(id);
        return len(result) == 1 and result[0]["id"] == id;


    def email_address_exists(self, email_address):
        result = self._repo.find_one_by_email(email_address);
        return len(result) == 1 and result[0]["email_address"] == email_address;


    def handle_exists(self, handle):
        result = self._repo.find_one_by_handle(handle);
        return len(result) == 1 and result[0]["handle"] == handle;


####UserService####

class UserValidator():

    def __init__(self, config):
        self._config = config;
        self._email_regex = config["email_regex"];
        self._handle_regex = config["handle_regex"];

    def validate(self, user_service, user_data):
        if len(user_data.keys()) == 0:
            raise UserServiceException(error_type="UserDataEmpty");

        if "email_address" not in user_data:
            raise UserServiceException(error_type="MissingOrInvalidEmail.Missing");

        if "phone_number" not in user_data:
            raise UserServiceException(error_type="MissingOrInvalidPhone");

        if "first_name" not in user_data:
            raise UserServiceException(error_type="MissingOrInvalidFirstName");

        if "last_name" not in user_data:
            raise UserServiceException(error_type="MissingOrInvalidLastName");

        if "handle" not in user_data:
            raise UserServiceException(error_type="MissingOrInvalidHandle");

        if user_service.handle_exists(user_data["handle"]) == True: raise UserServiceException(error_type="MissingOrInvalidHandle.HandleExists");

        if len(re.findall(self._handle_regex, user_data["handle"])) != 1: raise UserServiceException(error_type="MissingOrInvalidHandle.Format");

        if user_service.email_address_exists(user_data["email_address"]) == True: raise UserServiceException(error_type="MissingOrInvalidEmail.EmailExists");

        if len(re.findall(self._email_regex, user_data["email_address"])) != 1: raise UserServiceException(error_type="MissingOrInvalidEmail.Format");


####UserValidator####



