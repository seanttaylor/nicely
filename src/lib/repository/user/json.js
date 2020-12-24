/* istanbul ignore file */

/*Implements IUserRepository interface for connecting to a JSON file database.
See interfaces/user-repository for method documentation*/

const uuid = require("uuid");
const { promisify } = require("util");

/**
 * @implements {IUserRepostory}
 * @param {Object} JSONDatabaseConnector - object with methods for connecting to a database 
 */

function UserJSONRepository(JSONDatabaseConnector) {

    this.create = async function(doc) {
        const [record] = await JSONDatabaseConnector.add({doc, collection: "users"});
        await JSONDatabaseConnector.add({
            doc: {
                id: record.id, 
                role: "user"
            }, 
            collection: "user_roles"
        });

        await JSONDatabaseConnector.putOne({
            id: record.id,
            doc: {
                followers: []
            }, 
            collection: "user_followers"
        });

        await JSONDatabaseConnector.putOne({
            id: record.id,
            doc: {
                subscriptions: []
            }, 
            collection: "user_subscriptions"
        });

        return { id: record.id, createdDate: record.createdDate };

    }


    this.createUserPassword = async function(userEmailAddress, password) {
        await JSONDatabaseConnector.add({doc, collection: "user_credentials"});
    }


    this.getUserPassword = async function(userEmailAddress) {
        const [result] = await JSONDatabaseConnector.findAll("users");
        const user = result.find((u)=> u.email_address === userEmailAddress);
        return user.user_password;
    }


    this.findOneById = async function(id) {
        const result = await JSONDatabaseConnector.findOne({id, collection: "users"});
        return result.map((u) => onReadUser(u));
    }


    this.findOneByEmail = async function(emailAddress) {
        const result = await JSONDatabaseConnector.findAll("users");
        const user = result.find((u)=> u.emailAddress === emailAddress);
        
        return [ user || {} ];
    }


    this.findOneByHandle = async function(handle) {
        const result = await JSONDatabaseConnector.findAll("users");
        //Remember: the result of a failed Array.find is `undefined`
        const user = result.find((u)=> u.handle === handle);
         
        return [ user || {} ];
    }


    this.findAll = async function() {
        const [result] = await JSONDatabaseConnector.findAll("users");
        return result.map((u) => onReadUser(u));
    }


    this.editMotto = async function(id, text) {
        const [record] = await JSONDatabaseConnector.updateOne({
            id,
            doc: {body: text},
            collection: "users"
        });

        return { id: record.id, lastModified: record.lastModified };
    }


    this.editName = async function(id, doc) {
        const [record] = await JSONDatabaseConnector.updateOne({
            id,
            doc,
            collection: "users"
        });

        return { id: record.id, lastModified: record.lastModified };

    }


    this.editPhoneNumber = async function(id, phoneNumber) {
        const [record] = await JSONDatabaseConnector.updateOne({
            id,
            doc: {phoneNumber},
            collection: "users"
        });

        return { id, lastModified: record.lastModified };
    }


    this.createSubscription = async function(currentUserId, targetUserId) {
        const [targetUser] = await JSONDatabaseConnector.findOne({
            id: targetUserId,
            collection: "user_followers"
        });
        
        const targetUserFollowerListUnique = new Set(targetUser.followers);
        targetUserFollowerListUnique.add(currentUserId);


        await JSONDatabaseConnector.updateOne({
            id: targetUserId,
            doc: Array.from(targetUserFollowerListUnique),
            collection: "user_followers"
        });
        

        await JSONDatabaseConnector.updateOne({
            id: targetUserId, 
            doc: {
                followers: targetUserFollowerListUnique.size
            },
            collection: "users"
        });

        const currentUserSubscriptions = await JSONDatabaseConnector.findOne({
            id: currentUserId, 
            collection: "user_subscriptions"
        });

        const currentUserSubscriptionsUnique = new Set(currentUserSubscriptions.subscriptions);
        currentUserSubscriptionsUnique.add(targetUserId);

        await JSONDatabaseConnector.updateOne({
            id: currentUserId, 
            doc: {
                subscriptions: Array.from(currentUserSubscriptionsUnique)
            },
            collection: "user_subscriptions"
        });
    }


    this.removeSubscription = async function(currentUserId, targetUserId) {
        await JSONDatabaseConnector.removeOne({
            id,
            collection: "user_followers"
        });
        
        const [followers] = await JSONDatabaseConnector.findAll("user_followers");
        const followerCount = followers.filter(followRecord => followRecord.targetUserId === targetUserId).length;

        await JSONDatabaseConnector.updateOne({
            id: targetUserId, 
            doc: {
                followers: followerCount
            },
            collection: "users"
        });
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
        const result = [];
        //const sql = `SELECT users.id, users.handle, users.email_address, users.motto, users.is_verified, users.first_name, users.last_name, users.follower_count, users.created_date, user_followers.* FROM user_followers JOIN users ON user_followers.follower_id = users.id WHERE user_followers.user_id = "${currentUserId}"`;

        return result.map((u) => onReadUser(u));
    }


    this.getUserSubscriptions = async function(currentUserId) {
        
        const result = [];
        //const sql = `SELECT users.*, user_followers.* FROM user_followers JOIN users ON user_followers.user_id = users.id WHERE user_followers.follower_id = "${currentUserId}"`;

        return result.map((u) => onReadUser(u));
    }


    this.getUserRole = async function(currentUserId) {
        const [result] = await JSONDatabaseConnector.findOne({
            id: currentUserId, 
            collection: "user_roles"
        });
        
        return result;
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

/*UserJSONRepository*/

module.exports = UserJSONRepository;
