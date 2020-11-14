const requiredFields = [
    "userId",
    "postId",
    "body"
];

/**
 * Returns a schema object compatible for validation with AJV
 * @param {Boolean} validateWithRequiredFields 
 * @returns {Object} - a JSON schema document
 */

function getCommentSchema(validateWithRequiredFields) {
    const schema = {
        default: {},
        description: "The root schema comprises the entire JSON document.",
        examples: [
            {
                "userId": "e98417a8-d912-44e0-8d37-abe712ca840f",
                "body": "True story. FR.",
                "postId": "b1b0a890-1d15-4e97-a200-8a82124b3c65"
            }
        ],
        required: validateWithRequiredFields ? requiredFields : [],
        title: "Comment API Resource Schema (for validating incoming create and update API requests via /api/v1/users/:id/posts/:post_id/comments)",
        properties: {
            userId: {
                default: "",
                description: "The unique user id associated with a comment",
                examples: [
                    "e98417a8-d912-44e0-8d37-abe712ca840f"
                ],
                title: "The userId schema"
            },
            body: {
                default: "",
                description: "The body of the comment",
                examples: [
                    "True story. FR."
                ],
                title: "The body schema"
            },
            postId: {
                default: "",
                description: "The unique user id associated with a post",
                examples: [
                    "b1b0a890-1d15-4e97-a200-8a82124b3c65"
                ],
                title: "The handle schema"
            }
        },
        additionalProperties: false
    };

    return schema;
}


module.exports = getCommentSchema;