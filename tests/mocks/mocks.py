class MockPublisher():

    def __init__(self):
        self.method_calls = {
            "publish": False
        };


    def publish(self, fake_post):
        self.method_calls["publish"] = True;
        return True;

    def was_called(self, method_name):
        return self.method_calls[method_name];


class MockPostService():

    def __init__(self):
        self.method_calls = {
            "mark_as_published": False
        };


    def mark_as_published(self, fake_post):
        self.method_calls["mark_as_published"] = True;
        return True;


    def was_called(self, method_name):
        return self.method_calls[method_name];
