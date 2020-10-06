from interfaces.publisher import IPublisher;


class SSEPublisher(IPublisher):
    #Publishes posts to connected clients via Server-Sent Events (e.g. a web browser)

    def __init__(self):
        pass;


    def publish(self, post):
        print(post);
