/* istanbul ignore file */

/*Implements ICommentRepository interface for connecting to a MySQL database.
*See interfaces/comment-repository for method documentation
*/

const uuid = require("uuid");
const { promisify } = require("util");

/**
 * @implements {ICommentRepository}
 * @param {Object} databaseConnector - object with methods for connecting to a database 
 */

function CommentMySQLRepository(databaseConnector) {

    this.create = async function(doc) {
        const createdDate = new Date().toISOString();
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const id = uuid.v4();
        const sql = `INSERT INTO comments (id, post_id, user_id, body, created_date) VALUES ('${id}', '${doc.postId}', '${doc.userId}', '${doc.body}', '${createdDate}')`;
        const result = await runQueryWith(sql);
        connection.release();

        return { id, createdDate };
    }

    this.findOneById = async function(id) {
        const createdDate = new Date().toISOString();
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const sql = `SELECT * FROM comments WHERE id = '${id}'`;
        const result = await runQueryWith(sql);
        connection.release();

        return result.map((c) => onReadComment(c));
    }

    this.findAllComments = async function() {
        const createdDate = new Date().toISOString();
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const sql = `SELECT id, user_id, post_id, body, like_count, created_date FROM comments`
        const result = await runQueryWith(sql);
        connection.release();

        return result.map((c) => onReadComment(c));
    }


    this.editComment = async function(id, text) {
        const lastModified = new Date().toISOString();
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const sql = `UPDATE comments SET body = '${text}', last_modified = '${lastModified}' WHERE id = '${id}'`;

        const result = await runQueryWith(sql);
        connection.release();

        return { id, lastModified };
    }

    this.incrementLikeCount = async function({commentId, userId}) {
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const incrementLikeCountSql = `INSERT INTO comment_likes (comment_id, user_id) VALUES ("${commentId}", "${userId}")`;
        const getLikeCountSql = `SELECT COUNT(*) AS like_count FROM comment_likes WHERE comment_id = "${commentId}"`;
        const updateCommentLikeCountSql = `UPDATE posts SET like_count = {like_count} WHERE id = "${commentId}"`;
        const checkUserHasAlreadyLikedCommentSql = `SELECT COUNT(*) AS likes FROM comment_likes WHERE EXISTS
        (SELECT user_id FROM post_likes WHERE user_id = "${userId}" AND comment_id = "${commentId}")`;
        
        const [fromCurrentUser] = await runQueryWith(checkUserHasAlreadyLikedCommentSql);
        const userHasAlreadyLikedComment = fromCurrentUser.likes !== 0;

        if (userHasAlreadyLikedComment) {
            return;
        }

        connection.beginTransaction(async(err) => {
            try {
                await runQueryWith(incrementLikeCountSql);
                const [result] = await runQueryWith(getLikeCountSql);
                const {like_count} = result; 
                await runQueryWith(updateCommentLikeCountSql.replace("{like_count}", like_count));
                connection.commit();
                connection.release();

            }
            catch (e) {
                console.error(e);
                connection.rollback();
                connection.release();

            }
        });

    }

    this.decrementLikeCount = async function({commentId, userId}) {
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const decrementLikeCountSql = `DELETE FROM comment_likes WHERE comment_id = "${commentId}" AND user_id = "${userId}"`;
        const getLikeCountSql = `SELECT COUNT(*) AS like_count FROM comment_likes WHERE comment_id = "${commentId}"`;
        const updateCommentLikeCountSql = `UPDATE posts SET like_count = {like_count} WHERE id = "${commentId}"`;
        const checkUserHasAlreadyUnLikedCommentSql = `SELECT COUNT(*) AS likes FROM comment_likes WHERE EXISTS
        (SELECT user_id FROM post_likes WHERE user_id = "${userId}" AND comment_id = "${commentId}")`;
        
        const [fromCurrentUser] = await runQueryWith(checkUserHasAlreadyUnLikedCommentSql);
        const userHasAlreadyUnLikedComment = fromCurrentUser.likes === 0;

        if (userHasAlreadyUnLikedComment) {
            return;
        }

        connection.beginTransaction(async(err) => {
            try {
                await runQueryWith(decrementLikeCountSql);
                const [result] = await runQueryWith(getLikeCountSql);
                const {like_count} = result; 
                await runQueryWith(updateCommentLikeCountSql.replace("{like_count}", like_count));
                connection.commit();
                connection.release();
            }
            catch (e) {
                console.error(e);
                connection.rollback();
                connection.release();
            }
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


/*CommentMySQLRepository*/

module.exports = CommentMySQLRepository;
