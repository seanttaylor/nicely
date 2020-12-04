/* istanbul ignore file */

/**
 * Mock implementation for various eventEmitter methods
 */
const mockEventEmitterImplementation = {
    on() {
        this.calledMethods.on = true;
    },
    emit() {
        this.calledMethods.emit = true;
    },
    calledMethods: {
        on: false,
        emit: false
    }
};

module.exports = mockEventEmitterImplementation;