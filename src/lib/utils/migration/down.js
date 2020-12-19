const MigrationTool = require("./index");
/**
 * Runs a `down` migration on a MySQL database
 * @param {Object} migrationTool - an object having the MigrateableAPI
 */

(function down(migrationTool) {
    migrationTool.down();
}(MigrationTool));