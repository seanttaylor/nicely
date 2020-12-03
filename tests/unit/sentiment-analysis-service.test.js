const SentimentAnalysisService = require("../../src/lib/sentiment-analysis");
const ISentimentAnalysisService = require("../../src/interfaces/sentiment-analysis");

/**Tests**/
async function mockFetch() {
    async function json(data) {
        return {
            documentSentiment: {
                score: 0.9,
                magnitude: 0.9
            }
        };
    }

    return {
        json
    }
}

const testSentimentAnalysisService = new ISentimentAnalysisService(new SentimentAnalysisService({fetch: mockFetch}));

test("Should return a sentiment analysis report object", async() => {
    const report = await testSentimentAnalysisService.getReport();
    expect(typeof(report) === "object").toBe(true);
});

test("Should return a sentiment analysis for specified string", async() => {
    const report = await testSentimentAnalysisService.analyzeSentiment("I'll build a stairway to paradise");
    expect(typeof(report) === "object").toBe(true);
});

test("Should throw an error when text for sentiment analysis is not supplied", async() => {
    try {
        const report = await testSentimentAnalysisService.analyzeSentiment();
    } catch(e) {
        expect(e.message).toMatch("InputError.InputTextShouldBeAString");
    }
});

test("Should throw an error when analysis cannot complete", async() => {
    try {
        const testErrorSentimentAnalysisService = new ISentimentAnalysisService(new SentimentAnalysisService({}));
        await testErrorSentimentAnalysisService.analyzeSentiment("I'll build a stairway to paradise");
    } catch(e) {
        expect(e.message).toMatch("TypeError");
    }
});