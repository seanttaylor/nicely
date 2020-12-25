const uuid = require("uuid");
const events = require("events");
const eventEmitter = new events.EventEmitter();
const mocks = require("../../src/lib/utils/mocks/repo");
const { UserService } = require("../../src/services/user");
const UserRepository = require("../../src/lib/repository/user/json");
const { randomEmailAddress, randomPhoneNumber, randomUserHandle } = require("../../src/lib/utils");
const DatabaseConnector = require("../../src/lib/database/connectors/json");
const testJSONDbConnector = new DatabaseConnector({
    filePath: "/json-connector.json"
});
const IUserRepository = require("../../src/interfaces/user-repository");
const testUserJSONRepo = new IUserRepository(new UserRepository(testJSONDbConnector));
const testUserService = new UserService(testUserJSONRepo);
/**PostService**/
const { PostService } = require("../../src/services/post");
const PostRepository = require("../../src/lib/repository/post/json");
const IPostRepository = require("../../src/interfaces/post-repository");
const testPostJSONRepo = new IPostRepository(new PostRepository(testJSONDbConnector));
const testPostService = new PostService({
    repo: testPostJSONRepo,
    userService: testUserService,
    eventEmitter
});

/**Tests**/
afterAll(()=> {
    //testSqlDbConnector.end();
});

test("Should return new User instance", async() => {
    const testUserData = {
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber()
    };
    const testUser = await testUserService.createUser(testUserData);
    expect(Object.keys(testUser).includes("_id")).toBe(true);
    expect(Object.keys(testUser).includes("_repo")).toBe(true);
    expect(Object.keys(testUser).includes("_data")).toBe(true);
});


test("Should return list of User instances", async() => {
    const result = await testUserService.findAllUsers();

    expect(Array.isArray(result)).toBe(true);
    expect(Object.keys(result[0]).includes("_id")).toBe(true);
    expect(Object.keys(result[0]).includes("_repo")).toBe(true);
    expect(Object.keys(result[0]).includes("_data")).toBe(true);

});

test("Should return a specified User instance", async() => {
    const testUserData = {
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber()
    };
    const testUser = await testUserService.createUser(testUserData);
    const testUserId = await testUser.save();
    const result = await testUserService.findUserById(testUserId);

    expect(uuid.validate(testUserId)).toBe(true);
    expect(result[0]._id === testUserId).toBe(true);

});



test("Should delete user", async() => {
    //FUNCTIONALITY NOT IMPLEMENTED YET
    const result = await testUserService.deleteUser("fakeUserId");
    expect(result == undefined).toBe(true);
});


test("Should return user id on save", async() => {
    const testUserData = {
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber()
    };
    const testUser = await testUserService.createUser(testUserData);
    const userId = await testUser.save();
    expect(uuid.validate(userId)).toBe(true);
});

test("Should update user first name", async() => {
    const testFirstnameEdit = "Brucie";
    const testUser = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber()
    });
    const id = await testUser.save();
    testUser.editName({ firstName: testFirstnameEdit });

    expect(testUser._data.firstName === testFirstnameEdit).toBe(true);
});


test("Should update user last name", async() => {
    const testLastnameEdit = "Banner, M.D.";
    const testUser = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: testLastnameEdit,
        phoneNumber: randomPhoneNumber()
    });
    const id = await testUser.save();
    testUser.editName({ lastName: testLastnameEdit });

    expect(testUser._data.lastName === testLastnameEdit).toBe(true);
});


test("Should update user motto", async() => {
    const testMottoEdit = "Always be smashing";
    const testUser = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber()
    });
    const id = await testUser.save();
    testUser.editMotto(testMottoEdit);

    expect(testUser._data.motto === testMottoEdit).toBe(true);
});


test("Should update user phone number", async() => {
    const testPhoneNumberEdit = randomPhoneNumber();
    const testUser = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber()
    });
    const id = await testUser.save();
    await testUser.editPhoneNumber(testPhoneNumberEdit);

    expect(testUser._data.phoneNumber === testPhoneNumberEdit).toBe(true);
});


test("Should return false when a user does NOT exist", async() => {
    const fakeUserId = new Date().toISOString();
    const result = await testUserService.userExists(fakeUserId);

    expect(result).toBe(false);
});

test("Should add a follower to an existing user", async() => {
    const testUserNo1 = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber()
    });
    await testUserNo1.save();

    const testUserNo2 = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Let's do this!",
        emailAddress: randomEmailAddress(),
        firstName: "Steve",
        lastName: "Rogers",
        phoneNumber: randomPhoneNumber()
    });

    await testUserNo2.save();
    await testUserNo2.followUser(testUserNo1);
    const isFollowing = await testUserNo2.isFollowing(testUserNo1);

    expect(isFollowing).toBe(true);
});

