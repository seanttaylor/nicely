const SentimentAnalysisService = require("../../src/lib/sentiment-analysis");
const ISentimentAnalysisService = require("../../src/interfaces/sentiment-analysis");
const events = require("events");
const eventEmitter = new events.EventEmitter();
const mockRepo = require("../../src/lib/utils/mocks/repo");
const mockSentimentAnalysisService = require("../../src/lib/utils/mocks/sentiment-analysis-service");
const mockFetch = require("../../src/lib/utils/mocks/fetch");
const mockConsole = require("../../src/lib/utils/mocks/console");

const sentimentServiceDeps = {
    eventEmitter, 
    console: mockConsole,
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


test("Should log an error when the 'postService.newPost' event handler encounters an error", async() => {
    const sentimentServiceDepsWithBrokenPostRepo = Object.assign(sentimentServiceDeps, {
        postRepository: {
            addSentimentScore() {
                throw new Error("There was an error")
            }
        }
    });
    const testSentimentAnalysisService = new ISentimentAnalysisService(new SentimentAnalysisService(sentimentServiceDepsWithBrokenPostRepo));
 
    eventEmitter.emit("postService.newPost", {id: "fake-id", body: "I'll build a stairway to paradise"});
    setTimeout(()=> {
        expect(mockConsole.calledMethods.error).toBe(true);
    }, 5000)
});


test("Should throw an error when a call to fetch fails", async() => {
    const sentimentServiceDepsWithBrokenFetch = Object.assign(sentimentServiceDeps, {
        fetch: function () {
            throw Error("Fetch Error");
        }
    });
    const testSentimentAnalysisService = new ISentimentAnalysisService(new SentimentAnalysisService(sentimentServiceDepsWithBrokenFetch));
    
    try {
        await testSentimentAnalysisService.analyzeSentiment("I'll build a stairway to paradise");  
    } catch(e) {
        expect(e.message).toMatch("Fetch Error");
    }
});


test("Should throw an error when text for sentiment analysis is not supplied", async() => {
    try {
        const testSentimentAnalysisService = new ISentimentAnalysisService(new SentimentAnalysisService(sentimentServiceDeps));
        const report = await testSentimentAnalysisService.analyzeSentiment();
    } catch(e) {
        expect(e.message).toMatch("InputError.InputTextShouldBeAString");
    }
});