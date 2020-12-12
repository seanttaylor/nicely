const IPublisher = require("../../src/interfaces/publisher");
const SSEPublisher = require("../../src/lib/publisher/sse");
const mocks = require("../../src/lib/utils/mocks");

const ssePublishService = new IPublisher(new SSEPublisher(mocks.mockImpl.publishService.eventEmitter));


/** Tests ***/

test("Completes initialization of the SSE publisher", ()=> {
    ssePublishService.setup(()=> mocks.mockImpl.publishService.onPublishFn());
    ssePublishService.publish(["newPost", {toJSON: () => null }]);

    expect(mocks.mockImpl.publishService.calledMethods.onPublishFn).toBe(true);
});