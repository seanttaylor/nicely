from interfaces.event_emitter import IEventEmitter;
from pubsub import pub;

class EventEmitter(IEventEmitter):
    # Implements IEventEmitter interface publish/subscribe behavior
    # See interfaces/event_emitter for method documentation

    def __init__(self):
        pass;

    def on(self, event_name, event_handler):
        """
        [NOTE]: event handler functions **MUST** take **ONLY** (1) argument
        named 'event_data' in order for this implementation to work as expected.
        This is related to the way the PyPubSub package is designed.
        See https://pypubsub.readthedocs.io/en/v4.0.3/index.html for more info.
        The 'event_data' parameter **MUST** be an instance of ApplicationEventData
        """
        pub.subscribe(event_handler, event_name);


    def remove_listener(self, event_name):
        pass;


    def emit(self, event_name, event_data={}):
        pub.sendMessage(event_name, event_data=ApplicationEventData(event_name, event_data));


class ApplicationEventData():

    def __init__(self, name, data={}):
        self._name = name;
        self._data = data;

    def value(self):
        return self._data;