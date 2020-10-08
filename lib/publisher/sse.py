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
        #return sse.of(event_name="NewPost", event_data=post._data);
        pass;

