const mysql = require("mysql");
const { promisify } = require("util");

function MySQLDatabaseAdapter() {
    const pool = mysql.createPool({
        connectionLimit: 35,
        host: process.env.DATABASE_HOSTNAME,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    });


    return {
        getConnection: promisify(pool.getConnection.bind(pool))
    }
}



module.exports = MySQLDatabaseAdapter;
