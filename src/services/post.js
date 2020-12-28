const {PostDTO, PostLikeDTO} = require("../lib/repository/post/dto");
const defaultConfig = require("./config.js");
const uuid = require("uuid");

/**
* @typedef {Object} Post
* @property {String} id - the uuid of the post
* @property {Object} _data - the post data
* @property {Object} _repo - the repository instance associated with this post
*/


/**
 * 
 * @param {Object} repo - the repo associated with this post
 * @param {Object} eventEmitter - an instance of EventEmitter
 * @param {PostDTO} postDTO - an instance of a PostDTO
 */

function Post(repo, eventEmitter, postDTO) {
    const dtoData = postDTO.value();

    this._data = dtoData;
    this._repo = repo;
    this._eventEmitter = eventEmitter;
    this.id = dtoData.id;

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
                commentCount: this._data.commentCount,
                sentimentScore: this._data.sentimentScore,
                publishDate: this._data.publishDate
            }
        };
    }


    /**
    Saves a new post to the data store
    @returns {String} - a uuid for the new post
    */
    this.save = async function() { 
        const postDTO = new PostDTO(this._data);
        const postLikeDTO = new PostLikeDTO(this._data);
        const post = await this._repo.create(postDTO, postLikeDTO);
        
        return post.id;
    }


    /**
    Associates a comment with a post; updates post.commentCount property.
    @param {Comment} comment - an instance of the Comment class
    */
    this.addComment = async function(comment) {
        const postDTO = new PostDTO(this._data);
        await comment.onPost(this.id);
        await comment.save();
        await this._repo.incrementCommentCount(postDTO);

 
        this._data.commentCount += 1;
        this._eventEmitter.emit("posts.postUpdated", ["postUpdate", this]);
    }


    /**
    Increments the like count on the current post; updates post.likeCount property.
    */
    this.incrementLikeCount = async function({fromUser}) {
        const postDTO = new PostDTO(this._data);
        await this._repo.incrementLikeCount(postDTO, fromUser);

        this._data.likeCount += 1;
        this._eventEmitter.emit("posts.postUpdated", ["postUpdate", this]);
    }


    /**
    Decrements the like count on the current post; updates post.likeCount property.
    */
    this.decrementLikeCount = async function({fromUser}) {
        const postDTO = new PostDTO(this._data);
        await this._repo.decrementLikeCount(postDTO, fromUser);
        
        this._data.likeCount -= 1;
        this._eventEmitter.emit("posts.postUpdated", ["postUpdate", this]);
    }


    /**
    Updates the post.body property; saves the update to the data store
    @param {String} text - the updated text
    */
    this.edit = async function(text) {
        const postDTO = new PostDTO(this._data);
        const { lastModified } = await this._repo.editPost(postDTO, text);
        this._data.body = text;
        this.lastModified = lastModified;

        this._eventEmitter.emit("posts.editExistingPost", this);
        return this;
    }


    /**
    Set the sentimentScore for a specified post in the data store
    @param {Number} sentimentScore - a sentiment score to associate with the post
    @param {Number} magnitude - a magnitude score to associate with the post
    */
    this.setSentimentScore = async function({sentimentScore, magnitude}) {
        const postDTO = new PostDTO(this._data);
        await this._repo.setPostSentimentScore(postDTO, sentimentScore, magnitude);

        this._data.sentimentScore = sentimentScore;
        this._data.magnitude = magnitude;
    };

}

/*Post*/

/**
* @typedef {Object} PostService
* @property {Object} _repo - the repository associated with this service
* @property {Object} _validator - the validator used to validate new posts
* @property {Object} _eventEmitter - the eventEmitter used to register/emit service events
*/

/**
 * @param {Object} repo - the repository associated with this service
 * @param {UserService} userService - an instance of the UserService
 * @param {Object} validator - (optional) the validator used to validate new posts
 * @param {Object} eventEmitter - the eventEmitter used to register/emit service events
 */

function PostService({ repo, userService, eventEmitter, validator }) {

    this._repo = repo;
    this._validator = validator || new PostValidator(defaultConfig, userService);
    this._eventEmitter = eventEmitter;

    /**
    * Creates a new post
    * @param {Object} doc an object containing data for a new post
    * @returns {Post} a new post instance
    */
    this.createPost = async function(doc) {
        const id = uuid.v4();
        const data = Object.assign({id}, doc);
        await this._validator.validate(doc);
        return new Post(this._repo, this._eventEmitter, new PostDTO(data));
    }


    this.findPostById = async function(id) {
        if (!id) {
            throw new Error("MissingPostId");
        }
        const result = await this._repo.findOne(id);
        return result.map((p) => new Post(this._repo, this._eventEmitter, new PostDTO(p)));
    }


    this.findAllPosts = async function() {
        const posts = await this._repo.findAll("posts");
        return posts.map((p) => new Post(this._repo, this._eventEmitter, new PostDTO(p)));
    }


    this.findPostsByUserId = async function(options) {
        const postList = await this._repo.findPostsByUserId(options);
        return postList.map((p) => new Post(this._repo, this._eventEmitter, new PostDTO(p)));
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
        return posts.map((p) => new Post(this._repo, this._eventEmitter, new PostDTO(p)));
    }


    this.markAsPublished = async function(post) {
        const postDTO = new PostDTO(post._data);
        await this._repo.markAsPublished(postDTO);
        
        post._data.isPublished = true;
        this._eventEmitter.emit("posts.newPostReadyToPublish", ["newPost", post]);
    }


    this.postExists = async function(id) {
        const result = await this._repo.findOne(id);
        return result.length === 1 && result[0]["id"] === id;
    }


    this.getSubscriberFeedByUserId = async function(id) {
        const feedsList = await this._repo.getSubscriberFeedByUserId(id);
        const userFeed = feedsList.reduce((result, postList)=> {
            postList.map((p) => result.push(new Post(this._repo, this._eventEmitter, new PostDTO(p))));
            return result;
        }, [])
        return userFeed;
    }

}

/**
 * @param {Object} config - a map of configuration options
 * @param {Number} config.postCharacterLimit - maximum length of a new post
 * @param {UserService} userService - an instance of the UserService
 */

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