test("Should return list of followers", async() => {
    const testUserNo1 = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber()
    });
    const testUserNo1Id = await testUserNo1.save();

    const testUserNo2 = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Let's do this!",
        emailAddress: randomEmailAddress(),
        firstName: "Steve",
        lastName: "Rogers",
        phoneNumber: randomPhoneNumber()
    });

    const testUserNo2Id = await testUserNo2.save();
    await testUserNo2.followUser(testUserNo1);
    const followerList = await testUserNo1.getFollowers();

    expect(Array.isArray(followerList)).toBe(true);
    expect(followerList[0]["_id"] === testUserNo2Id).toBe(true);
    expect(followerList.length === 1).toBe(true);
});


test("Should return list of a users a specified user follows", async() => {
    const testUserNo1 = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber()
    });
    const testUserNo1Id = await testUserNo1.save();

    const testUserNo2 = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Let's do this!",
        emailAddress: randomEmailAddress(),
        firstName: "Steve",
        lastName: "Rogers",
        phoneNumber: randomPhoneNumber()
    });

    const testUserNo2Id = await testUserNo2.save();
    await testUserNo2.followUser(testUserNo1);
    const usersFollowed = await testUserNo2.follows();

    expect(Array.isArray(usersFollowed)).toBe(true);
    expect(usersFollowed[0]["_id"] === testUserNo1._id);
    expect(usersFollowed.length === 1).toBe(true);

});


test("Should increment a specified user's follower count", async() => {
    const testUserNo1 = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber()
    });
    const testUserNo1Id = await testUserNo1.save();

    const testUserNo2 = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Let's do this!",
        emailAddress: randomEmailAddress(),
        firstName: "Steve",
        lastName: "Rogers",
        phoneNumber: randomPhoneNumber()
    });

    const testUserNo2Id = await testUserNo2.save();
    await testUserNo2.followUser(testUserNo1);

    expect(testUserNo1._data["followerCount"] === 1).toBe(true);
});


test("Should unfollow the current user from a specified user", async() => {
    const testUserNo1 = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber()
    });
    const testUserNo1Id = await testUserNo1.save();

    const testUserNo2 = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Let's do this!",
        emailAddress: randomEmailAddress(),
        firstName: "Steve",
        lastName: "Rogers",
        phoneNumber: randomPhoneNumber()
    });

    const testUserNo2Id = await testUserNo2.save();
    await testUserNo2.followUser(testUserNo1);
    await testUserNo2.unfollowUser(testUserNo1);

    expect(testUserNo1._data["followerCount"] === 0).toBe(true);
});


test("Should return a user role", async() => {
    const [user] = await testUserService.findUserById("e98417a8-d912-44e0-8d37-abe712ca840f");
    const userRole = await testUserService.getUserRole(user);

    expect(userRole === "admin").toBe(true);
});


test("Should create a new user password", async() => {
    const testUserData = {
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber()
    };
    const testUser = await testUserService.createUser(testUserData);
    const testUserId = await testUser.save();
    const testPassword = await testUserService.createUserPassword.call(mocks, {password: "xxxyyyzzz", user: testUser});
  
    expect(mocks._repo.calledMethods.createUserPasswordCalled).toBe(true);
});

test("Should return true when plain-text password and equivalent hash match", async() => {
    const testUserData = {
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber()
    };
    const testUser = await testUserService.createUser(testUserData);
    const testUserId = await testUser.save();
    const testPasswordHash = await testUserService.createUserPassword({password: "xxxyyyzzz", user: testUser});
    const passwordMatches = await testUserService.isUserPasswordCorrect({password: "xxxyyyzzz", user: testUser});
  
    expect(passwordMatches).toBe(true);
});


test("Should return posts from all users a specified user follows", async() => {
    const testUserNo1 = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber()
    });
    const testUserNo1Id = await testUserNo1.save();

    const testUserNo2 = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Let's do this!",
        emailAddress: randomEmailAddress(),
        firstName: "Steve",
        lastName: "Rogers",
        phoneNumber: randomPhoneNumber()
    });

    const testUserNo2Id = await testUserNo2.save();
    await testUserNo2.followUser(testUserNo1);

    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: testUserNo1Id,
        handle: randomUserHandle()
    });
    
    const postId = await testPost.save();
    const feed = await testPostService.getPostsBySubscriber(testUserNo2._id);
    
    expect(Array.isArray(feed) === true).toBe(true);
    expect(feed.length === 1).toBe(true);
});

test("Should return JSON object representation", async() => {
    const testUser = await testUserService.createUser({
        handle: randomUserHandle(),
        motto: "Let's do this!",
        emailAddress: randomEmailAddress(),
        firstName: "Steve",
        lastName: "Rogers",
        phoneNumber: randomPhoneNumber()
    });

    await testUser.save();
    expect(typeof(testUser.toJSON()) === "object").toBe(true);
});


/*Negative Tests*/

