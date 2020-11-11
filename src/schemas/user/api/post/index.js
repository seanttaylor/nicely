const requiredFields = [
    "userId",
    "body",
    "handle"
];

/**
 * Returns a schema object compatible for validation with AJV
 * @param {Boolean} validateWithRequiredFields 
 * @returns {Object} - a JSON schema document
 */

function getPostSchema(validateWithRequiredFields) {
    const schema = {
        default: {},
        description: "The root schema comprises the entire JSON document.",
        examples: [
            {
                "userId": "e98417a8-d912-44e0-8d37-abe712ca840f",
                "body": "Playboy. Billionaire. Genius.",
                "handle": "@tstark"
            }
        ],
        required: validateWithRequiredFields ? requiredFields : [],
        title: "Post API Resource Schema (for validating incoming create and update API requests via /api/v1/users/:id/posts)",
        properties: {
            userId: {
                default: "",
                description: "The unique user id associated with a post.",
                examples: [
                    "e98417a8-d912-44e0-8d37-abe712ca840f"
                ],
                title: "The userId schema"
            },
            body: {
                default: "",
                description: "The body of the post",
                examples: [
                    "Playboy. Billionaire. Genius."
                ],
                title: "The body schema"
            },
            handle: {
                default: "",
                description: "The user handle associated with a post",
                examples: [
                    "@tstark"
                ],
                title: "The handle schema"
            }
        },
        additionalProperties: false
    };

    return schema;
}


module.exports = getPostSchema;