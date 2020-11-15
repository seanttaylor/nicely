/**
 * Interface for a repository of users
 *
 * @interface
 * @param {Object} myImpl - object defining concrete implementations for interface methods
 */

function IUserRepository(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }

    /**
    Creates a new user in the data store.
    @param {Object} doc - dictionary representing a valid entry
    @returns {String} - a uuid for the new user
    */
    this.create = myImpl.create || required;

    /**
    Finds a user in the data store by uuid.
    @param {String} id - uuid of the user
    @returns {Object} - the requested user
    */
    this.findOneById = myImpl.findOneById || required;

    /**
    Finds all users in the data store
    @returns {Array} - a list of all records in the data store
    */
    this.findAll = myImpl.findAll || required;

    /**
    Update user.firstName and/or user.lastName properties
    @param {String} id - uuid of the usr
    @param {Object} doc - object containing user first name and last name
    */
    this.editName = myImpl.editName || required;

    /**
    Update user.motto property
    @param {String} id - uuid of the usr
    @param {Object} doc - object containing user motto
    */
    this.editMotto = myImpl.editMotto || required;

    /**
    Deletes a user in the data store by its uuid.
    @param {String} id - uuid of the user
    */
    this.delete = myImpl.delete || required;

    const {
        editMotto,
        editName,
        findAll,
        findOne,
        create,
        ...optionalMethods
    } = myImpl;

    Object.assign(this, optionalMethods);

}


module.exports = IUserRepository;