test("Should return FALSE when plain-text password and hash do NOT match", async() => {
    const testUserData = {
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber()
    };
    const testUser = await testUserService.createUser(testUserData);
    const testUserId = await testUser.save();

    const testPasswordHash = await testUserService.createUserPassword({password: "xxxyyyzzz", user: testUser});
    const passwordMatches = await testUserService.isUserPasswordCorrect({password: "foobarbaz", user: testUser});
  
    expect(passwordMatches).toBe(false);
});


test("Should throw exception when attempting to create an invalid user", async() => {
    try {
        await testUserService.createUser();
    }
    catch (e) {
        expect(e.message).toMatch("UserDataEmpty");
    }
});

test("Should throw an exception when email address is missing", async() => {
    try {
        await testUserService.createUser({
            handle: randomUserHandle(),
            motto: "Hulk smash!",
            firstName: "Bruce",
            lastName: "Banner",
            phoneNumber: randomPhoneNumber()
        });
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidEmail.Missing");
    }
});

test("Should throw an exception when first name is missing", async() => {
    try {
        await testUserService.createUser({
            handle: randomUserHandle(),
            motto: "Hulk smash!",
            lastName: "Banner",
            emailAddress: randomEmailAddress(),
            phoneNumber: randomPhoneNumber()
        });
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidFirstName");
    }
});

test("Should throw an exception when last name is missing", async() => {
    try {
        await testUserService.createUser({
            handle: randomUserHandle(),
            motto: "Hulk smash!",
            firstName: "Bruce",
            emailAddress: randomEmailAddress(),
            phoneNumber: randomPhoneNumber()
        });
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidLastName");
    }
});

test("Should throw exception when handle is missing", async() => {
    try {
        await testUserService.createUser({
            motto: "Hulk smash!",
            firstName: "Bruce",
            lastName: "Banner",
            emailAddress: randomEmailAddress(),
            phoneNumber: randomPhoneNumber()
        });
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidHandle");
    }
});


test("Should throw exception when handle is invalid", async() => {
    try {
        const testHandle = randomUserHandle();
        const testUserNo1 = await testUserService.createUser({
            emailAddress: randomEmailAddress(),
            handle: testHandle,
            firstName: "Bruce",
            lastName: "Banner",
            phoneNumber: randomPhoneNumber()
        });
        await testUserNo1.save();
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidHandle.Format");
    }
});


test("Should throw exception when creating user with handle that already exists", async() => {
    try {
        const testHandle = randomUserHandle();
        const testUserNo1 = await testUserService.createUser({
            emailAddress: randomEmailAddress(),
            handle: testHandle,
            firstName: "Bruce",
            lastName: "Banner",
            phoneNumber: randomPhoneNumber()
        });
        await testUserNo1.save();

        const testUserNo2 = await testUserService.createUser({
            emailAddress: randomEmailAddress(),
            handle: testHandle,
            firstName: "Bruce",
            lastName: "Banner",
            phoneNumber: randomPhoneNumber()
        });
        await testUserNo2.save();
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidHandle.HandleExists");
    }
});

test("Should throw exception when phone number is missing", async() => {
    try {
        await testUserService.createUser({
            motto: "Hulk smash!",
            firstName: "Bruce",
            lastName: "Banner",
            emailAddress: randomEmailAddress()
        });
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidPhone");
    }
});

test("Should throw exception when creating a user with an email that already exists", async() => {
    try {
        const testEmailAddress = randomEmailAddress();
        const testUserNo1 = await testUserService.createUser({
            emailAddress: testEmailAddress,
            handle: randomUserHandle(),
            firstName: "Bruce",
            lastName: "Banner",
            phoneNumber: randomPhoneNumber()
        });
        await testUserNo1.save();

        const testUserNo2 = await testUserService.createUser({
            emailAddress: testEmailAddress,
            handle: randomUserHandle(),
            firstName: "Bruce",
            lastName: "Banner",
            phoneNumber: randomPhoneNumber()
        });
        await testUserNo2.save();
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidEmail.EmailExists");
    }
});


test("Should throw exception when creating user with invalid email address", async() => {
    try {
        const testHandle = randomUserHandle();
        const testUserNo1 = await testUserService.createUser({
            emailAddress: "invalid-email@",
            handle: testHandle,
            firstName: "Bruce",
            lastName: "Banner",
            phoneNumber: randomPhoneNumber()
        });
        await testUserNo1.save();
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidEmail.Format");
    }
});

test("Should throw exception when creating user with invalid handle", async() => {
    try {
        const testUserNo1 = await testUserService.createUser({
            emailAddress: randomEmailAddress(),
            handle: "xxzzz@",
            firstName: "Bruce",
            lastName: "Banner",
            phoneNumber: randomPhoneNumber()
        });
        await testUserNo1.save();
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidHandle.FormatError");
    }
});
