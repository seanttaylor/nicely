const fs = require("fs");
const uuid = require("uuid");
const { promisify } = require("util");
const writeToFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

function JSONDatabaseConnector({ filePath }) {
    const databaseLocation = `${__dirname}${filePath}`;
    const dataFile = require(databaseLocation);
    this._dataFilePath = databaseLocation;


    /**
     * A a document to the database.
     * @params {String} data - document to add to the database.
     * @params {String} collection - name of collection to add to.
     * @returns {Object}
     */

    this.add = async function({doc, collection}) {
        
        if (typeof(doc) !== "object") {
            throw new Error(`Record should be of type [Object] but is ${typeof(doc)} instead.`)
        }

        try {
            const fileDB = await readFile(this._dataFilePath, "utf-8");
            const data = JSON.parse(fileDB);
            const id = uuid.v4();
            const createdDate = new Date().toISOString();
            const lastModified = null
            const record = Object.assign(doc, { id, createdDate, lastModified });
            
            data[collection][id] = record;
            await writeToFile(this._dataFilePath, JSON.stringify(data, null, 2));
             
            return {
                data: [record]
            }
            
        } catch(e) {
            console.error(e);
        }
    }

    /**
     * Update a document in the database BY ID ONLY.
     * @params {String} id - Id of the document in the database.
     * @params {String} doc - Update document.
     * @params {String} collection - collection to update. 
     * @returns {Object}
     */

    this.updateOne = async function({id, doc, collection}) {
        try {
            const fileDB = await readFile(this._dataFilePath, "utf-8");
            const data = JSON.parse(fileDB);
            const record = Object.assign(data[collection][id], {
                lastModified: new Date().toISOString(),
                ...doc
            });
            
            data[collection][id] = record;
            await writeToFile(this._dataFilePath, JSON.stringify(data, null, 2));
            
            return {
                data: [record]
            }
        } catch(e) {
           console.error(e);
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
            const fileDB = await readFile(this._dataFilePath, "utf-8");
            const data = JSON.parse(fileDB);
            delete data[collection][id];
            await writeToFile(this._dataFilePath, JSON.stringify(data, null, 2));
            
            return {
                data: []
            }
            
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
            const fileDB = await readFile(this._dataFilePath, "utf-8");
            const data = JSON.parse(fileDB);
            return {
                data: Object.values(data[collection]),
            }
        } catch(e) {
           console.error(e);
        }
    }

    /**
     * Find a document in a collection BY ID ONLY.
     * @params {String} id - Id of the document. 
     * @params {String} collection - Collection to pull from. 
     * @returns {Object}
     */

    this.findOneById = async function({id, collection}) {
        try {
            const fileDB = await readFile(this._dataFilePath, "utf-8");
            const data = JSON.parse(fileDB);
            
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
        await writeToFile(this._dataFilePath, JSON.stringify(dataFile, null, 2));
        return {
            data: []
        }
    }
    
    /**
     * Closes an existing connection to the database.
     * This implementation does nothing as there is no database server connection.
     * @returns
     */
    this.close = function() {
        return {
          data: []
        };
    }

}

module.exports = JSONDatabaseConnector;