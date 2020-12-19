const dbMigrate = require("db-migrate");
const fs = require("fs").promises;
const path = require("path");
const readline = require("readline");
const migrationOptions = {
    configFilePath: null,
    environment: null,
    targetDirectory: null,
    useSQLFile: true
};

let upMigrationRunCount = 0;

async function create() {
    const migration = dbMigrate.getInstance(true, {
        cmdOptions: {
            env: migrationOptions.environment,
            config: migrationOptions.configFilePath,
            "migrations-dir": migrationOptions.targetDirectory,
            "sql-file": migrationOptions.useSQLFile
        }
    });

    const migrationName = await prompt("Migration name");
    migration.create(migrationName);
}

async function down(cwd) {
    const migration = dbMigrate.getInstance(true, {
        cmdOptions: {
            env: migrationOptions.environment,
            config: migrationOptions.configFilePath,
            "migrations-dir": migrationOptions.targetDirectory,
            "sql-file": migrationOptions.useSQLFile
        }
    });

    return migration.reset();
};


function run(arg) {
    const args = arg ? [arg] : process.argv.slice(2);
    if (!args.length) {
        help();
    } else {
        switch (args[0].toLowerCase()) {
            case "create":
                process.argv = [];
                create(__dirname, null, null);
                break;
            case "down":
                down(__dirname);
                break;
            case "up":
                up(__dirname);
                break;
            default:
                help();
        }
    }
}

async function up() {
    //if (upMigrationRunCount !== 0) {
    //    return;
    //}
    console.info("#################################################")
    console.info(`# Migration STARTED at ${new Date().toISOString()} #`);
    console.info("#################################################")

    const migration = dbMigrate.getInstance(true, {
        cmdOptions: {
            env: migrationOptions.environment,
            config: migrationOptions.configFilePath,
            "migrations-dir": migrationOptions.targetDirectory,
            "sql-file": migrationOptions.useSQLFile
        }
    });
    migration.silence(true);

    try {
        await migration.up();
    } catch (e) {
        console.error("Migration ERROR:", e);
        process.exit(1);
    }

    console.info("#####################################################");
    console.info(`# Migrations completed at ${new Date().toISOString()} #`);
    console.info("#####################################################");
}

/**
 * Add colon to end of input string if not present (formatting for prompt).
 * @param {string} message - The base message to prompt user with
 */
function addColonMaybe(message) {
    const endsWithColon = message.indexOf(":") === message.length - 1;
    return endsWithColon ? message : `${message}:`;
}

async function prompt(message) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const msg = `${addColonMaybe(message)} `;
    const res = await new Promise((resolve) => {
        rl.question(msg, (response) => resolve(response));
    });
    rl.close();

    return res;
}

/**
 * Wraps prompt with numerated options
 *
 * algo:
 * print a list of options with index + 1
 * select from index of options with result - 1
 *
 * @param {string} message - The base message to prompt user with
 * @param {Array<string>} options - List of options for the user
 */
async function promptOptions(message, options) {
    let messageWithOpts = options.reduce((acc, cur, idx) => {
        const res = `${acc}${idx + 1}. ${cur}\n`;
        return res;
    }, `${message}\n\n`);

    messageWithOpts += "\nEnter option number";

    const res = await prompt(messageWithOpts);
    return options[res - 1];
}

function of({ configFilePath, environment, targetDirectory }) {
    migrationOptions.configFilePath = configFilePath;
    migrationOptions.environment = environment;
    migrationOptions.targetDirectory = targetDirectory;

    return {
        create,
        down,
        up,
    }
}

module.exports = {
    of
};