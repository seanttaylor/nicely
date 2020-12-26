const Ajv = require("ajv");
const uuid = require("uuid");
const ajv = new Ajv();
const dataTemplate = require("../template");

function InMemoryDatabaseConnector() {
    const data = Object.assign({}, dataTemplate);
    this._schemaValidators = {
        "comment_likes": require("../json/schemas/comment-likes.json"),
        "comments": require("../json/schemas/comments.json"),
        "posts": require("../json/schemas/posts.json"),
        "user_subscriptions": require("../json/schemas/user-subscriptions.json"),
        "user_roles": require("../json/schemas/user-roles.json"),
        "user_followers": require("../json/schemas/user-followers.json"),
        "user_credentials": require("../json/schemas/user-credentials.json"),
        "users": require("../json/schemas/users.json"),
    }


    /**
     * Add a document to the database.
     * @params {String} data - document to add to the database.
     * @params {String} collection - name of collection to add to.
     * @returns {Object}
     */

    this.add = async function({doc, collection}) {
        
        if (typeof(doc) !== "object") {
            throw new Error(`Record should be of type [Object] but is ${typeof(doc)} instead.`)
        }

        try {
            const validate = ajv.compile(this._schemaValidators[collection])
            const id = uuid.v4();
            const createdDate = new Date().toISOString();
            const lastModified = null;
            const record = Object.assign(doc, { id, createdDate, lastModified });
            
            if (!validate(record)) {
                throw new Error(`ValidationError => Schema => ${collection} ${JSON.stringify(validate.errors, null, 2)}`); 
            }

            data[collection][id] = record;             
            return [record];
            
        } catch(e) {
            console.error(`JSONDatabaseConnectorError => ${e.message}`);
        }
    }

    /**
     * Update a document in the database by id ONLY
     * @params {String} id - id of the document in the database
     * @params {String} doc - the update document
     * @params {String} collection - collection to update 
     * @returns {Object}
     */

    this.updateOne = async function({id, doc, collection}) {

        if (typeof(doc) !== "object") {
            throw new Error(`Record should be of type [Object] but is ${typeof(doc)} instead.`);
        }

        if (id === null) {
            throw new Error(`JSONDatabaseConnectorError => UpdateError => record id CANNOT be null`);
        }

        if (!Object.keys(this._schemaValidators).includes(collection)) {
            throw new Error(`JSONDatabaseConnectorError => UpdateError => collection (${collection}) does not exist`);
        }

        try {
            const validate = ajv.compile(this._schemaValidators[collection]);

            if (!data[collection][id]) {
                console.info(`JSONDatabaseConnector => UpdateError => Could not find ${collection}.${id}`);
                return Promise.resolve([]);
            }

            const record = Object.assign(data[collection][id], {
                lastModified: new Date().toISOString(),
                ...doc
            });

            if (!validate(record)) {
                throw new Error(`ValidationError => Schema => ${collection} ${JSON.stringify(validate.errors, null, 2)}`); 
            }
            
            data[collection][id] = record;
            
            return Promise.resolve([record]);
        } catch(e) {
            console.error("JSONDatabaseConnectorError =>", e);
        }
    }


    /**
     * Add a document to the database with a user-defined ID
     * @params {String} id - id of the document to create in the database
     * @params {String} doc - update document
     * @params {String} collection - collection to update 
     * @returns {Object}
     */

    this.putOne = async function({id, doc, collection}) {
        if (typeof(doc) !== "object") {
            throw new Error(`Record should be of type [Object] but is ${typeof(doc)} instead.`)
        }

        if (id === null) {
            throw new Error(`JSONDatabaseConnectorError => PutError => record id CANNOT be null`)
        }

        if (!Object.keys(this._schemaValidators).includes(collection)) {
            throw new Error(`JSONDatabaseConnectorError => PutError => Collection (${collection}) does not exist`)
        }

        try {
            const validate = ajv.compile(this._schemaValidators[collection]);
            const createdDate = new Date().toISOString();
            const lastModified = null
            const record = Object.assign(doc, { id, createdDate, lastModified });
            if (!validate(record)) {
                throw new Error(`ValidationError => Schema => ${collection} ${JSON.stringify(validate.errors, null, 2)}`); 
            }
            
            data[collection][id] = record;
            return Promise.resolve([record]);
        } catch(e) {
            console.error(`JSONDatabaseConnectorError =>", ${e.message}`);
        }
    }


    /**
     * Remove a document from a collection BY ID ONLY.
     * @params {String} id - Id of the document in the database.
     * @params {String} collection - Collection to from from. 
     * @returns {Object}
     */

    this.removeOne = async function(id, collection) {
        try {
            delete data[collection][id];            
            return [];
            
        } catch(e) {
            console.error(e);
        }
    }

    /**
     * Find all documents in a collection.
     * @params {String} collection - Collection to pull from. 
     * @returns {Object}
     */

    this.findAll = async function(collection) {
        try {
            return Promise.resolve(Object.values(data[collection]));
        } catch(e) {
           console.error(e);
        }
    }

    /**
     * Find a document in a collection by id
     * @params {String} id - id of the document 
     * @params {String} collection - collection to pull from
     * @returns {Object}
     */

    this.findOne = async function({id, collection}) {
        if (!Object.keys(this._schemaValidators).includes(collection)) {
            throw new Error(`JSONDatabaseConnectorError => FindOneError => Collection (${collection}) does not exist`);
        }

        try {
            
            if (!data[collection][id]) {
                return [];
            }
            
            return [data[collection][id]];
            
        } catch(e) {
           console.error(e);
        }
    }

    /**
     * Drop a collection from the database.
     * @params {String} collection - Collection to drop. 
     * @returns
     */

    this.drop = async function(collection) {
        delete dataFile[collection];
        return [];
    }
    
    /**
     * Closes an existing connection to the database.
     * This implementation does nothing as there is no database server connection.
     * @returns
     */
    this.close = function() {
        return [];
    }

}

module.exports = InMemoryDatabaseConnector;