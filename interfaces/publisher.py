from abc import ABC, abstractmethod;

class IPublisher(ABC):
  #Interface for creating services that can publish posts to assorted media

    def __init__(self):
        super().__init__();


    @abstractmethod
    def publish(self, post):
        """
        Sends a newly published post to a specified feed in the implementation
        @param (object) self
        @param (Post) post - an instance of the Post class
        @returns (None)
        """
        pass;



####IPublishService####