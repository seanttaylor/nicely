const IValidator = require("../../interfaces/validator");
const JSONValidator = require("../validator/json");
const schemas = require("../../schemas/user/api");
const validatorService = new IValidator(new JSONValidator(schemas));

/**
 * 
 * @param {Object} options 
 * @param {Boolean} options.requiredFields - indicates whether validation is performed against all required fields
 * @param {String} options.schema - name of the schema to perform validation against
 */
function validateRequestWith(options) {
    return function(req, res, next) {
        const validation = validatorService.validate({
            validateWithRequiredFields: options.requiredFields, 
            schema: options.schema
        }, req.body);
        
        if (!validation.result) {
            //console.error(validation.errors)
            res.status(400);
            res.json({
                data: [],
                errors: validation.errors,
                entries: 0
            });
            return;
        }
        next();
    }
}
 
 module.exports = validateRequestWith;