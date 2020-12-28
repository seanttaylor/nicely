/* istanbul ignore file */
const {CommentDTO, CommentLikeDTO} = require("../../repository/comment/dto");

/*Implements ICommentRepository interface for connecting to JSON file of in memory document database
*See interfaces/comment-repository for method documentation
*/

/**
 * @implements {ICommentRepository}
 */

function CommentJSONRepository(databaseConnector) {

    /**
     * 
     * @param {CommentDTO} commentDTO - an instance of CommentDTO 
     * @param {CommentLikeDTO} commentLikeDTO - an instance of CommentLikeDTO 
     */
    this.create = async function(commentDTO, commentLikeDTO) {
        const [comment] = await databaseConnector.add({
            doc: commentDTO, 
            collection: "comments"
        });

        await databaseConnector.putOne({
            doc: commentLikeDTO, 
            collection: "comment_likes"
        });

        return { id: comment.id, createdDate: comment.createdDate };
    }


    this.findOne = async function(id) {
        const result = await databaseConnector.findOne({id, collection:"comments"});
        return result;
    }


    this.findAllComments = async function() {
        const result = await databaseConnector.findAll("comments");
        return result;
    }

    /**
     * 
     * @param {CommentDTO} commentDTO - an instance of CommentDTO 
     * @param {String} text - text to update comment
     */

    this.editComment = async function(commentDTO, text) {
        const commentData = commentDTO.value();

        const [record] = await databaseConnector.updateOne({
            doc: new CommentDTO(Object.assign(commentData, {
                body: text
            })), 
            collection: "comments"
        });

        return { id: record.id , lastModified: record.lastModified };
    }

    /**
     * 
     * @param {CommentDTO} commentDTO - an instance of CommentDTO 
     * @param {String} fromUser - uuid of platform user liking the comment
     */
    this.incrementLikeCount = async function(commentDTO, fromUser) {
        const commentData = commentDTO.value();
        const commentId = commentData.id;
        const [commentLike] = await databaseConnector.findOne({
            id: commentId, 
            collection: "comment_likes"
        });
        const commentLikeListUnique = new Set(commentLike.likes);
        commentLikeListUnique.add(fromUser);
        
        const updatedCommentDTO = new CommentDTO(Object.assign(commentData, {
            likeCount: commentLikeListUnique.size
        }));
        const updatedCommentLikeDTO = new CommentLikeDTO(Object.assign(commentLike, {
            likes: Array.from(commentLikeListUnique)
        }))
        
        await databaseConnector.updateOne({
            doc: updatedCommentDTO,
            collection: "comments"
        });

        await databaseConnector.updateOne({
            doc: updatedCommentLikeDTO,
            collection: "comment_likes"
        });
    }

    this.decrementLikeCount = async function(commentDTO, fromUser) {
        const commentData = commentDTO.value();
        const commentId = commentData.id;
        const [commentLike] = await databaseConnector.findOne({
            id: commentId, 
            collection: "comment_likes"
        });
        const commentLikeListUnique = new Set(commentLike.likes);
        
        commentLikeListUnique.delete(fromUser);

        const updatedCommentDTO = new CommentDTO(Object.assign(commentData, {
            likeCount: commentLikeListUnique.size
        }));
        const updatedCommentLikeDTO = new CommentLikeDTO(Object.assign(commentLike, {
            likes: Array.from(commentLikeListUnique)
        }))

        await databaseConnector.updateOne({
            doc: updatedCommentDTO,
            collection: "comments"
        });

        await databaseConnector.updateOne({
            doc: updatedCommentLikeDTO,
            collection: "comment_likes"
        });
    }

}


/*CommentJSONRepository*/

module.exports = CommentJSONRepository;
