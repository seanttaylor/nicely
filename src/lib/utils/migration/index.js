const MigrationTool = require("./tool");
const environment = process.env.NODE_ENV || "local";

console.info("#####################################################");
console.info(`Checking for migrations on [${environment}] environment `);
console.info("#####################################################");

const myDbMigrationTool = MigrationTool.of({
    environment,
    configFilePath: "./database.json",
    targetDirectory: "./migrations"
});

module.exports = myDbMigrationTool;