from abc import ABC, abstractmethod;

class IEventEmitter():

    def __init__(self):
         super.__init__();


    @abstractmethod
    def on(self, event_name, event_handler):
        """
        Register a new event with its handler
        @param (object) self
        @param (str) event_name - name of the event
        @param (function) event_handler - the function to call when the event is emitted
        @returns (None)
        """
        pass;


    @abstractmethod
    def remove_listener(self, event_name):
        """
        De-registers an existing event listener
        @param (object) self
        @param (str) event_name - name of the event
        @returns (None)
        """
        pass;


    @abstractmethod
    def emit(self, event_name, event_data):
        """
        Fires the specified event (i.e. calls the associated function) with any data
        @param (object) self
        @param (str) event_name - name of the event
        @param (dict) event_data - arbitrary data associated with the event
        @returns (None)
        """
        pass;


