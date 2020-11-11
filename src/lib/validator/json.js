/*Implements IValidator interface for validating arbitrary data
* See interfaces/validator for method documentation
*/

const Ajv = require("ajv");
const ajv = new Ajv();


/**
 * 
 * @param {Object} validators - an object whose methods return JSON schema documents
 */

function JSONValidator(validators={}) {
    this._validators = validators;

    /** 
    @param {Object} options - an options object containing configuration data for the validation
    @param {Object} data - the data to be validated 
    @param {Boolean} options.validateWithRequiredFields - indicates whether the required fields will be enforced during validation 
    @param {String} options.schema - the schema to use for validation
    @returns {Boolean}
    */

    this.validate = function(options, data) {
        const {validateWithRequiredFields, schema} = options;
        const mySchema = this._validators[schema](validateWithRequiredFields);
        const validate = ajv.compile(mySchema);
        const valid = validate(data);
        if (!valid) {
            throw new Error(`ValidationError:${[schema]}: ${JSON.stringify(validate.errors)}`);
        }
        return valid;
    }
}

module.exports = JSONValidator;