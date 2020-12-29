/* istanbul ignore file */

const Ajv = require("ajv");
const ajv = new Ajv();
const commentSchema = require("../../database/connectors/json/schemas/comments.json");
const commentLikeSchema = require("../../database/connectors/json/schemas/comment-likes.json");
const commentLikeSchemaValidation = ajv.compile(commentLikeSchema);
const commentSchemaValidation = ajv.compile(commentSchema);

/**
 * @typedef {Object} CommentDTO
 * @property {String} id 
 * @property {String} body
 * @property {String} userId
 * @property {String} postId
 * @property {Integer} likeCount
 * @property {String} createdDate  
 * @property {String|null} lastModified
 */

 /**
  * @param {String} id - uuid for a comment
  * @param {String} body - text content of a comment
  * @param {String} userId - user id of the owner of the comment
  * @param {String} postId - post id of the post associated with the comment
  * @param {Integer} likeCount - number of likes recorded for the comment
  * @param {String} createdDate - date a comment was created
  * @param {String|null} lastModified - data comment was last modified
  * @returns {CommentDTO}
  */

function CommentDTO({id, body, userId, postId, likeCount=0, createdDate=new Date().toISOString(), lastModified=null}) {
    const commentData = {
      id, 
      body, 
      userId, 
      postId, 
      likeCount, 
      createdDate, 
      lastModified
    };
  
  if(!commentSchemaValidation(commentData)) {
    throw new Error(`CommentDTOError.InvalidCommentDTO => ${JSON.stringify(commentSchemaValidation.errors, null, 2)}`);
  }

  this.value = function() {
    return commentData;
  }

}


/**
 * @typedef {Object} CommentLikeDTO
 * @property {String} id 
 * @property {String[]} likes
 * @property {String} createdDate  
 * @property {String|null} lastModified
 */

 /**
  * @param {String} id - uuid for a comment
  * @param {String[]} likes - number of likes recorded for the comment
  * @param {String} createdDate - date a comment was created
  * @param {String|null} lastModified - data comment was last modified
  * @returns {CommentDTO}
  */

 function CommentLikeDTO({id, likes=[], createdDate=new Date().toISOString(), lastModified=null}) {
    const commentLikeData = {
      id, 
      likes, 
      createdDate, 
      lastModified
    };
  
  if(!commentLikeSchemaValidation(commentLikeData)) {
    throw new Error(`CommentDTOError.InvalidCommentDTO => ${JSON.stringify(commentLikeSchemaValidation.errors, null, 2)}`);
  }

  this.value = function() {
    return commentLikeData;
  }

}

module.exports = {
    CommentDTO,
    CommentLikeDTO
}