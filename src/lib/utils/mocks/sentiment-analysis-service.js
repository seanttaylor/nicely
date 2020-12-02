/* istanbul ignore file */

/**
 * Mock implementation for various SentimentAnalysisService methods
 * See /src/interfaces/sentiment-analysis for documentation
 */
const mockSentimentAnalysisServiceImplementation = {
    analyzeSentiment() {
        this.calledMethods.analyzeSentiment = true;
    },
    calledMethods: {
        analyzeSentiment: false
    }
};

module.exports = mockSentimentAnalysisServiceImplementation;