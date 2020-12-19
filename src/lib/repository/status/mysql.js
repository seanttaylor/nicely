/* istanbul ignore file */

/*Implements IStatusRepository interface for connecting to a MySQL database.
*See interfaces/status-repository for method documentation
*/

const { promisify } = require("util");

/**
 * @implements {IStatusRepository}
 * @param {Object} databaseConnector - object with methods for connecting to a database 
 */

function StatusMySQLRepository(databaseConnector) {

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

/*StatusMySQLRepository*/

module.exports = StatusMySQLRepository;
