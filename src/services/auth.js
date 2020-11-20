var jwt = require("jsonwebtoken");
/**
 * Manages creation and lifecycle of auth credentials
 * @param {CacheService} cacheService - an instance of the CacheService
 */

function AuthService({cacheService}) {

    /**
     * Issues a new authorization credential for a specified user
     * @param {User} user - an instance of the User class
     * @returns a JSON Web Token
    */

    this.issueAuthCredential = function({user, expiresIn}) {
        const token = jwt.sign({ 
            iss: "api@nicely", 
            exp: expiresIn,
            sub: user._id 
        }, process.env.JWT_SECRET);
        //user.assignCredential(token);
        cacheService.set(user._id, token, expiresIn);
        return token;
    }

    /**
     * Expires an existing credential
     * @param {String} credential - a JSON Web Token
    */

    this.expireAuthCredential = function(credential) {
        cacheService.del(credential);
    }


    /**
     * @param {String} credential - a JSON Web Token 
     * @returns Boolean indicating whether the credential is valid (i.e. not expired)
    */

    this.validateAuthCredential = function(credential) {
        return cacheService.has(credential);
    }
}

module.exports = AuthService;