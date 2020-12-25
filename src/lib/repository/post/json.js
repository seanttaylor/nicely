/* istanbul ignore file */

/*Implements IPostRepository interface for connecting to a JSON file database.
See interfaces/post-repository for method documentation*/

const uuid = require("uuid");
const { promisify } = require("util");

/**
 * @implements {IPostRepository}
 * @param {Object} JSONDatabaseConnector - object with methods for connecting to a database 
 */

function PostJSONRepository(JSONDatabaseConnector) {

    this.create = async function(doc) {
        const [record] = await JSONDatabaseConnector.add({
            doc: Object.assign(doc, {
                commentCount: 0, 
                likeCount: 0, 
                isPublished: false,
                publishDate: null
            }), 
            collection: "posts"
        });
        return { id: record.id, createdDate: record.createdDate };
    }


    this.findOne = async function(id) {
        const result = await JSONDatabaseConnector.findOne({id, collection: "posts"});
        return result.map((p) => onReadPost(p));
    }


    this.findAll = async function() {
        const result = await JSONDatabaseConnector.findAll("posts");
        return result.map((p) => onReadPost(p));
    }


    this.editPost = async function(id, text) {
        const [record] = await JSONDatabaseConnector.updateOne({
            id, 
            doc: {
                body: text
            }, 
            collection: "posts"
         });

        return { id: record.id , lastModified: record.lastModified };
    }


    this.deletePost = async function(id) {

    }


    this.incrementCommentCount = async function(id) {
        const allComments = await JSONDatabaseConnector.findAll("comments");
        const postCommentList = allComments.filter(c => c.postId === id);

        await JSONDatabaseConnector.updateOne({
            id, 
            doc: {
                comment_count: postCommentList.length + 1
            },
            collection: "posts"
        });      
    }


    this.incrementLikeCount = async function({postId, userId}) {
        const [postLikeList] = await JSONDatabaseConnector.findOne({
            id: postId, 
            collection: "post_likes"
        });
        const postLikeListUnique = new Set(postLikeList);
        
        postLikeListUnique.add(userId);

        await JSONDatabaseConnector.updateOne({
            id: postId, 
            doc: {
                like_count: postLikeListUnique.size
            },
            collection: "posts"
        });
        
    }


    this.decrementLikeCount = async function({postId, userId}) {
        const [postLikeList] = await JSONDatabaseConnector.findOne({
            id: postId, 
            collection: "post_likes"
        });
        const postLikeListUnique = new Set(postLikeList);
        
        postLikeListUnique.delete(userId);

        await JSONDatabaseConnector.updateOne({
            id: postId, 
            doc: {
                like_count: postLikeListUnique.size
            },
            collection: "posts"
        });
    }


    this.setPostSentimentScore = async function({id, sentimentScore, magnitude}) {
        const [record] = await JSONDatabaseConnector.updateOne({
            id, 
            doc: {
                sentiment_score: sentimentScore,
                magnitude: magnitude
            }, 
            collection: "posts"
        });
    }


    this.getTotalPostCount = async function() {
        const result = await JSONDatabaseConnector.findAll("posts");
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
        const result = [];
        //const sql = `SELECT posts.*, users.handle from posts JOIN users ON posts.user_id = users.id WHERE is_published = 1 ORDER BY sequence_no DESC LIMIT 35`;

        return result.map((p) => onReadPost(p));
    }


    this.markAsPublished = async function(id) {
        const [record] = await JSONDatabaseConnector.updateOne({
            id, 
            doc: {
                publishDate: new Date().toISOString(),
                isPublished: true
            }, 
            collection: "posts"
        });
    }


    this.getPostsBySubscriber = async function(id) {
        const [user] = await JSONDatabaseConnector.findOne({id, collection: "user_subscriptions"});
        const subscriptions = user.subscriptions.reduce((res, userId)=> {
            res.push(userId);
            return res;
        }, []);

        return subscriptions.map((p) => onReadPost(p));
    }

    this.findPostsByUserId = async function({userId, showUnpublished=false}) {
        const posts = await JSONDatabaseConnector.findAll("posts");
        const postsByUser = posts.filter((p)=> p.userId === userId && p.isPublished === showUnpublished);
        
        return postsByUser;
        //return postsByUser.map((p) => onReadPost(p));

        //let sql = `SELECT posts.id, posts.user_id, posts.body, posts.comment_count, posts.like_count, posts.sequence_no, posts.created_date, posts.sentiment_score, posts.magnitude, publish_date, users.handle, users.first_name, users.last_name FROM posts JOIN users ON posts.user_id = users.id WHERE users.id = "${userId}"`;
    }


    function onReadPost(record) {
        return {
            id: record.id,
            userId: record.user_id,
            body: record.body,
            commentCount: record.comment_count,
            likeCount: record.like_count,
            sequenceNo: record.sequence_no,
            createdDate: record.created_date,
            lastModified: record.last_modified,
            handle: record.handle,
            firstName: record.first_name,
            lastName: record.last_name,
            sentimentScore: Number(record.sentiment_score),
            magnitude: record.magnitude,
            publishDate: record.publish_date
        }
    }
}

/*PostMySQLRepository*/

module.exports = PostJSONRepository;
