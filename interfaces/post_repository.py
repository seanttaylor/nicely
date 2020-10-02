from abc import ABC, abstractmethod;

class IPostRepository(ABC):

    def __init__(self):
        super().__init__();


    @abstractmethod
    def create(self, doc):
        """
        Creates a new post in the data store.
        @param (object) self
        @param (dict) doc - dictionary representing a valid entry
        @returns (str) - a uuid for the new post
        """
        pass;


    @abstractmethod
    def find_one(self, id):
        """
        Finds a post in the data store by its uuid.
        @param (str) id - uuid of the post
        @returns (dict) - the requested post
        """
        pass;


    @abstractmethod
    def find_all(self):
        """
        Finds all posts in the data store
        @returns (list) - a list of all records in the data store
        """
        pass;


    @abstractmethod
    def edit_post(self, id, text):
        """
        Update a post in the data store by its uuid.
        @param (str) id - uuid of the post
        @param (str) text - the update text
        @returns (None)
        """
        pass;


    @abstractmethod
    def incr_comment_count(self, post_id):
        """
        Increments the `comment_count` of a user post.
        @param (self)
        @param (post_id) - uuid of the post to increment `comment_count` field on
        @returns (None)
        """

        pass;


    @abstractmethod
    def delete(self, id):
        """
        Deletes a post in the data store by its uuid.
        @param (str) id - uuid of the post
        @returns (None)
        """
        pass;

####IPostRepository####