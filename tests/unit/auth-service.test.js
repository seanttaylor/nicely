const mocks = require("../../src/lib/utils/mocks");
const mockUser = mocks.mockImpl.user;
const mockCacheService = mocks.mockImpl.cache;
/*AuthService*/
const AuthService = require("../../src/services/auth");
const testAuthService = new AuthService({cacheService: mockCacheService});

/**Tests**/

test("Should assign a new authorization credential to a user", async() => {
    const credential = testAuthService.issueAuthCredential({user: mockUser, expiresIn: 100});
    //expect(mockUser.calledMethods.assignCredential).toBe(true);
    expect(typeof(credential) === "string").toBe(true);
});

test("Should expire an existing authorization credential", async() => {
    testAuthService.expireAuthCredential("xxxyyyzzz");
    expect(mockCacheService.calledMethods.del).toBe(true);
});

test("Should validate an existing authorization credential", async() => {
    testAuthService.validateAuthCredential("xxxyyyzzz");
    expect(mockCacheService.calledMethods.has).toBe(true);
});


