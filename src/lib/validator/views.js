/*Implements IValidator interface for validating arbitrary data
* See interfaces/validator for method documentation
*/

/**
 * Purpose-specific validator for determining whether an API request for a specified user's posts may include
 * unpublished posts
 * @implements {IValidator}
 * @param {String} resourceOwnerId - uuid of owner of the resource (e.g. post, comment)
 * @param {String} authToken - authorization token of the requester of the resource
 * @returns {Boolean} indicating whether requester can view
 */

function validate({resourceOwnerId, authToken}) {
    const requesterIsResourceOwner = resourceOwnerId === authToken.sub;

    if (requesterIsResourceOwner) {
        //User CAN view unpublished posts
        return true
    }

    //User CANNOT view unpublished posts
    return false
}

module.exports = {validate};