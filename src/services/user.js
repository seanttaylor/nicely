const config = require("../../config");

function User(repo, doc) {

    this._repo = repo;
    this._id = doc.id || null;
    this._lastModified = doc.lastModified || null;

    this._data = Object.assign({}, doc);
    this._data.isVerified = doc.isVerified || false;
    this._data.motto = doc.motto || null;
    this._data.followerCount = doc.followerCount || 0;

    this.toJSON = function() {
        return {
            id: this._id,
            createdDate: this._data.createdDate,
            lastModified: this._lastModified,
            data: {
                userId: this._data.userId,
                handle: this._data.handle,
                firstName: this._data.firstName,
                lastName: this._data.lastName,
                followerCount: this._data.followerCount,
                emailAddress: this._data.emailAddress,
                motto: this._data.motto
            }
        };
    }


    /**
    Saves a new user to the data store.
    @returns {String} - a uuid for the new user
    */
    this.save = async function() {
        const { id, createdDate } = await this._repo.create(this._data);
        this._id = id;
        this._data.createdDate = createdDate;
        this._data.lastModified = null;
        return id;

    }

    /**
    Edit first_name and/or last_name on an existing user in the data store.
    @param {String} first_name - updated first name
    @param {String} last_name - updated last name
    */
    this.editName = async function(doc) {
        this._data.firstName = doc.firstName || this._data.firstName;
        this._data.lastName = doc.lastName || this._data.lastName;

        const result = await this._repo.editName(this._id, doc);
        return result;
    }

    /**
    Edit phoneNumber property of an existing user in the data store.
    @param {String} phone_number - a telephone number
    */
    this.editPhoneNumber = async function(phoneNumber) {
        this._data.phoneNumber = phoneNumber;
        const result = await this._repo.editPhoneNumber(this._id, phoneNumber);
        return result;
    }

    /**
    Edit motto property of an existing user in the data store.
    @param {String} motto - the updated motto
    */
    this.editMotto = async function(motto) {
        this._data.motto = motto;
        const result = await this._repo.editMotto(this._id, motto);
        return result;
    }


    /**
    Subscribe the current user to the feed of another user on the platform
    @param {User} targetUser - an instance of the User class; the user to be followed
    */
    this.followUser = async function(targetUser) {
        const result = await this._repo.createSubscription(this._id, targetUser._id)
        targetUser._data.followerCount += 1;
    }


    /**
    Unsubscribe the current user from the feed of another user on the platform
    @param (User) targetUser - an instance of the User class; the user to be un-followed
    */
    this.unfollowUser = async function(targetUser) {
        const result = await this._repo.removeSubscription(this._id, targetUser._id)
        targetUser._data.followerCount -= 1;
    }


    /**
    Indicates whether the current instance of User follows a user specified (i.e. targetUser)
    @param {User} targetUser - an instance of the User class; the user being inquired about
    @returns {Boolean}
    */
    this.isFollowing = async function(targetUser) {
        const subscriptionsList = await this._repo.getUserSubscriptions(this._id);
        const currentUserFollowsTargetUser = subscriptionsList.find((u) => u.id === targetUser._id);

        return (currentUserFollowsTargetUser !== undefined);
    }

    /**
    Returns a list of the users following the current user follows
    @returns {Array}
    */

    this.getFollowers = async function() {
        const followersList = await this._repo.getSubscribersOf(this._id);
        return followersList.map((u) => new User(this._repo, u));
    }

    /**
    Returns a list of users the current user is following
    @param (object) self
    @returns {Array}
    */
    this.follows = async function() {
        const subscriptionsList = await this._repo.getUserSubscriptions(this._id);
        return subscriptionsList.map((u) => new User(this._repo, u));
    }

}

function UserService(repo, validator = new UserValidator()) {

    this.createUser = async function(doc = {}) {
        await validator.validate(this, doc);
        return new User(repo, doc);
    }


    this.findUserById = async function(id) {
        const [user] = await repo.findOneById(id);
        return [new User(repo, user)];
    }


    this.findAllUsers = async function() {
        const users = await repo.findAll();
        return users.map((u) => new User(repo, u));
    }


    this.deleteUser = function(id) {
        return repo.deleteUser(id);
    }


    this.userExists = async function(id) {
        const result = await repo.findOneById(id);
        return result.length === 1 && result[0]["id"] === id;
    }


    this.emailAddressExists = async function(emailAddress) {
        const result = await repo.findOneByEmail(emailAddress);
        return result.length === 1 && result[0]["emailAddress"] === emailAddress;
    }

    this.handleExists = async function(handle) {
        const result = await repo.findOneByHandle(handle);
        return result.length === 1 && result[0]["handle"] === handle;
    }
}


function UserValidator() {

    this.validate = async function(userService, userData) {
        if (userData === undefined || (Object.keys(userData).length === 0)) {
            throw new Error("UserDataEmpty");
        }

        if (!userData.emailAddress) {
            throw new Error("MissingOrInvalidEmail.Missing")
        }

        if (!userData.phoneNumber) {
            throw new Error("MissingOrInvalidPhone");
        }

        if (!userData.firstName) {
            throw new Error("MissingOrInvalidFirstName");
        }

        if (!userData.lastName) {
            throw new Error("MissingOrInvalidLastName");
        }

        if (!userData.handle) {
            throw new Error("MissingOrInvalidHandle");
        }

        const emailAddressRegex = new RegExp(config.users.emailAddressRegex);
        const userHandleRegex = new RegExp(config.users.userHandleRegex);

        if (userHandleRegex.test(userData.handle) === false) {
            throw new Error("MissingOrInvalidHandle.FormatError");
        }

        if (emailAddressRegex.test(userData.emailAddress) === false) {
            throw new Error("MissingOrInvalidEmail.Format");
        }

        const handleExists = await userService.handleExists(userData.handle);
        if (handleExists) {
            throw new Error("MissingOrInvalidHandle.HandleExists");
        }

        const emailAddressExists = await userService.emailAddressExists(userData.emailAddress);
        if (emailAddressExists) {
            throw new Error("MissingOrInvalidEmail.EmailExists");
        }

    }

}

module.exports = { UserService, UserValidator };
