/* istanbul ignore file */

const MockPostImplementation = {
    setSentimentScore() {
        this.calledMethods.setSentimentScore = true;
        return Promise.resolve();
    },
    _data: {
        body: "I'll build a stairway to paradise"
    },
    calledMethods: {
        setSentimentScore: false,
    }
};


module.exports = MockPostImplementation;
