const Ajv = require("ajv");
const ajv = new Ajv();
const postSchema = require("../../database/connectors/json/schemas/posts.json");
const postLikeSchema = require("../../database/connectors/json/schemas/post-likes.json");
const postSchemaValidation = ajv.compile(postSchema);
const postLikeSchemaValidation = ajv.compile(postLikeSchema);

/**
 * @typedef {Object} PostDTO
 * @property {String} id 
 * @property {String} body
 * @property {String} userId
 * @property {Integer} likeCount
 * @property {String} sentimentScore
 * @property {String} magnitude
 * @property {String} createdDate  
 * @property {Boolean} isPublished
 * @property {String} publishDate 
 * @property {String|null} lastModified
 */

 /**
  * @param {String} id - uuid for a post
  * @param {String} userId - user id of the owner of the post
  * @param {String} body - text content of a post
  * @param {String} commentCount - number of comments recorded for the post
  * @param {Integer} likeCount - number of likes recorded for the post
  * @param {String} createdDate - date a post was created
  * @param {String|null} lastModified - data post was last modified
  * @param {String} handle - handle of owner of the post
  * @param {Boolean} isPublished - indicates whether post is allowed to be viewed by platform users
  * @param {String} publishDate - date post was first published
  * @returns {PostDTO}
  */

function PostDTO({id, userId, body, handle, commentCount=0, likeCount=0, createdDate=new Date().toISOString(), isPublished=false, lastModified=null, publishDate=null}) {
    const postData = {
      id, 
      body, 
      userId, 
      handle,
      likeCount, 
      commentCount,
      createdDate, 
      lastModified,
      isPublished,
      publishDate
    };
  
  if(!postSchemaValidation(postData)) {
    throw new Error(`PostDTOError/InvalidPostDTO => ${JSON.stringify(postSchemaValidation.errors, null, 2)}`);
  }

  this.value = function() {
    return postData;
  }

}


/**
 * @typedef {Object} PostLikeDTO
 * @property {String} id 
 * @property {String[]} likes
 * @property {String} createdDate   
 * @property {String|null} lastModified
 */

 /**
  * @param {String} id - uuid for a post
  * @param {String[]} likes - number of likes recorded for the post
  * @param {String} createdDate - date a post was created
  * @param {String|null} lastModified - data post was last modified
  * @returns {PostLikeDTO}
  */

 function PostLikeDTO({id, likes=[], createdDate=new Date().toISOString(), lastModified=null }) {
    const postLikeData = {
      id, 
      likes, 
      createdDate, 
      lastModified
    };
  
  if(!postLikeSchemaValidation(postLikeData)) {
    throw new Error(`PostDTOError/InvalidPostLikeDTO => ${JSON.stringify(postLikeSchemaValidation.errors, null, 2)}`);
  }

  this.value = function() {
    return postLikeData;
  }

}

module.exports = {
    PostDTO,
    PostLikeDTO
};