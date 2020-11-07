const defaultConfig = require("./config.js");
const uuid = require("uuid");
const halson = require("halson");

function Post(repo, doc) {
    this._data = doc;
    this._repo = repo;
    this._id = doc.id || null;
    this._lastModified = doc.lastModified || null;

    this.toJSON = function() {
        return {
            id: this._id,
            createdDate: this._data.createdDate,
            lastModified: this._lastModified,
            data: {
                userId: this._data.userId,
                body: this._data.body,
                author: this._data.handle,
                firstName: this._data.firstName,
                lastName: this._data.lastName,
                likeCount: this._data.likeCount,
                commentCount: this._data.commentCount || 0
            }
        };
    }

    /**
    Saves a new post to the data store.
    @returns {String} - a uuid for the new post
    */
    this.save = async function() {
        const post = await this._repo.create({
            body: this._data.body,
            userId: this._data.userId
        });

        this._id = post.id;
        this._data.createdDate = post.createdDate;
        this._lastModified = null;

        return post.id;
    }

    /**
    Associates a comment with a post; updates post.commentCount property.
    @param {Comment} comment - an instance of the Comment class
    */
    this.addComment = async function(comment) {
        await comment.onPost(this._id);
        await comment.save();
        await this._repo.incrementCommentCount(this._id);

        if (this._data.commentCount) {
            this._data.commentCount += 1;
        }
        else {
            this._data.commentCount = 1;
        }
    }

    /**
    Increments the like count on the current post; updates post.likeCount property.
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
    Updates the post.body property; saves the update to the data store
    @param {String} text - the updated text
    */
    this.edit = async function(text) {
        const id = this._id;
        const { lastModified } = await this._repo.editPost(id, text);
        this._data.body = text;
        this._lastModified = lastModified;

        return this;
    }
}

/*Post*/


function PostService({ repo, userService, eventEmitter, validator }) {

    this._repo = repo;
    this._validator = validator || new PostValidator(defaultConfig, userService);
    this._eventEmitter = eventEmitter;

    this.createPost = async function(doc) {
        await this._validator.validate(doc);
        return new Post(this._repo, doc);
    }


    this.findPostById = async function(id) {
        const result = await this._repo.findOne(id);
        return result.map((p) => new Post(this._repo, p));
    }


    this.findAllPosts = async function() {
        const posts = await this._repo.findAll();
        return posts.map((p) => new Post(this._repo, p));
    }


    this.deletePost = async function(id) {

    }


    this.getTotalPostCount = async function() {
        return await this._repo.getTotalPostCount();
    }


    /*
    TODO: Figure out what this is supposed to do or DELETE
    this.getBatchBySequenceNo = async function({ startingWith, endingWith, batchSize }) {
        return await this._repo.getBatchBySequenceNo({
            startingWith,
            endingWith,
            batchSize
        });
    }*/


    this.getRecentPosts = async function() {
        const posts = await this._repo.getRecentPosts();
        return posts.map((p) => new Post(this._repo, p));
    }


    this.markAsPublished = async function(post) {
        await this._repo.markAsPublished(post._id);
        post._data.isPublished = true;
        this._eventEmitter.emit("posts.newPostReadyToPublish", post);
    }


    this.postExists = async function(id) {
        const result = await this._repo.findOne(id);
        return result.length === 1 && result[0]["id"] === id;
    }


    this.getPostsBySubscriber = async function(id) {
        const posts = await this._repo.getPostsBySubscriber(id);
        return posts.map((p) => new Post(this._repo, p));
    }

}


function PostValidator(config, UserService) {

    this._config = config
    this._UserService = UserService;

    this.validate = async function(postData) {
        if (postData === undefined || (Object.keys(postData).length === 0)) {
            throw new Error("PostDataEmpty");
        }

        if (!Object.keys(postData).includes("body")) {
            throw new Error("MissingOrInvalidPostBody");
        }

        if (!Object.keys(postData).includes("userId")) {
            throw new Error("MissingOrInvalidUserId");
        }

        if (postData.body.length > this._config.postCharacterLimit) {
            throw new Error("MissingOrInvalidPostBody.PostCharacterLimitExceeded");
        }

        if (!uuid.validate(postData.userId)) {
            throw new Error("MissingOrInvalidUserId");
        }

        const userExists = await this._UserService.userExists(postData.userId);

        if (!userExists) {
            throw new Error("UserDoesNotExist");
        }
    }
}

module.exports = { PostService };
