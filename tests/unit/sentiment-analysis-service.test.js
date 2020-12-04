const SentimentAnalysisService = require("../../src/lib/sentiment-analysis");
const ISentimentAnalysisService = require("../../src/interfaces/sentiment-analysis");
const events = require("events");
const eventEmitter = new events.EventEmitter();
const mockRepo = require("../../src/lib/utils/mocks/repo");
const mockSentimentAnalysisService = require("../../src/lib/utils/mocks/sentiment-analysis-service");
const mockFetch = require("../../src/lib/utils/mocks/fetch");

const sentimentServiceDeps = {
    eventEmitter, 
    fetch: mockFetch,
    postRepository: mockRepo._repo
}

/**Tests**/


test("Should return a sentiment analysis report object", async() => {
    const testSentimentAnalysisService = new ISentimentAnalysisService(new SentimentAnalysisService(sentimentServiceDeps));
    const report = await testSentimentAnalysisService.getReport();
    expect(typeof(report) === "object").toBe(true);
});

test("Should return a sentiment analysis for specified string", async() => {
    const testSentimentAnalysisService = new ISentimentAnalysisService(new SentimentAnalysisService(sentimentServiceDeps));
    const report = await testSentimentAnalysisService.analyzeSentiment("I'll build a stairway to paradise");
    expect(typeof(report) === "object").toBe(true);
});


test("Should trigger an sentiment analyis when the 'postService.newPost' event is emitted", async() => {
    const testSentimentAnalysisService = new ISentimentAnalysisService(new SentimentAnalysisService(sentimentServiceDeps));
    eventEmitter.emit("postService.newPost", {id: "fake-id", body: "I'll build a stairway to paradise"});
    setTimeout(()=> {
        expect(mockRepo._repo.calledMethods.addSentimentScore).toBe(true);
    }, 5000);  
});

test("Should throw an error when text for sentiment analysis is not supplied", async() => {
    try {
        const testSentimentAnalysisService = new ISentimentAnalysisService(new SentimentAnalysisService(sentimentServiceDeps));
        const report = await testSentimentAnalysisService.analyzeSentiment();
    } catch(e) {
        expect(e.message).toMatch("InputError.InputTextShouldBeAString");
    }
});

test("Should throw an error when analysis cannot complete", async() => {
    try {
        const testErrorSentimentAnalysisService = new ISentimentAnalysisService(new SentimentAnalysisService(sentimentServiceDeps));
        await testErrorSentimentAnalysisService.analyzeSentiment("I'll build a stairway to paradise");
    } catch(e) {
        expect(e.message).toMatch("TypeError");
    }
});