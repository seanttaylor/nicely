from interfaces.publisher import IPublisher;
from lib.sse.server_sent_event import ServerSentEvent;
sse = ServerSentEvent();

class SSEPublisher(IPublisher):
    # Implements IPublisher interface for publishing posts
    # See interfaces/publisher for method documentation
    # Publishes posts to connected clients via Server-Sent Events (e.g. a web browser)

    def __init__(self):
        pass;


    def publish(self, post):
        event = sse.of(event_name="NewPost", event_data=post._data);
        print(event);
        return self._flask_response(event, mimetype="text/event-stream");

    
    def setup(self, flask_response):
        """
        Adds additional configuration necessary to execute the publish method after class is instantiated
        @param (object) self
        @param (flask.Response) flask_response - the flask.Response method
        @returns (None)
        """    
        self._flask_response = flask_response;

