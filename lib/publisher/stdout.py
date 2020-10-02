from interfaces.publisher import IPublisher;


class StdoutPublisher(IPublisher):

    def __init__(self):
        pass;


    def publish(self, post):
        #TODO: Run validation on posts before publish
        print(post);




