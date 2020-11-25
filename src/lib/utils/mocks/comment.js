/* istanbul ignore file */

function MockComment() {
    this.methodCalls = {
        onPost: false,
        save: false
    };

    this.onPost = async function() {
        this.methodCalls.onPost = true;
        return Promise.resolve();
    }

    this.save = async function() {
        this.methodCalls.save = true;
        return Promise.resolve();
    }

    this.wasCalled = function(methodName) {
        return this.methodCalls[methodName];
    }

};


module.exports = MockComment;
