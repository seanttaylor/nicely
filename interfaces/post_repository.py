class IPostRepository():

  #Repository interface for Nicely user `posts`

  def __init__(self, myImpl):

    self._name = "myRepo";
    self._create = myImpl.create;
    self._find_one = myImpl.find_one;
    self._find_all = myImpl.find_all;
    self._edit_post = myImpl.edit_post;
    self._delete = myImpl.delete;
    self._incr_comment_count = myImpl.incr_comment_count;


  def create(self, doc):
    """
    Creates a new post in the data store.
    @param (object) self
    @param (dict) doc - dictionary representing a valid entry
    @returns (str) - a uuid for the new post
    """
    return self._create(doc);


  def find_one(self, id):
    """
    Finds a post in the data store by its uuid.
    @param (str) id - uuid of the post
    @returns (dict) - the requested post
    """
    return self._find_one(id);


  def find_all(self):
    """
    Finds all posts in the data store
    @returns (list) - a list of all records in the data store
    """
    return self._find_all();


  def edit_post(self, id, text):
    """
    Update a post in the data store by its uuid.
    @param (str) id - uuid of the post
    @param (str) text - the update text
    @returns (None)
    """
    return self._edit_post(id, text);


  def incr_comment_count(self, post_id):
    """
    Increments the `comment_count` of a user post.
    @param (self)
    @param (post_id) - uuid of the post to increment `comment_count` field on
    @returns (None)
    """

    self._incr_comment_count(post_id);


  def delete(self, id):
    """
    Deletes a post in the data store by its uuid.
    @param (str) id - uuid of the post
    @returns (None)
    """
    return self._delete(id);

####IPostRepository####