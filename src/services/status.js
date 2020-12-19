/**
 * Verifies status of system and core services (e.g. database)
 * @param {Object} repo - the repo associated with this service 
 */

function StatusService(statusRepo) {

    this._repo = statusRepo;

    /**
     * Returns the status of the system
     * @returns an object whose fields describe the system status
    */

    this.getSystemStatus = async function() {
       const report = await this._repo.getSystemStatus();
       return {
           databaseConnectionEstablished: report.affectedRows === 1
        };
    }
}

module.exports = StatusService;