/*Non-secret configuration for application modules*/

module.exports = {
    launchBanner: require("./launch-banner"),
    posts: {
        postCharacterLimit: 150,
        baseSentimentScore: 2,
        averagePostSentimentScore: 3,
        postLimitPerHour: 5,
        sentimentService: {
            url: "http://httpbin.org/status/200"
        }
    },
    users: {
        emailAddressRegex: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
        userHandleRegex: /\@[a-zA-Z0-9_]{1,}/g
    }
};
