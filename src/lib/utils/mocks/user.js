/**
 * Mock implementation for various User methods
 * See /src/interfaces/user for documentation
 */
const mockUserImplementation = {
    assignCredential() {
        this.calledMethods.assignCredential = true;
    },
    calledMethods: {
        assignCredential: false
    },
    _data: {}
};

module.exports = mockUserImplementation;
