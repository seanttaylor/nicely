const {CommentDTO, CommentLikeDTO} = require("../lib/repository/comment/dto");
const uuid = require("uuid");

/**
* @typedef {Object} Comment
* @property {String} id - the uuid of the comment
* @property {Object} _data - the comment data
* @property {Object} _repo - the repository instance associated with this comment
*/

/**
 * @param {Object} repo - the repo associated with this comment
 * @param {CommentDTO} commentDTO - an instance of a CommentDTO
 */

function Comment(repo, commentDTO) {
    const dtoData = commentDTO.value();

    this._repo = repo;
    this._data = dtoData;
    this.id = dtoData.id;

    this.toJSON = function() {
        return {
            id: this.id,
            createdDate: this._data.createdDate,
            lastModified: this._lastModified,
            data: {
                userId: this._data.userId,
                postId: this._data.postId,
                body: this._data.body,
                likeCount: this._data.likeCount
            }
        };
    }

    /**
    Associates a comment with a specified post
    @param {String} postId - id of the post being commented on
    */
    this.onPost = function(postId) {
        this._data.postId = postId;
    }

    /**
    Saves a new comment to the data store.
    @returns {String} - a uuid for the new comment
    */
    this.save = async function() {
        const commentDTO = new CommentDTO(this._data);
        const commentLikeDTO = new CommentLikeDTO(this._data);
        const comment = await this._repo.create(commentDTO, commentLikeDTO);
        
        this.id = comment.id;
        this._data.createdDate = comment.createdDate;
        this._data.lastModified = comment.lastModified;

        return comment.id;
    }


    /**
    Increments the comment.likeCount property
    */
    this.incrementLikeCount = async function({fromUser}) {
        const commentDTO = new CommentDTO(this._data);
        await this._repo.incrementLikeCount(commentDTO, fromUser);
        this._data.likeCount += 1;
    }

    
    /**
    Decrements the comment.likeCount property
    */
    this.decrementLikeCount = async function({fromUser}) {
        const commentDTO = new CommentDTO(this._data);
        await this._repo.decrementLikeCount(commentDTO, fromUser);
        this._data.likeCount -= 1;
    }


    /**
    Updates the comment.body property
    @param {String} text - text of the updated comment
    @returns {Object} self
    */
    this.edit = async function(text) {
        const commentDTO = new CommentDTO(this._data);
        const { lastModified } = await this._repo.editComment(commentDTO, text);
        this._data.body = text;
        this._data.lastModified = lastModified;

        return this;
    }

}

/*Comment*/


/**
* @typedef {Object} CommentService
* @property {Object} _repo - the repository associated with this service
* @property {Object} _validator - the validator used to validate new posts
* @property {Object} _eventEmitter - the eventEmitter used to register/emit service events
*/

/**
 * @param {Object} repo - the repository associated with this service
 * @param {UserService} userService - an instance of the UserService
 * @param {PostService} postService - an instance of the PostService
 * @param {Object} validator - (optional) the validator used to validate new posts
 */

function CommentService({ repo, postService, userService, validator }) {
    this._repo = repo;
    this._validator = validator || new CommentValidator({ postService, userService });


    this.createComment = async function(doc) {
        const id = uuid.v4();
        const data = Object.assign({id}, doc);
        await this._validator.validate(doc);
        return new Comment(this._repo, new CommentDTO(data));
    }


    this.findAllComments = async function() {
        const commentsList = await this._repo.findAllComments();
        return commentsList.map((c) => new Comment(this._repo, new CommentDTO(c)));
    }

    this.findCommentById = async function(id) {
        const commentsList = await this._repo.findOne(id);
        return commentsList.map((c) => new Comment(this._repo, new CommentDTO(c)));
    }

}


/*CommentService*/


function CommentValidator({ postService, userService }) {

    /**
    Validates comments before they are created
    @param {PostService} postService - an instance of the PostService
    @param {UserService} userService - an instance of the UserService
    */
    this._PostService = postService;
    this._UserService = userService;

    this.validate = async function(commentData) {
        if (commentData === undefined || (Object.keys(commentData).length === 0)) {
            throw new Error("CommentDataEmpty");
        }

        if (!Object.keys(commentData).includes("body")) {
            throw new Error("MissingOrInvalidCommentBody.Missing");
        }

        if (!Object.keys(commentData).includes("userId")) {
            throw new Error("MissingOrInvalidUserId.Missing");
        }

        if (!Object.keys(commentData).includes("postId")) {
            throw new Error("MissingOrInvalidPostId.Missing");
        }

        const userExists = await this._UserService.userExists(commentData.userId);
        const postExists = await this._PostService.postExists(commentData.postId);

        if (!userExists) {
            throw new Error("MissingOrInvalidUserId.UserDoesNotExist");
        }

        if (!postExists) {
            throw new Error("MissingOrInvalidPostId.PostDoesNotExist");
        }
    }
}
/*CommentValidator*/

module.exports = { CommentService, CommentValidator };
