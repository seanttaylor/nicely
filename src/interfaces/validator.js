/* istanbul ignore file */

/**
* An object having the IValidatorAPI; a set of methods for validating data
* @typedef {Object} IValidatorAPI
* @property {Function} validate - Validates input data against specified criteria (e.g a JSON schema document)
*/

/**
 * Interface for a validator service
 * @param {IValidatorAPI} myImpl - object defining concrete implementations for interface methods
 */

function IValidator(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }

    /**
    @param {Object} doc - dictionary representing a valid entry
    @returns {Boolean} indicating whether the input data is valid 
    */
    this.validate = myImpl.validate || required;

    const {
        validate,
        ...optionalMethods
    } = myImpl;

    Object.assign(this, optionalMethods);

}


module.exports = IValidator;
