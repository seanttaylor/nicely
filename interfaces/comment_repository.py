from abc import ABC, abstractmethod;

class ICommentRepository(ABC):

    def __init__(self):
        super.__init__();


    @abstractmethod
    def create(self, doc):
        """
        Creates a new comment in the data store.
        @param (object) self
        @param (dict) doc - dictionary representing a valid entry
        @returns (str) - a uuid for the new post
        """
        pass;

    @abstractmethod
    def find_one(self, id):
        """
        Finds a comment in the data store by its uuid.
        @param (str) id - uuid of the post
        @returns (dict) - the requested post
        """
        pass;


    @abstractmethod
    def find_all_comments(self):
        """
        Finds all comments in the data store
        @returns (list) - a list of all records in the data store
        """
        pass;


    @abstractmethod
    def incr_like_count(self, comment_id):
        """
        Increments `like_count` property of a comment in the data store
        @param (str) comment_id - uuid of comment['like_count'] to increment
        @returns (None)
        """
        pass;


    @abstractmethod
    def edit_comment(self, id, doc):
        """
        Update a comment in the data store by its uuid.
        @param (str) id - uuid of the post
        @param (dict) doc - the update document
        @returns (None)
        """
        pass;


####ICommentRepository####