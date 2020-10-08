from interfaces.publisher import IPublisher;


class StdoutPublisher(IPublisher):
    # Implements IPublisher interface for publishing posts
    # See interfaces/publisher for method documentation

    def __init__(self):
        pass;


    def publish(self, post):
        print(post);




