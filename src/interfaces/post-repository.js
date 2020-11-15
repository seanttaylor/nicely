/**
 * Interface for a repository of posts
 *
 * @interface
 * @param {Object} myImpl - object defining concrete implementations for interface methods
 */

function IPostRepository(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }


    /**
    Creates a new post in the data store.
    @param {Object} doc - dictionary representing a valid entry
    @returns { String } - a uuid for the new post
    */
    this.create = myImpl.create || required;


    /**
    Finds a post in the data store by its uuid.
    @param {String} id - uuid of the post
    @returns {Object} - the requested post
    */
    this.findOne = myImpl.findOne || required;


    /**
    Finds all posts in the data store
    @returns {Array}  - a list of all records in the data store
    */
    this.findAll = myImpl.findAll || required;


    /**
    Update a post in the data store by its uuid.
    @param {String} id - uuid of the post
    @param {String} text - the update text
    */
    this.editPost = myImpl.editPost || required;


    /**
    Increments the commentCount of a user post.
    @param {String} postId - uuid of the post to increment commentCount field on
    */
    this.incrementCommentCount = myImpl.incrementCommentCount || required;


    /**
    Increments the likeCount of a user post.
    @param {String} postId - uuid of the post to increment likeCount field on
    */
    this.incrementLikeCount = myImpl.incrementLikeCount || required;


    /**
    Deletes a post in the data store by its uuid.
    @param {String} id - uuid of the post
    */

    this.deletePost || required;

    const {
        create,
        findOne,
        findAll,
        editPost,
        incrementCommentCount,
        deletePost,
        ...optionalMethods
    } = myImpl;

    Object.assign(this, optionalMethods);
}


/*IPostRepository*/

module.exports = IPostRepository;
