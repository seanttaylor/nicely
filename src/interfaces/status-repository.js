/* istanbul ignore file */


/**
* An object having the IStatusRepository API; a set of methods for analyzing system status
* @typedef {Object} IStatusRepositoryAPI
* @property {Function} getStatus - returns the system status
*/


/**
 * Interface for a repository of system status information
 * @param {IStatusRepositoryAPI} myImpl - object defining concrete implementations for interface methods
 */

function IStatusRepository(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }

    /**
    @returns {Object} a system status report
    */
    this.getSystemStatus = myImpl.getSystemStatus || required;


    const {
        getSystemStatus,
        ...optionalMethods
    } = myImpl;

    Object.assign(this, optionalMethods);

}

module.exports = IStatusRepository;