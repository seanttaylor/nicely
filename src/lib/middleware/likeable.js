const IValidator = require("../../interfaces/validator");
const likeableValidator = require("../validator/likes");
const validatorService = new IValidator(likeableValidator);
const jwt = require("jsonwebtoken");

/**
 * Validates whether a requester can 'like' an entity (e.g. a post or comment); users
 * CANNOT like their own posts or comments
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express 'next' function.
 * 
*/

module.exports = function likeable(req, res, next) {
    
    try {
        const authToken = req.headers.authorization.split(" ")[1];
        jwt.verify(authToken, process.env.JWT_SECRET);
        const decodedToken = jwt.decode(authToken);
        const userCanLikePostsOrComments = validatorService.validate({resourceOwnerId: req.params.id, authToken: decodedToken});
        
        if (userCanLikePostsOrComments) {
            next();
            return;
        } 

        res.status(403).send({
            data: [],
            errors: ["Missing required authorization(s)"],
            entries: 0
        });
    } catch(e) {
        console.error(e);
        res.status(401).send({
            data: [],
            errors: ["Missing or bad authorization"],
            entries: 0
        });
    }
}