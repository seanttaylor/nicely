const SentimentAnalysisService = require("../../src/lib/sentiment-analysis");
const ISentimentAnalysisService = require("../../src/interfaces/sentiment-analysis");
const testSentimentAnalysisService = new ISentimentAnalysisService(new SentimentAnalysisService());

/**Tests**/

test("Should return a sentiment analysis report object", async() => {
    const report = await testSentimentAnalysisService.getReport();
    expect(typeof(report) === "object").toBe(true);
});

test("Should return a sentiment analysis for specified string", async() => {
    const report = await testSentimentAnalysisService.analyzeSentiment("I'll build a stairway to paradise");
    expect(typeof(report) === "object").toBe(true);
});