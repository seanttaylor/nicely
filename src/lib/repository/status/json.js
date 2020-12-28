/* istanbul ignore file */

/*Implements IStatusRepository interface for connecting to a JSON file or in-memory document database
*See interfaces/status-repository for method documentation
*/


/**
 * @implements {IStatusRepository}
 * @param {Object} databaseConnector - object with methods for connecting to a database 
 */

function StatusJSONRepository(databaseConnector) {

    this.getSystemStatus = async function() {
        const uuid = require("uuid");
        const id = uuid.v4();
        const createdDate = new Date().toISOString();
        const connection = await databaseConnector.getConnection();
        const runQueryWith = promisify(connection.query.bind(connection));
        const insertDatabaseStatus = `INSERT INTO status (id, created_date) VALUES ('${createdDate}', '${id}')`;

        const result = await runQueryWith(insertDatabaseStatus);
        connection.release();
        return result;
    }

}

/*StatusJSONRepository*/

module.exports = StatusJSONRepository;