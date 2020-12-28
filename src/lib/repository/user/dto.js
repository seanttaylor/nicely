const Ajv = require("ajv");
const ajv = new Ajv();
const userSchema = require("../../database/connectors/json/schemas/users.json");
const userRoleSchema = require("../../database/connectors/json/schemas/user-roles.json");
const userFollowersSchema = require("../../database/connectors/json/schemas/user-followers.json");
const userSubscriptionsSchema = require("../../database/connectors/json/schemas/user-subscriptions.json");
const userCredentialsSchema = require("../../database/connectors/json/schemas/user-credentials.json");
const userSchemaValidation = ajv.compile(userSchema);
const userRoleSchemaValidation = ajv.compile(userRoleSchema);
const userFollowersSchemaValidation = ajv.compile(userFollowersSchema);
const userSubscriptionsSchemaValidation = ajv.compile(userSubscriptionsSchema);
const userCredentialsSchemaValidation = ajv.compile(userCredentialsSchema);


/**
 * @typedef {Object} UserDTO
 * @property {String} id 
 * @property {String} handle
 * @property {String} emailAddress
 * @property {String} phoneNumber
 * @property {String} firstName
 * @property {String} lastName
 * @property {Boolean} isVerified
 * @property {Integer} followerCount
 * @property {String} createdDate  
 * @property {String|null} lastModified
 * @property {String|null} motto
 */

 /**
  * @param {String} id - uuid for a user
  * @param {String} handle - unique user handle
  * @param {String} emailAddress - email address for a user
  * @param {String} phoneNumber - phone number for a user
  * @param {String} firstName - user first name
  * @param {String} lastName - user last name
  * @param {String} createdDate - date a user was created
  * @param {Boolean} isVerified - indicates whether a user's account has been verified
  * @param {Integer} followerCount - number of platform users following this user
  * @param {String|null} motto - short user-defined motto
  * @param {String|null} lastModified - data post was last modified
  * @returns {UserDTO}
  */

function UserDTO({id, handle, emailAddress, phoneNumber, firstName, lastName, createdDate=new Date().toISOString(), lastModified=null, motto=null, isVerified=false, followerCount=0}) {
    const userData = {
      id, 
      handle, 
      emailAddress, 
      phoneNumber: String(phoneNumber),
      firstName, 
      lastName,
      motto,
      isVerified,
      followerCount,
      createdDate, 
      lastModified
    };
  
  if(!userSchemaValidation(userData)) {
    throw new Error(`UserDTOError/InvalidUserDTO => ${JSON.stringify(userSchemaValidation.errors, null, 2)}`);
  }

  this.value = function() {
    return userData;
  }

}


/**
 * @typedef {Object} UserRoleDTO
 * @property {String} id 
 * @property {String} role
 * @property {String} createdDate  
 * @property {String|null} lastModified
 */

 /**
  * @param {String} id - uuid for a user
  * @param {String} role - role for a user
  * @param {String} createdDate - date the role was created
  * @param {String|null} lastModified - data role was last modified
  * @returns {UserRoleDTO}
  */

 function UserRoleDTO({id, role="user", createdDate=new Date().toISOString(), lastModified=null}) {
    const userRoleData = {
        id,
        role,
        createdDate,
        lastModified
    };
  
  if(!userRoleSchemaValidation(userRoleData)) {
    throw new Error(`UserRoleDTOError/InvalidUserRoleDTO => ${JSON.stringify(userRoleSchemaValidation.errors, null, 2)}`);
  }

  this.value = function() {
    return userRoleData;
  }

}


/**
 * @typedef {Object} UserFollowersDTO
 * @property {String} id 
 * @property {String[]} followers
 * @property {String} createdDate  
 * @property {String|null} lastModified
 */

 /**
  * @param {String} id - uuid for a user
  * @param {String[]} followers - a list of uuids referencing platform users who follow this user
  * @param {String} createdDate - date the user follower list was created
  * @param {String|null} lastModified - date the user follower list was last modified
  * @returns {UserFollowersDTO}
  */

 function UserFollowersDTO({id, followers=[], createdDate=new Date().toISOString(), lastModified=null}) {
    const userFollowerData = {
        id,
        followers,
        createdDate,
        lastModified
    };
  
  if(!userFollowersSchemaValidation(userFollowerData)) {
    throw new Error(`UserFollowersDTOError/InvalidUserFollowersDTO => ${JSON.stringify(userFollwersSchemaValidation.errors, null, 2)}`);
  }

  this.value = function() {
    return userFollowerData;
  }

}


/**
 * @typedef {Object} UserSubscriptionsDTO
 * @property {String} id 
 * @property {String[]} subscriptions
 * @property {String} createdDate  
 * @property {String|null} lastModified
 */

 /**
  * @param {String} id - uuid for a user
  * @param {String[]} subscriptions - a list of uuids referencing platform users who follow this user
  * @param {String} createdDate - date the user subscrptions list was created
  * @param {String|null} lastModified - date the user subscriptions list was last modified
  * @returns {UserSubscriptionsDTO}
  */

 function UserSubscriptionsDTO({id, subscriptions=[], createdDate=new Date().toISOString(), lastModified=null}) {
    const userSubscriptionData = {
        id,
        subscriptions,
        createdDate,
        lastModified
    };
  
  if(!userSubscriptionsSchemaValidation(userSubscriptionData)) {
    throw new Error(`UserSubscriptionsDTOError/InvalidUserSubscriptionsDTO => ${JSON.stringify(userSubscriptionsSchemaValidation.errors, null, 2)}`);
  }

  this.value = function() {
    return userSubscriptionData;
  }

}


/**
 * @typedef {Object} UserCredentialsDTO
 * @property {String} userId 
 * @property {String} emailAddress
 * @property {String[]} password
 * @property {String} createdDate  
 * @property {String|null} lastModified
 */

 /**
  * @param {String} id - uuid for a user
  * @param {String} emailAddress - email address for a user
  * @param {String} password - user password hash
  * @param {String} createdDate - date the user credential was created
  * @param {String|null} lastModified - date the user credential was last modified
  * @returns {UserCredentialsDTO}
  */

 function UserCredentialsDTO({id, emailAddress, password, createdDate=new Date().toISOString(), lastModified=null}) {
    const userCredentialData = {
        id: emailAddress,
        userId: id,
        emailAddress,
        password,
        createdDate,
        lastModified
    };
  
  if(!userCredentialsSchemaValidation(userCredentialData)) {
    throw new Error(`UserCredentialsDTOError/InvalidUserCredentialsDTO => ${JSON.stringify(userCredentialsSchemaValidation.errors, null, 2)}`);
  }

  this.value = function() {
    return userCredentialData;
  }

}



module.exports = {
    UserDTO, 
    UserRoleDTO, 
    UserFollowersDTO, 
    UserSubscriptionsDTO,
    UserCredentialsDTO
};