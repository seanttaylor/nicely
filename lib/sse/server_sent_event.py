import uuid;
from datetime import datetime;

class ServerSentEvent():

    def __init__(self):
        pass;

    def of(self, event_name, event_data):
        """
        Creates a string complying with the Event Stream format for pushing Server-Sent Events to connected clients
        See https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format for more info
        @param (str) event_name - name of the event
        @param (dict) event_data - the data about the event to send
        @returns (str)
        """

        event = str({
            "header": {
                "eventName": event_name,
                "timestamp": str(datetime.now()),
                "uuid": str(uuid.uuid4())
            },
            "payload": event_data
        })


        return "event: {} data: {} \n\n".format(event_name, event);
