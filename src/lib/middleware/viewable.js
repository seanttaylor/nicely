const IValidator = require("../../interfaces/validator");
const viewableValidator = require("../validator/views");
const validatorService = new IValidator(viewableValidator);
const jwt = require("jsonwebtoken");

/**
 * Validates whether a requester can view all posts of a given user or only published posts; users
 * who are NOT the author of a post CANNOT view a post if it is UNPUBLISHED
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express 'next' function.
 * 
*/

module.exports = function viewable(req, res, next) {
    try {
        const authToken = req.headers.authorization.split(" ")[1];
        jwt.verify(authToken, process.env.JWT_SECRET);
        const decodedToken = jwt.decode(authToken);
        
        res.locals.permissions = {
            userCan: {
                viewUnpublishedPosts: validatorService.validate({
                    resourceOwnerId: req.params.id, 
                    authToken: decodedToken
                })
            }
        };
        next();
    } catch(e) {
        console.error(e);
        res.status(401).send({
            data: [],
            errors: ["Missing or bad authorization"],
            entries: 0
        });
    }
    
}