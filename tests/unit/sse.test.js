const ServerSentEvent = require("../../src/lib/sse");
const sse = ServerSentEvent();

/**Tests**/

test("Should return a string matching the Server-Sent Event/Event Stream format", () => {
    const [myEvent] = sse.of("fakeEvent");
    expect(typeof(myEvent)).toBe("string");
});