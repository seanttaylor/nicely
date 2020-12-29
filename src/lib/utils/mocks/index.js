module.exports = {
    mocks: {
        Comment: require("./comment")
    },
    mockImpl: {
        repo: require("./repo"),
        user: require("./user"),
        userService: require("./user-service"),
        publishService: require("./publish-service"),
        cache: require("./cache"),
        console: require("./console")
    }
}
