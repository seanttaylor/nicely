const jwt = require("jsonwebtoken");

/**
 * Validates whether a requester can 'like' an entity (e.g. a post or comment); users
 * CANNOT like their own posts or comments
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express 'next' function.
 * 
*/

module.exports = function likeableFilter(req, res, next) {
    try {
        const authToken = req.headers.authorization.split(" ")[1];
        jwt.verify(authToken, process.env.JWT_SECRET);
        next();
    } catch(e) {
        res.status(401).send({
            data: [],
            errors: ["Missing or bad authorization"],
            entries: 0
        });
    }
}