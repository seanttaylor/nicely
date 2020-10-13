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


class MockEventHandler():

    def __init__(self):
        self.method_calls = {
            "fire_fake_event": False
        };


    def fake_event_handler(self, event_data):
        self.method_calls["fake_event_handler"] = True;
        return True;


    def was_called(self, method_name):
        return self.method_calls[method_name];


class MockEventEmitter():

    def __init__(self):
        self.method_calls = {
            "on": False
        };


    def on(self, event_name, event_handler):
        self.method_calls["on"] = True;
        return True;


    def was_called(self, method_name):
        return self.method_calls[method_name];


class MockComment():

    def __init__(self):
        self.method_calls = {
            "on_post": False,
            "save": False
        };

    def on_post(self, id):
        self.method_calls["on_post"] = True;
        return True;

    def save(self):
        self.method_calls["save"] = True;
        return True;

    def was_called(self, method_name):
        return self.method_calls[method_name];
