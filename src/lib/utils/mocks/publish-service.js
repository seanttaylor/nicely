/**
 * Mock implementation for various publishService methods
 * See /src/interfaces/publisher for documentation
 */
const mockPublishServiceImplementation = {
    onPublishFn() {
        this.calledMethods.onPublishFn = true;
    },
    eventEmitter: {
        on() {

        }
    },
    calledMethods: {
        onPublishFn: false,
    },
    _data: {}
};

module.exports = mockPublishServiceImplementation;
