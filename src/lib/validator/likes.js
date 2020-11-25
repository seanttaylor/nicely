/*Implements IValidator interface for validating arbitrary data
* See interfaces/validator for method documentation
*/


/**
 * @implements {IValidator}
 */

function likeValidator() {

    /** 
    @param {Object} options - an options object containing configuration data for the validation
    @param {Object} data - the data to be validated 
    @param {Boolean} options.validateWithRequiredFields - indicates whether the required fields will be enforced during validation 
    @param {String} options.schema - the schema to use for validation
    @returns {Boolean}
    */

    this.validate = function(options, data) {
        if (!data) {
            throw new Error("ValidationDataEmpty");
        }

        const {validateWithRequiredFields, schema} = options;
        const mySchema = this._validators[schema](validateWithRequiredFields);
        const validate = ajv.compile(mySchema);
        const valid = validate(data);
        if (!valid) {
            return  {
                result: false,
                errors: validate.errors
            }   
        }
        return {
            result: true,
            errors: null
        };
    }
}

module.exports = JSONValidator;