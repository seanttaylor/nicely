/* istanbul ignore file */

/**
 * Interface for a validator service
 * @interface
 * @param {Object} myImpl - object defining concrete implementations for interface methods
 */

function IValidator(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }

    /**
    Validates input data against specified criteria (e.g a JSON schema document)
    @param {Object} doc - dictionary representing a valid entry
    @returns {Boolean} - indicating whether the input data is valid 
    */
    this.validate = myImpl.validate || required;

    const {
        validate,
        ...optionalMethods
    } = myImpl;

    Object.assign(this, optionalMethods);

}


module.exports = IValidator;
