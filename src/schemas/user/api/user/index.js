const requiredFields = [
    "motto",
    "handle",
    "firstName",
    "lastName",
    "phoneNumber",
    "emailAddress",
    "password"
];

/**
 * Returns a schema object compatible for validation with AJV
 * @param {Boolean} validateWithRequiredFields 
 * @returns {Object} - a JSON schema document
 */

function getUserSchema(validateWithRequiredFields) {
    const schema = {
        default: {},
        description: "The root schema comprises the entire JSON document.",
        examples: [
            {
                "motto": "Always bet on black",
                "handle": "@nfury",
                "firstName": "Nick",
                "lastName": "Fury",
                "phoneNumber": "2125552424",
                "emailAddress": "nfury@shield.gov",
                "password": "superSecretPassword"
            }
        ],
        required: validateWithRequiredFields ? requiredFields : [],
        title: "User API Resource Schema (for validating incoming create and update API requests via /api/v1/users)",
        properties: {
            motto: {
                default: "",
                description: "The user's motto. Displayed beside their handle and display name in the UI",
                examples: [
                    "Always bet on black"
                ],
                title: "The motto schema"
            },
            handle: {
                default: "",
                description: "The user handle",
                examples: [
                    "@nfury"
                ],
                title: "The handle schema",
                type: "string",
                //TODO: Figure the correct escape sequence for RegExes embedded in strings
                //pattern: "/@[a-zA-Z0-9_]{1,}/g"
            },
            firstName: {
                default: "",
                description: "User's first name",
                examples: [
                    "Nick"
                ],
                title: "The firstName schema"
            },
            lastName: {
                default: "",
                description: "User's last name",
                examples: [
                    "Fury"
                ],
                title: "The lastName schema"
            },
            phoneNumber: {
                default: "",
                description: "User's phone number",
                examples: [
                    "2125552424"
                ],
                title: "The phoneNumber schema",
                minLength: 10
            },
            emailAddress: {
                default: "",
                description: "User's email address",
                examples: [
                    "nfury@shield.gov"
                ],
                title: "The emailAddress schema",
                type: "string",
                format: "email"
            },
            password: {
                default: "",
                description: "User's account password",
                examples: [
                    "superSecretPassword"
                ],
                title: "The password schema",
                type: "string"
            }
        },
        additionalProperties: false
    }
    return schema;
}

module.exports = getUserSchema;