module.exports = {
    validateRequestBodyWith: require("./validate"),
    validateUserCanViewUnpublished: require("./viewable"),
    validateUserCanLike: require("./likeable"),
    authorizeRequest: require("./authorize"),
    validateJWT: require("./jwt")
}