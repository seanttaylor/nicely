const mocks = require("../../src/lib/utils/mocks");
const mockUserService = mocks.mockImpl.userService;
const mockCacheService = mocks.mockImpl.cache;
const DatabaseConnector = require("../../src/lib/database/connectors/mysql");
const testSqlDbConnector = new DatabaseConnector();

/*StatusService*/
const StatusRepository = require("../../src/lib/repository/status/mysql");
const IStatusRepository = require("../../src/interfaces/status-repository");
const statusRepo = new IStatusRepository(new StatusRepository(testSqlDbConnector));
const StatusService = require("../../src/services/status");
const testStatusService = new StatusService(statusRepo);

/**Tests**/

test("Should return a system report", async() => {
    const statusReport = await testStatusService.getSystemStatus();
    expect(typeof(statusReport) === "object").toBe(true);
    expect(statusReport.databaseConnectionEstablished).toBe(true);
});

