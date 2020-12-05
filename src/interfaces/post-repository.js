/* istanbul ignore file */

/**
* An object having the IPostRepository API; a set of methods for managing user posts
* @typedef {Object} IPostRepositoryAPI
* @property {Function} create - creates a new post in the data store
* @property {Function} findOne - finds a post in the data store by its uuid
* @property {Function} findAll - finds all posts in the data store
* @property {Function} editPost - update a post in the data store by its uuid
* @property {Function} incrementCommentCount - increments the commentCount of a user post
* @property {Function} incrementLikeCount - increments the like count of a user post
* @property {Function} deletePost - deletes a post in the data store by its uuid
* @property {Function} addSentimentScore - associate a sentiment score with a post in the data store
*/

/**
 * Interface for a repository of posts
 * @param {IPostRepositoryAPI} myImpl - object defining concrete implementations for interface methods
 */

function IPostRepository(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }


    /**
    @param {Object} doc - dictionary representing a valid entry
    @returns { String } - a uuid for the new post
    */
    this.create = myImpl.create || required;


    /**
    @param {String} id - uuid of the post
    @returns {Object} - the requested post
    */
    this.findOne = myImpl.findOne || required;


    /**
    @returns {Array}  - a list of all records in the data store
    */
    this.findAll = myImpl.findAll || required;


    /**
    @param {String} id - uuid of the post
    @param {String} text - the update text
    */
    this.editPost = myImpl.editPost || required;


    /**
    @param {String} postId - uuid of the post to increment commentCount field on
    */
    this.incrementCommentCount = myImpl.incrementCommentCount || required;


    /**
    @param {String} postId - uuid of the post to increment likeCount field on
    */
    this.incrementLikeCount = myImpl.incrementLikeCount || required;


    /**
    @param {String} id - uuid of the post
    */

    this.deletePost = myImpl.deletePost || required;


    /**
    @param {String} id - uuid of the post
    @param {Number} sentimentScore - a sentiment score for a specified post
    @param {Number} magnitued - a magnitude value indicating the strength of sentiment associated with a post
    */

    this.addSentimentScore = myImpl.addSentimentScore || required;


    const {
        create,
        findOne,
        findAll,
        editPost,
        incrementCommentCount,
        deletePost,
        addSentimentScore,
        ...optionalMethods
    } = myImpl;

    Object.assign(this, optionalMethods);
}


/*IPostRepository*/

module.exports = IPostRepository;
