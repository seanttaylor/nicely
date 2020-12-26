/* istanbul ignore file */

/*Implements ICommentRepository interface for connecting to JSON file database.
*See interfaces/comment-repository for method documentation
*/

//const uuid = require("uuid");
const { promisify } = require("util");

/**
 * @implements {ICommentRepository}
 */

function CommentJSONRepository(databaseConnector) {

    this.create = async function(doc) {
        const [comment] = await databaseConnector.add({
            doc: Object.assign(doc, {likeCount: 0}), 
            collection: "comments"
        });
        await databaseConnector.putOne({
            id: comment.id, 
            doc: {
                likes:[]
            }, 
            collection: "comment_likes"
        });

        return { id: comment.id, createdDate: comment.createdDate };
    }


    this.findOne = async function(id) {
        const result = await databaseConnector.findOne({id, collection:"comments"});
        return result.map((c) => onReadComment(c));
    }


    this.findAllComments = async function() {
        const result = await databaseConnector.findAll("comments");
        return result.map((c) => onReadComment(c));
    }


    this.editComment = async function(id, text) {
        const [record] = await databaseConnector.updateOne({id, doc: {body: text}, collection: "comments"});

        return { id: record.id , lastModified: record.lastModified };
    }

    this.incrementLikeCount = async function({commentId, userId}) {
        const [commentLike] = await databaseConnector.findOne({
            id: commentId, 
            collection: "comment_likes"
        });
        const commentLikeListUnique = new Set(commentLike.likes);
        
        commentLikeListUnique.add(userId);

        await databaseConnector.updateOne({
            id: commentId, 
            doc: {
                likeCount: commentLikeListUnique.size
            },
            collection: "comments"
        });

        await databaseConnector.updateOne({
            id: commentId, 
            doc: {
                likes: Array.from(commentLikeListUnique)
            },
            collection: "comment_likes"
        });
    }

    this.decrementLikeCount = async function({commentId, userId}) {
        const [commentLike] = await databaseConnector.findOne({
            id: commentId, 
            collection: "comment_likes"
        });
        const commentLikeListUnique = new Set(commentLike.likes);
        
        commentLikeListUnique.delete(userId);

        await databaseConnector.updateOne({
            id: commentId, 
            doc: {
                likeCount: commentLikeListUnique.size
            },
            collection: "comments"
        });

        await databaseConnector.updateOne({
            id: commentId, 
            doc: {
                likes: Array.from(commentLikeListUnique)
            },
            collection: "comment_likes"
        });
    }


    function onReadComment(record) {
        return {
            id: record.id,
            postId: record.post_id,
            userId: record.user_id,
            body: record.body,
            likeCount: record.like_count,
            createdDate: record.created_date
        }
    }

}


/*CommentJSONRepository*/

module.exports = CommentJSONRepository;
