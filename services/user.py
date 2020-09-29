import urllib.request;
import pprint;

pp = pprint.PrettyPrinter(indent=2);

class User():

  def __init__(self, repo, doc):
    self._data = doc;
    self._repo = repo;
    self._data["is_verified"] = False;


  def __str__(self):
    pp.pprint({
      "id": self._id,
      "created_date": self._data["created_date"],
      "last_modified": self._data["last_modified"],
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


####User####


class UserService():

  # Manages collection operations on `User` objects

  def __init__(self, repo, validator):
    self._repo = repo;
    self._validator = validator;
    self._User = User;


  def create_user(self, **kwargs):
    self._validator.validate(kwargs);
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


####UserService####

class UserValidator():

  # Provides validation logic for `User` objects.
  # TODO: Actually add user validation logic
  def __init__(self, config):
    self._config = config;

  def validate(self, user_data):
    pass;


####UserValidator####



