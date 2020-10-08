####EventEmitter Unit Tests####


from lib.repository.post.my_sql import PostMySQLRepository;
from lib.events.event_emitter import EventEmitter, ApplicationEventData;

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


####Tests####

def test_should_emit_an_event():
    test_handler = MockEventHandler();
    test_event_emitter = EventEmitter();

    def on_new_post(event_data):
        print("a new post is in!", event_data.value());


    test_event_emitter.on("new-post", test_handler.fake_event_handler);
    test_event_emitter.emit("new-post", {"foo": "bar"});

    assert test_handler.was_called("fake_event_handler") == True;


def test_should_return_the_input_value():
    test_event_data_no_1 = ApplicationEventData("test_event", 47);
    test_event_data_no_2 = ApplicationEventData("test_event", {"foo": "bar"});

    assert test_event_data_no_1.value() == 47;
    assert test_event_data_no_2.value()["foo"] == "bar";

