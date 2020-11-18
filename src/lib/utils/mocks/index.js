module.exports = {
    mocks: {
        Comment: require("./comment")
    },
    mockImpl: {
        repo: require("./repo"),
        user: require("./user"),
        cache: require("./cache")
    }
}
