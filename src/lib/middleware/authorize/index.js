const accessGrants = require("./grants.json");
const AccessControl = require("accesscontrol");
const jwt = require("jsonwebtoken");
const ac = new AccessControl(accessGrants.grants);

/**
 * Authorizes an incoming request against the 'roles' claim in a JWT.
 * @param {String} actionId - An colon separated string indicating the action (i.e. request method) and the resource * begin acted upon (e.g. posts) (e.g. "readAny:posts")
 * @param {Boolean} allowResourceOwnerOnly - indicates whether a child resource 
 * (e.g. /users/{id}/posts/{post_id}/comments) can ONLY be accessed by the owner of the top-level resource
 * @param {Function} next - Express 'next' function
 * @returns {Function} - function with Express middleware signature
 * 
*/

module.exports = function({actionId, allowResourceOwnerOnly=true}) { 
    return async function authorizeRequest(req, res, next) {
        try {
            const [action, resource] = actionId.split(":");
            const authToken = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.decode(authToken);
            const permission = ac.can(decodedToken.role[0])[action](resource);

            //The requester has admin privileges
            if (permission.granted && decodedToken.role[0] === "admin") {
                next();
                return;
            }

            /*The request is for a child resource; permissions are overridden at the 
            * router-level to permit access to the child resource
            */
            if (!allowResourceOwnerOnly) {
                next()
                return;
            }
            
            //The requester does NOT have the required access grants for the resource type
            if (!permission.granted) {
                res.status(401).send({
                    data: [],
                    errors: ["Unauthorized: missing access grant(s)"],
                    entries: 0
                });
            }

            //The requester is NOT authorized to access the specified resource; no overrides applied
            if (req.params.id !== decodedToken.sub) {
                res.status(401).send({
                    data: [],
                    error: ["Unauthorized: missing access grant(s)"],
                    entries: 0
                });
                return;
            }
            next();
            
        } catch(e) {
            console.error(e);
             res.status(401).send({
                data: [],
                errors: ["Unauthorized: authorization failed"],
                entries: 0
            });
        }
    }
}