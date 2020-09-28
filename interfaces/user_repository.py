from abc import ABC, abstractmethod;

class IUserRepository(ABC):

  def __init__(self):
    super().__init__();


  @abstractmethod
  def create(self, doc):
    """
    Creates a new user in the data store.
    @param (object) self
    @param (dict) doc - dictionary representing a valid entry
    @returns (str) - a uuid for the new user
    """
    pass;


  @abstractmethod
  def find_one(self, id):
    """
    Finds a user in the data store by its uuid.
    @param (str) id - uuid of the user
    @returns (dict) - the requested user
    """
    pass;


  @abstractmethod
  def find_all(self):
    """
    Finds all users in the data store
    @returns (list) - a list of all records in the data store
    """
    pass;


  @abstractmethod
  def edit_name(self, id, doc):
    """
    Update user['first_name] and/or ['last_name'] properties
    @param (str) id - uuid of the usr
    @param (dict) doc - dictionary containing user first_name and last_name
    @returns (None)
    """
    pass;


  @abstractmethod
  def edit_motto(self, id, doc):
    """
    Update user['motto'] property
    @param (str) id - uuid of the usr
    @param (dict) doc - dictionary containing user first_name and last_name
    @returns (None)
    """
    pass;


  @abstractmethod
  def delete(self, id):
    """
    Deletes a user in the data store by its uuid.
    @param (str) id - uuid of the user
    @returns (None)
    """
    pass;

####IPostRepository####