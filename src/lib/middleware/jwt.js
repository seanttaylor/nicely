const jwt = require("jsonwebtoken");

/**
 * Validates a JSON Web Token associated with an incoming request
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express 'next' function.
 * 
*/

module.exports = function validateJWT(req, res, next) {
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