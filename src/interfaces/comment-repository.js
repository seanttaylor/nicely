/* istanbul ignore file */


/**
* An object having the ICommentRepository API; a set of methods for managing user comments
* @typedef {Object} ICommentRepositoryAPI
* @property {Function} create - creates a new comment in the data store
* @property {Function} findOne - finds a comment in the data store by its uuid
* @property {Function} findAllComments - finds all comments in the data store
* @property {Function} incrementLikeCount - increments like_count property of a comment in the data store
* @property {Function} editComment - update a comment in the data store by its uuid
*/


/**
 * Interface for a repository of comments
 * @param {ICommentRepositoryAPI} myImpl - object defining concrete implementations for interface methods
 */

function ICommentRepository(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }

    /**
    @param {Object} doc - dictionary representing a valid entry
    @returns {String} a uuid for the new comment
    */
    this.create = myImpl.create || required;


    /**
    @param {String} id - uuid of the comment
    @returns {Object} - the requested comment
    */
    this.findOne = myImpl.findOne || required;


    /**
    @returns {Array} - a list of all records in the data store
    */
    this.findAllComments = myImpl.findAllComments || required;


    /**
    @param {String} commentId - uuid of comment like_count property to increment
    */
    this.incrementLikeCount = myImpl.incrementLikeCount || required;


    /**
    @param {String} id - uuid of the post
    @param {Object} doc - the update document
    */
    this.editComment = myImpl.editComment || required;

    const {
        create,
        findOne,
        findAllComments,
        editComment,
        incrementLikeCount,
        ...optionalMethods
    } = myImpl;

    Object.assign(this, optionalMethods);

}

module.exports = ICommentRepository;