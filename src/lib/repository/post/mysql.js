/*Implements IPostRepository interface for connecting to a MySQL database.
See interfaces/post-repository for method documentation*/

const uuid = require("uuid");
const { promisify } = require("util");

function PostMySQLRepository(databaseConnector) {

    this.create = async function(doc) {
        const createdDate = new Date().toISOString();
        const connection = await databaseConnector.getConnection();

        const runQueryWith = promisify(connection.query.bind(connection));
        const id = uuid.v4();
        const sql = `INSERT INTO posts (id, user_id, body, created_date) VALUES ('${id}', '${doc.userId}', '${doc.body}', '${createdDate}')`;
        await runQueryWith(sql);
        connection.release();

        return { id, createdDate };
    }


    this.findOne = async function(id) {
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const sql = `SELECT posts.id, posts.user_id, posts.body, posts.comment_count, posts.like_count, posts.sequence_no, posts.created_date, posts.last_modified, users.handle, users.first_name, users.last_name FROM posts JOIN users ON posts.user_id = users.id  WHERE posts.id = '${id}'`;

        const result = await runQueryWith(sql);
        return result.map((p) => onReadPost(p));
    }


    this.findAll = async function() {
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const sql = `SELECT posts.id, posts.user_id, posts.body, posts.comment_count, posts.like_count, posts.sequence_no, posts.created_date, users.handle, users.first_name, users.last_name FROM posts JOIN users ON posts.user_id = users.id`;
        const result = await runQueryWith(sql);

        return result.map((p) => onReadPost(p));
    }


    this.editPost = async function(id, text) {
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const lastModified = new Date().toISOString();
        const sql = `UPDATE posts SET body = '${text}', last_modified = '${lastModified}' WHERE id = '${id}'`;

        await runQueryWith(sql);
        connection.release();

        return { id, lastModified };
    }


    this.deletePost = async function(id) {

    }


    this.incrementCommentCount = async function(id) {
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const sql = `UPDATE posts SET comment_count = comment_count + 1 WHERE id = '${id}'`;

        await runQueryWith(sql);
        connection.release();
    }


    this.incrementLikeCount = async function(id) {
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const sql = `UPDATE posts SET like_count = like_count + 1 WHERE id = '${id}'`;

        await runQueryWith(sql);
        connection.release();
    }



    this.getTotalPostCount = async function() {
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const sql = `SELECT COUNT(*) AS count from posts`;

        const [result] = await runQueryWith(sql);
        connection.release();
        return result.count;
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
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const sql = `SELECT posts.*, users.handle from posts JOIN users ON posts.user_id = users.id WHERE is_published = 1 ORDER BY sequence_no DESC LIMIT 35`;

        const result = await runQueryWith(sql);
        connection.release();

        return result.map((p) => onReadPost(p));
    }


    this.markAsPublished = async function(id) {
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const sql = `UPDATE posts SET is_published = 1 WHERE id = '${id}'`;

        await runQueryWith(sql);
        connection.release();
    }


    this.getPostsBySubscriber = async function(id) {
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const sql = `SELECT posts.id, posts.user_id, posts.body, posts.comment_count, posts.like_count, posts.sequence_no, posts.created_date, users.handle, users.first_name, users.last_name FROM posts JOIN user_followers ON posts.user_id = user_followers.user_id JOIN users ON posts.user_id = users.id WHERE follower_id = '${id}'`;

        const result = await runQueryWith(sql);
        connection.release();

        return result.map((p) => onReadPost(p));
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
            lastName: record.last_name
        }
    }
}

/*PostMySQLRepository*/

module.exports = PostMySQLRepository;
