const mysql = require("mysql");
const { promisify } = require("util");

/**
 * Provides connection to a MySQL database instance
 * @returns {Object} connectorAPI - object with methods for handling database connections
 */

function MySQLDatabaseConnector() {
    const pool = mysql.createPool({
        connectionLimit: 1500,
        host: process.env.DATABASE_HOSTNAME,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    });


    return {
        getConnection: promisify(pool.getConnection.bind(pool)),
        end: pool.end.bind(pool)
    }
}



module.exports = MySQLDatabaseConnector;
