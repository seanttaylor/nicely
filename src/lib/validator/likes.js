/*Implements IValidator interface for validating arbitrary data
* See interfaces/validator for method documentation
*/

/**
 * Purpose-specific validator for determining whether a requester can like an entity (e.g. post or comment)
 * @implements {IValidator}
 * @param {String} resourceOwnerId - uuid of owner of the resource (i.e. post or comment)
 * @param {String} authToken - authorization token of the requester of the resource
 * @returns {Boolean} indicating whether requester can like
*/


function validate({resourceOwnerId, authToken}) {
    const requesterIsResourceOwner = resourceOwnerId === authToken.sub;

    if (!requesterIsResourceOwner) {
        //User CAN like a post or comment
        return true;
    }

    //User CANNOT like a post or comment
    return false;
}

module.exports = {validate};