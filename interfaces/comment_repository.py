class ICommentRepository():

  #Repository interface for Nicely user `comments`

  def __init__(self, myImpl):

    self._name = "comments_repo";
    self._create = myImpl.create;
    self._find_one = myImpl.find_one;
    self._find_all_comments = myImpl.find_all_comments;
    self._update_comment = myImpl.update_comment;


  def create(self, doc):

    """
    Creates a new comment in the data store.
    @param (object) self
    @param (dict) doc - dictionary representing a valid entry
    @returns (str) - a uuid for the new post
    """
    return self._create(doc);


  def find_one(self, id):
    """
    Finds a comment in the data store by its uuid.
    @param (str) id - uuid of the post
    @returns (dict) - the requested post
    """
    return self._find_one(id);


  def find_all_comments(self):
    """
    Finds all comments in the data store
    @returns (list) - a list of all records in the data store
    """
    return self._find_all_comments();


  def update(self, id, doc):
    """
    Update a comment in the data store by its uuid.
    @param (str) id - uuid of the post
    @param (doc) doc - the update document
    @returns (None)
    """
    return self._update_comment(id, doc);




####ICommentRepository####