const MigrationTool = require("./index");

/**
 * Create a new migration on a MySQL database
 * @param {Object} migrationTool - an object having the MigrateableAPI
 */

(function create(migrationTool) {
    migrationTool.create();
}(MigrationTool));