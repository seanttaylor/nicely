function Comment(repo, doc) {
    this._repo = repo;
    this._id = doc.id || null;
    this._data = Object.assign({}, doc);

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

        const comment = await this._repo.create({
            body: this._data.body,
            userId: this._data.userId,
            postId: this._data.postId
        });

        this._id = comment.id;
        this._data.createdDate = comment.createdDate;
        this._data.lastModified = null;

        return comment.id;
    }


    /**
    Increments the comment.likeCount property
    */
    this.incrementLikeCount = async function() {

        await this._repo.incrementLikeCount(this._id);

        if (Object.keys(this._data).includes("likeCount")) {
            this._data.likeCount += 1;
        }
        else {
            this._data.likeCount = 1;
        }
    }

    /**
    Updates the comment.body property
    @param {String} text - text of the updated comment
    @returns {Object} self
    */
    this.edit = async function(text) {
        const { lastModified } = await this._repo.editComment(this._id, text);
        this._data.body = text;
        this._data.lastModified = lastModified;

        return this;
    }

}

/*Comment*/


function CommentService({ repo, postService, userService, validator }) {
    this._repo = repo;
    this._validator = validator || new CommentValidator({ postService, userService });


    this.createComment = async function(doc) {
        await this._validator.validate(doc);
        return new Comment(this._repo, doc);
    }


    this.findAllComments = async function() {
        const commentsList = await this._repo.findAllComments();
        return commentsList.map((c) => new Comment(this.repo, c));
    }

    this.findCommentById = async function(id) {
        const commentsList = await this._repo.findOneById(id);
        return commentsList.map((c) => new Comment(this.repo, c));
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
