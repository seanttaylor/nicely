/**
 * Interface for a repository of comments
 *
 * @interface
 * @param {Object} myImpl - object defining concrete implementations for interface methods
 */

function ICommentRepository(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }

    /**
    Creates a new comment in the data store
    @param {Object} doc - dictionary representing a valid entry
    @returns {String} - a uuid for the new post
    */
    this.create = myImpl.create || required;


    /**
    Finds a comment in the data store by its uuid.
    @param {String} id - uuid of the post
    @returns {Object} - the requested post
    */
    this.findOneById = myImpl.findOneById || required;


    /**
    Finds all comments in the data store
    @returns {Array} - a list of all records in the data store
    */
    this.findAllComments = myImpl.findAllComments || required;

    /**
    Increments like_count property of a comment in the data store
    @param {String} commentId - uuid of comment['like_count'] to increment
    */
    this.incrementLikeCount = myImpl.incrementLikeCount || required;

    /**
    Update a comment in the data store by its uuid.
    @param {String} id - uuid of the post
    @param {Object} doc - the update document

    */
    this.editComment = myImpl.editComment || required;

    const {
        create,
        findOneById,
        findAllComments,
        editComment,
        incrementLikeCount,
        ...optionalMethods
    } = myImpl;

    Object.assign(this, optionalMethods);

}


module.exports = ICommentRepository;
