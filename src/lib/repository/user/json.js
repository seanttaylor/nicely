/* istanbul ignore file */

/*Implements IUserRepository interface for connecting to a JSON file database.
See interfaces/user-repository for method documentation*/

const {UserDTO, UserFollowersDTO, UserSubscriptionsDTO} = require("../../../lib/repository/user/dto");


/**
 * @implements {IUserRepostory}
 * @param {Object} databaseConnector - object with methods for connecting to a database 
 */

function UserJSONRepository(databaseConnector) {
    /**
     * @param {UserDTO} userDTO - an instance of UserDTO
     * @param {UserRoleDTO} userRoleDTO - an instance of UserRoleDTO
     * @param {UserFollowersDTO} userFollowerDTO - an instance of UserFollowersDTO
     * @param {UserSubscriptionsDTO} userSubscriptionsDTO - an instance of UserSubscriptionsDTO
     */
    this.create = async function({userDTO, userRoleDTO, userFollowersDTO, userSubscriptionsDTO}) {
        const [record] = await databaseConnector.add({
            doc: userDTO, 
            collection: "users"
        });

        await databaseConnector.add({
            doc: userRoleDTO, 
            collection: "user_roles"
        });

        await databaseConnector.putOne({
            doc: userFollowersDTO, 
            collection: "user_followers"
        });

        await databaseConnector.putOne({
            doc: userSubscriptionsDTO, 
            collection: "user_subscriptions"
        });

        return { id: record.id, createdDate: record.createdDate };

    }

    /**
     * @param {UserCredentialsDTO} userCredentialsDTO - an instance of UserCredentialsDTO
     */
    this.createUserPassword = async function(userCredentialsDTO) {
        await databaseConnector.putOne({
            doc: userCredentialsDTO, 
            collection: "user_credentials"
        });
    }


    this.getUserPassword = async function(userEmailAddress) {
        const [result] = await databaseConnector.findOne({id: userEmailAddress, collection: "user_credentials"});
        return result.password;
    }


    this.findOneById = async function(id) {
        const result = await databaseConnector.findOne({id, collection: "users"});
        return result;
    }


    this.findOneByEmail = async function(emailAddress) {
        //Remember: the result of a failed Array.find is `undefined`
        const result = await databaseConnector.findAll("users");
        const user = result.find((u)=> u.emailAddress === emailAddress);
        
        return [ user || {} ];
    }


    this.findOneByHandle = async function(handle) {
        //Remember: the result of a failed Array.find is `undefined`
        const result = await databaseConnector.findAll("users");
        const user = result.find((u)=> u.handle === handle);
         
        return [ user || {} ];
    }


    this.findAll = async function() {
        const result = await databaseConnector.findAll("users");
        return result;
    }

    /**
     * @param {UserDTO} userDTO - an instance of UserDTO
     */
    this.editMotto = async function(userDTO) {
        const [record] = await databaseConnector.updateOne({
            doc: userDTO,
            collection: "users"
        });

        return { id: record.id, lastModified: record.lastModified };
    }

    /**
     * @param {UserDTO} userDTO - an instance of UserDTO
     */
    this.editName = async function(userDTO) {
        const [record] = await databaseConnector.updateOne({
            doc: userDTO,
            collection: "users"
        });

        return { id: record.id, lastModified: record.lastModified };

    }

    /**
     * @param {UserDTO} userDTO - an instance of UserDTO
     */
    this.editPhoneNumber = async function(userDTO) {
        const [record] = await databaseConnector.updateOne({
            doc: userDTO,
            collection: "users"
        });

        return { lastModified: record.lastModified };
    }

    /**
     * @param {UserDTO} currentUserDTO - an instance of UserDTO
     * @param {UserDTO} targetUserDTO - an instance of UserDTO
     */
    this.createSubscription = async function(currentUserDTO, targetUserDTO) {
        const currentUserData = currentUserDTO.value();
        const targetUserData = targetUserDTO.value();
        const [targetUserFollowerData] = await databaseConnector.findOne({
            id: targetUserData.id,
            collection: "user_followers"
        });
        
        const targetUserFollowerListUnique = new Set(targetUserFollowerData.followers);
        
        targetUserFollowerListUnique.add(currentUserData.id);
        
        const updatedUserFollowers = new UserFollowersDTO(Object.assign(targetUserData, {
            followers: Array.from(targetUserFollowerListUnique)
        }));

        const updatedUser = new UserDTO(Object.assign(targetUserData, {
            followerCount: targetUserFollowerListUnique.size
        }));

        await databaseConnector.updateOne({
            doc: updatedUserFollowers,
            collection: "user_followers"
        });
        
        await databaseConnector.updateOne({
            doc: updatedUser,
            collection: "users"
        });

        const [currentUserSubscriptions] = await databaseConnector.findOne({
            id: currentUserData.id, 
            collection: "user_subscriptions"
        });

        const currentUserSubscriptionsUnique = new Set(currentUserSubscriptions.subscriptions);
        
        currentUserSubscriptionsUnique.add(targetUserData.id);

        const updatedUserSubscriptions = new UserSubscriptionsDTO(Object.assign(currentUserSubscriptions, {
            subscriptions: Array.from(currentUserSubscriptionsUnique)
        }));

        await databaseConnector.updateOne({
            doc: updatedUserSubscriptions,
            collection: "user_subscriptions"
        });
    }


    this.removeSubscription = async function(currentUserDTO, targetUserDTO) {
        const currentUserData = currentUserDTO.value();
        const targetUserData = targetUserDTO.value();

        const [targetUserFollowerData] = await databaseConnector.findOne({
            id: targetUserData.id,
            collection: "user_followers"
        });
        
        const targetUserFollowerListUnique = new Set(targetUserFollowerData.followers);

        targetUserFollowerListUnique.delete(currentUserData.id);
        
        const updatedUserFollowers = new UserFollowersDTO(Object.assign(targetUserData, {
            followers: Array.from(targetUserFollowerListUnique)
        }));

        const updatedUser = new UserDTO(Object.assign(targetUserData, {
            followerCount: targetUserFollowerListUnique.size
        }));

        await databaseConnector.updateOne({
            doc: updatedUserFollowers,
            collection: "user_followers"
        });
        
        await databaseConnector.updateOne({
            doc: updatedUser,
            collection: "users"
        });

        const [currentUserSubscriptions] = await databaseConnector.findOne({
            id: currentUserData.id, 
            collection: "user_subscriptions"
        });

        const currentUserSubscriptionsUnique = new Set(currentUserSubscriptions.subscriptions);
        
        currentUserSubscriptionsUnique.delete(targetUserData.id);

        const updatedUserSubscriptions = new UserSubscriptionsDTO(Object.assign(currentUserSubscriptions, {
            subscriptions: Array.from(currentUserSubscriptionsUnique)
        }));

        await databaseConnector.updateOne({
            doc: updatedUserSubscriptions,
            collection: "user_subscriptions"
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
        const [currentUser] = await databaseConnector.findOne({
            id: currentUserId, 
            collection: "user_followers"
        });

        return currentUser;
    }


    this.getUserSubscriptions = async function(currentUserId) {
        const [userSubscriptionRecord] = await databaseConnector.findOne({
            id: currentUserId, 
            collection: "user_subscriptions"
        });

        return userSubscriptionRecord;
    }


    this.getUserRole = async function(currentUserId) {
        const [result] = await databaseConnector.findOne({
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
