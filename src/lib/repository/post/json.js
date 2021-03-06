/* istanbul ignore file */

/*Implements IPostRepository interface for connecting to a JSON file or in-memory document database
See interfaces/post-repository for method documentation*/

const uuid = require("uuid");
const { PostDTO, PostLikeDTO } = require("./dto");

/**
 * @implements {IPostRepository}
 * @param {Object} databaseConnector - object with methods for connecting to a database 
 */

function PostJSONRepository(databaseConnector) {
    /**
     * @param {PostDTO} postDTO - an instance of PostDTO 
     * @param {PostLikeDTO} postLikeDTO - an instance of PostLikeDTO 
     */
    this.create = async function(postDTO, postLikeDTO) {
        const [post] = await databaseConnector.add({
            doc: postDTO, 
            collection: "posts"
        });

        await databaseConnector.putOne({
            id: post.id, 
            doc: postLikeDTO, 
            collection: "post_likes"
        });
        return { id: post.id, createdDate: post.createdDate };
    }


    this.findOne = async function(id) {
        const result = await databaseConnector.findOne({id, collection: "posts"});
        return result;
    }


    this.findAll = async function() {
        const result = await databaseConnector.findAll("posts");
        return result;
    }

     /**
     * 
     * @param {PostDTO} postDTO - an instance of PosttDTO 
     */
    this.editPost = async function(postDTO) {
        const [record] = await databaseConnector.updateOne({
            doc: postDTO, 
            collection: "posts"
         });

        return { id: record.id , lastModified: record.lastModified };
    }


    this.deletePost = async function(id) {

    }


    this.incrementCommentCount = async function(postDTO) {
        const postData = postDTO.value();
        const allComments = await databaseConnector.findAll("comments");
        const postCommentList = allComments.filter(c => c.postId === postData.id);
        const updatedPostDTO = new PostDTO(Object.assign(postData, {
            commentCount: postCommentList.length
        }));

        await databaseConnector.updateOne({
            doc: updatedPostDTO,
            collection: "posts"
        });      
    }

    /**
     * 
     * @param {PostDTO} postDTO - an instance of PostDTO 
     * @param {String} fromUser - uuid of platform user liking the post
     */
    this.incrementLikeCount = async function(postDTO, fromUser) {
        const postData = postDTO.value();
        const postId = postData.id;
        const [postLike] = await databaseConnector.findOne({
            id: postId, 
            collection: "post_likes"
        });
        const postLikeListUnique = new Set(postLike.likes);
        postLikeListUnique.add(fromUser);

        const updatedPostDTO = new PostDTO(Object.assign(postData, {
            likeCount: postLikeListUnique.size
        }));

        const updatedPostLikeDTO = new PostLikeDTO(Object.assign(postLike, {
            likes: Array.from(postLikeListUnique) 
        }));

        await databaseConnector.updateOne({
            doc: updatedPostDTO,
            collection: "posts"
        });

        await databaseConnector.updateOne({
            doc: updatedPostLikeDTO,
            collection: "post_likes"
        });
        
    }

     /**
     * 
     * @param {PostDTO} postDTO - an instance of PostDTO 
     * @param {String} fromUser - uuid of platform user un-liking the post
     */
    this.decrementLikeCount = async function(postDTO, fromUser) {
        const postData = postDTO.value();
        const postId = postData.id;
        const [postLike] = await databaseConnector.findOne({
            id: postId, 
            collection: "post_likes"
        });
        const postLikeListUnique = new Set(postLike.likes);
        postLikeListUnique.delete(fromUser);

        const updatedPostDTO = new PostDTO(Object.assign(postData, {
            likeCount: postLikeListUnique.size
        }));

        const updatedPostLikeDTO = new PostLikeDTO(Object.assign(postLike, {
            likes: Array.from(postLikeListUnique) 
        }));

        await databaseConnector.updateOne({
            doc: updatedPostDTO,
            collection: "posts"
        });

        await databaseConnector.updateOne({
            doc: updatedPostLikeDTO,
            collection: "post_likes"
        });
    }


    this.setPostSentimentScore = async function(postDTO, sentimentScore, magnitude) {
        const postData = postDTO.value();
        const updatedPostDTO = new PostDTO(Object.assign(postData, {
            sentimentScore: String(sentimentScore),
            magnitude: String(magnitude)
        }));

        await databaseConnector.updateOne({
            doc: updatedPostDTO, 
            collection: "posts"
        });
    }


    this.getTotalPostCount = async function() {
        const result = await databaseConnector.findAll("posts");
        return result.length;
    }


    /*this.getBatchBySequenceNo = async function({ startingWith, endingWith, batchSize }) {
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const sql = `SELECT * from posts WHERE sequence_no >= ${endingWith} AND sequence_no <= ${startingWith} ORDER BY sequence_no DESC LIMIT ${batchSize}`;

        const result = await runQueryWith(sql);
        connection.release();
        return result.map((p) => onReadPost(p));
    }*/


    this.getRecentPosts = async function() {
        //TODO: Determine a sort criteria for "recent"
        const postList = await databaseConnector.findAll("posts");
        return postList;
    }


    this.markAsPublished = async function(postDTO) {
        const postData = postDTO.value();
        const updatedPostDTO = new PostDTO(Object.assign(postData, {
            publishDate: new Date().toISOString(),
            isPublished: true
        }));

        await databaseConnector.updateOne({
            doc: updatedPostDTO, 
            collection: "posts"
        });
    }


    this.getSubscriberFeedByUserId = async function(id) {
        const [user] = await databaseConnector.findOne({id, collection: "user_subscriptions"});
        const userFeed = user.subscriptions.map(async(userId)=> {
            const userPosts = await this.findPostsByUserId({userId});
            return userPosts;
        });
        return Promise.all(userFeed);
    }

    this.findPostsByUserId = async function({userId, showUnpublished=false}) {
        const postFilterFn = showUnpublished ? (p)=> p.userId === userId : (p)=> p.userId === userId && p.isPublished === true;
        
        const postList = await databaseConnector.findAll("posts");
        const postsByUser = postList.filter(postFilterFn);

        return postsByUser;
    }

}

/*PostMySQLRepository*/

module.exports = PostJSONRepository;
