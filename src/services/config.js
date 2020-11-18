module.exports = {
    postCharacterLimit: 150,
    baseSentimentScore: 2,
    averagePostSentimentScore: 3,
    postLimitPerHour: 5,
    sentimentService: {
        url: "http://httpbin.org/status/200"
    },
    accessGrants: {
        admin: {
            post: {
                "create:own": ["*"],
                "read:any": ["*"],
                "update:own": ["*"],
                "delete:own": ["*"]
            }
        },
        user: {
            post: {
                "create:own": ["*"],
                "read:own": ["*"],
                "update:own": ["*"],
                "delete:own": ["*"]
            }
        }
    }
}
