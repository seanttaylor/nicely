var jwt = require("jsonwebtoken");
/**
 * Manages creation and lifecycle of auth credentials
 * @param {UserService} userService - an instance of the UserService class
 * @param {CacheService} cacheService - an instance of the CacheService class
 */

function AuthService({userService, cacheService}) {

    /**
     * Issues a new authorization credential for a specified user
     * @param {User} user - an instance of the User classe
     * @returns a JSON Web Token
    */

    this.issueAuthCredential = function(user) {
        const token = jwt.sign({ 
            iss: "api@nicely", 
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            sub: user._id 
        }, process.env.JWT_SECRET);
        user.assignCredential(token);
        cacheService.set(token);
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