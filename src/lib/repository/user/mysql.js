/*Implements IUserRepository interface for connecting to a MySQL database.
See interfaces/user-repository for method documentation*/

const uuid = require("uuid");
const { promisify } = require("util");

/**
 * @implements {IUserRepostory}
 * @param {Object} databaseConnector - object with methods for connecting to a database 
 */

function UserMySQLRepository(databaseConnector) {

    this.create = async function(doc) {
        const createdDate = new Date().toISOString();
        const connection = await databaseConnector.getConnection();
        const runQuery = promisify(connection.query.bind(connection));
        const id = uuid.v4();

        const sql = `INSERT INTO users (id, handle, email_address, motto, phone_number, first_name, last_name, created_date) VALUES ("${id}", "${doc.handle}", "${doc.emailAddress}", "${doc.motto}", "${doc.phoneNumber}", "${doc.firstName}", "${doc.lastName}", "${createdDate}");`;

        const result = await runQuery(sql);
        connection.release();

        return { "id": id, "createdDate": createdDate };
    }


    this.createUserPassword = async function(userEmailAddress, password) {
        const connection = await databaseConnector.getConnection();
        const runQuery = promisify(connection.query.bind(connection));

        const sql = `INSERT INTO user_credentials (user_email_address, user_password) VALUES ("${userEmailAddress}", "${password}");`;

        await runQuery(sql);
        connection.release();
    }


    this.getUserPassword = async function(userEmailAddress) {
        const connection = await databaseConnector.getConnection();
        const runQuery = promisify(connection.query.bind(connection));
        const sql = `SELECT user_password FROM user_credentials WHERE user_email_address = "${userEmailAddress}";`;

        const [result] = await runQuery(sql);
        connection.release();

        return result.user_password;
    }


    this.findOneById = async function(id) {
        const connection = await databaseConnector.getConnection();
        const runQuery = promisify(connection.query.bind(connection));
        const sql = `SELECT id, handle, email_address, motto, is_verified, first_name, last_name, follower_count, created_date FROM users WHERE id = '${id}'`;
        const result = await runQuery(sql);
        return result.map((u) => onReadUser(u));
    }


    this.findOneByEmail = async function(emailAddress) {
        const connection = await databaseConnector.getConnection();
        const runQuery = promisify(connection.query.bind(connection));

        const sql = `SELECT id, handle, email_address, motto, is_verified, first_name, last_name, follower_count, created_date FROM users WHERE email_address = '${emailAddress}'`;

        const result = await runQuery(sql);
        connection.release();

        return result.map((u) => onReadUser(u));
    }


    this.findOneByHandle = async function(handle) {
        const connection = await databaseConnector.getConnection();
        const runQuery = promisify(connection.query.bind(connection));
        const sql = `SELECT id, handle, email_address, motto, is_verified, first_name, last_name, follower_count, created_date FROM users WHERE handle = '${handle}'`;
        const result = await runQuery(sql);
        connection.release();

        return result.map((u) => onReadUser(u));
    }


    this.findAll = async function() {
        const connection = await databaseConnector.getConnection();
        const runQuery = promisify(connection.query.bind(connection));
        const sql = `SELECT id, handle, email_address, motto, is_verified, first_name, last_name, follower_count, created_date FROM users`;
        const result = await runQuery(sql);
        connection.release();

        return result.map((u) => onReadUser(u));
    }


    this.editMotto = async function(id, text) {
        const connection = await databaseConnector.getConnection();
        const runQuery = promisify(connection.query.bind(connection));
        const lastModified = new Date().toISOString();
        const sql = `UPDATE users SET motto = '${text}', last_modified = '${lastModified}' WHERE id = '${id}'`;

        const result = await runQuery(sql);
        connection.release();

        return { "id": id, "lastModified": lastModified };
    }


    this.editName = async function(id, doc) {
        const connection = await databaseConnector.getConnection();
        const runQuery = promisify(connection.query.bind(connection));
        const lastModified = new Date().toISOString();
        const sql = `UPDATE users SET first_name = '${doc.firstName}', last_name = '${doc.lastName}', last_modified = '${lastModified}' WHERE id = '${id}'`;

        const result = await runQuery(sql)
        connection.release();

        return { "id": id, "lastModified": lastModified };

    }


    this.editPhoneNumber = async function(id, phoneNumber) {
        const connection = await databaseConnector.getConnection();
        const runQuery = promisify(connection.query.bind(connection));
        const lastModified = new Date().toISOString();
        const sql = `UPDATE users SET phone_number = '${phoneNumber}', last_modified = '${lastModified}' WHERE id = '${id}'`;

        const result = await runQuery(sql);
        connection.release();

        return { "id": id, "lastModified": lastModified };
    }


    this.createSubscription = async function(currentUserId, targetUserId) {
        const connection = await databaseConnector.getConnection();
        const runQuery = promisify(connection.query.bind(connection));
        const insertSubscriptionSql = `INSERT INTO user_followers (user_id, follower_id) VALUES('${targetUserId}', '${currentUserId}')`;
        const incrementFollowerCountSql = `UPDATE users SET follower_count = follower_count + 1 WHERE id = '${targetUserId}'`;

        connection.beginTransaction(async(err) => {
            try {
                await runQuery(insertSubscriptionSql);
                await runQuery(incrementFollowerCountSql);
                connection.commit();
            }
            catch (e) {
                console.error(e);
                connection.rollback();
            }
        });
        connection.release();
    }


    this.removeSubscription = async function(currentUserId, targetUserId) {
        const connection = await databaseConnector.getConnection();
        const runQuery = promisify(connection.query.bind(connection));
        const removeSubscription = `DELETE FROM user_followers WHERE follower_id = '${currentUserId}'`;
        const decrementFollowerCount = `UPDATE users SET follower_count = follower_count - 1 WHERE id = '${targetUserId}'`;

        connection.beginTransaction(async(err) => {
            try {
                await runQuery(removeSubscription);
                await runQuery(decrementFollowerCount);
                connection.commit();
            }
            catch (e) {
                console.error(e);
                connection.rollback();
            }
        });
        connection.release();
    }


    this.subscriptionExists = async function(currentUserId, targetUserId) {
        /*
        TODO: Figure out what this is supposed to do. Seems redudant since there's already a user.isFollowing and user.follows method
        db_cursor = self._db_connection.cursor();
        query = ("SELECT COUNT(*) FROM user_followers WHERE user_id = '{}' AND follower_id = '{}'".format(target_user_id, current_user_id));
        db_cursor.execute(query);

        result = db_cursor.fetchall();
        db_cursor.close();

        return result[0][0];
        */
    }


    this.getSubscribersOf = async function(currentUserId) {
        const connection = await databaseConnector.getConnection();
        const runQuery = promisify(connection.query.bind(connection));
        const sql = `SELECT users.id, users.handle, users.email_address, users.motto, users.is_verified, users.first_name, users.last_name, users.follower_count, users.created_date, user_followers.* FROM user_followers JOIN users ON user_followers.follower_id = users.id WHERE user_followers.user_id = '${currentUserId}'`;
        const result = await runQuery(sql);

        return result.map((u) => onReadUser(u));
    }


    this.getUserSubscriptions = async function(currentUserId) {
        const connection = await databaseConnector.getConnection();
        const runQuery = promisify(connection.query.bind(connection));
        const sql = `SELECT users.*, user_followers.* FROM user_followers JOIN users ON user_followers.user_id = users.id WHERE user_followers.follower_id = '${currentUserId}'`;

        const result = await runQuery(sql);
        return result.map((u) => onReadUser(u));
    }

    this.deleteUser = function(id) {
        return
    }


    function onReadUser(record) {
        return {
            id: record.id,
            handle: record.handle,
            emailAddress: record.email_address,
            motto: record.motto,
            isVerified: record.is_verified,
            firstName: record.first_name,
            lastName: record.last_name,
            followerCount: record.follower_count,
            createdDate: record.created_date
        }
    }
}

/*UserMySQLRepository*/

module.exports = UserMySQLRepository;
