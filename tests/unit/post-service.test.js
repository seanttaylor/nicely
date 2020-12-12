const uuid = require("uuid");
const events = require("events");
const eventEmitter = new events.EventEmitter();
const { randomEmailAddress, randomPhoneNumber, randomUserHandle } = require("../../src/lib/utils");
const { mocks, mockImpl } = require("../../src/lib/utils/mocks");
const DatabaseConnector = require("../../src/lib/database/connectors/mysql");
const testSqlDbConnector = new DatabaseConnector();
/**UserService**/
const { UserService } = require("../../src/services/user");
const UserRepository = require("../../src/lib/repository/user/mysql");
const IUserRepository = require("../../src/interfaces/user-repository");
const testUserMySqlRepo = new IUserRepository(new UserRepository(testSqlDbConnector));
const testUserService = new UserService(testUserMySqlRepo);
/**PostService**/
const { PostService } = require("../../src/services/post");
const PostRepository = require("../../src/lib/repository/post/mysql");
const IPostRepository = require("../../src/interfaces/post-repository");
const testPostMySqlRepo = new IPostRepository(new PostRepository(testSqlDbConnector));
const testPostService = new PostService({
    repo: testPostMySqlRepo,
    userService: testUserService,
    eventEmitter
});

/**Tests**/
afterAll(()=> {
    testSqlDbConnector.end();
});

const thorUserId = "b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09";

test("Should return new Post instance", async() => {
    const testBody = "Everybody wants a happy ending, right? But it doesn’t always roll that way.";
    const testPost = await testPostService.createPost({
        body: testBody,
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: randomUserHandle()
    });

    expect(Object.keys(testPost).includes("_data")).toBe(true);
    expect(testPost._data.body === testBody).toBe(true);
});


test("Should return list of Post instances", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: randomUserHandle()
    });
    const postId = await testPost.save();
    const result = await testPostService.findAllPosts();

    expect(Array.isArray(result)).toBe(true);
    expect(Object.keys(result[0]["_data"]).includes("id")).toBe(true);
    expect(Object.keys(result[0]["_data"]).includes("body")).toBe(true);
    expect(uuid.validate(result[0]["_id"])).toBe(true);
});


test("Should find and return specified Post instance matching id", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: randomUserHandle()
    });
    const postId = await testPost.save();
    const result = await testPostService.findPostById(postId);

    expect(Array.isArray(result)).toBe(true);
    expect(result[0]["_id"] === postId).toBe(true);
    expect(uuid.validate(postId)).toBe(true);
});


/**def test_should_delete_post():
    #delete_post FUNCTIONALITY NOT IMPLEMENTED YET
    assert True == True;

*/


test("Should return Post id on save", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: randomUserHandle()
    });
    const postId = await testPost.save();
    const result = await testPostService.findPostById(postId);

    expect(typeof(postId) === "string").toBe(true);
    expect(uuid.validate(postId)).toBe(true);
});


test("Should return updated Post body matching text", async() => {
    const testEdit = "Playboy. Billionaire. Genius";
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: randomUserHandle()
    });
    const postId = await testPost.save();
    const result = await testPost.edit(testEdit);

    expect(testPost._data.body === testEdit).toBe(true);
});


test("Should mark post as published", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: randomUserHandle()
    });
    const postId = await testPost.save();
    await testPostService.markAsPublished(testPost);

    expect(testPost._data.isPublished).toBe(true);
});


test("Should increment Post comment count", async() => {
    const testComment = new mocks.Comment();
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: "@tstark"
    });

    const postId = await testPost.save();
    const result = await testPost.addComment(testComment);

    expect(testComment.wasCalled("onPost")).toBe(true);
    expect(testComment.wasCalled("save")).toBe(true);
    expect(testPost._data.commentCount === 1).toBe(true);
});


test("Should increment Post like count", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: "@tstark"
    });

    const postId = await testPost.save();
    const result = await testPost.incrementLikeCount({fromUser: thorUserId });

    expect(testPost._data.likeCount === 1).toBe(true);
});


test("Should decrement Post like count", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: "@tstark"
    });

    await testPost.save();
    await testPost.incrementLikeCount({fromUser: thorUserId });

    expect(testPost._data.likeCount === 1).toBe(true);

    await testPost.decrementLikeCount({fromUser: thorUserId });

    expect(testPost._data.likeCount === 0).toBe(true);
});


test("Should set the post sentiment score", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: "@tstark"
    });

    await testPost.save();
    await testPost.setSentimentScore({sentimentScore: 0.9, magnitude: 0.9});

    expect(testPost._data.sentimentScore === 0.9).toBe(true);
    expect(testPost._data.magnitude === 0.9).toBe(true);
});



/* TEST MAY BE DEPRECATED
test("Should increment Post like count when likeCount property already exists", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: "@tstark"
    });

    const postId = await testPost.save();
    await testPost.incrementLikeCount.call(mockImpl.repo);
    expect(mockImpl.repo._repo.calledMethods.incrementLikeCountCalled).toBe(true);
});
*/

test("Should return true when post exists in the database", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: "@tstark"
    });

    const postId = await testPost.save();
    const postExists = await testPostService.postExists(postId);

    expect(postExists).toBe(true);

});


test("Should return false when post does NOT exist in the database", async() => {
    const fakePostId = uuid.v4();
    const postExists = await testPostService.postExists(fakePostId);

    expect(postExists).toBe(false);

});


test("Should return total number of posts", async() => {
    const count = await testPostService.getTotalPostCount();
    expect(typeof(count) === "number").toBe(true);
    expect(count > 0).toBe(true);

});


test("Should return JSON object representation", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: "@tstark"
    });

    const postId = await testPost.save();
    expect(typeof(testPost.toJSON()) === "object").toBe(true);
});


test("Should return list of posts from users a specified user has subscribed to", async() => {
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

    const testPost = await testPostService.createPost({
        body: "My very first post!",
        userId: testUserNo1Id,
        handle: "@tstark"
    });

    testPost.save();
    await testUserNo2.followUser(testUserNo1);
    const userNo2FollowsUserNo1 = await testUserNo2.isFollowing(testUserNo1);
    const testUserNo1Followers = await testUserNo1.getFollowers();
    const result = await testPostService.getPostsBySubscriber(testUserNo2Id);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length === 1).toBe(true);
});


test("Should return list of (35) most recent posts", async() => {
    const result = await testPostService.getRecentPosts();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length <= 35).toBe(true);
});

test("Should increment post comment count when commentCount property already exists", async() => {
    const testComment = new mocks.Comment();
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        handle: "@tstark",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f"
    });
    const testContext = Object.assign(mockImpl.repo, {_eventEmitter: eventEmitter});

    await testPost.addComment.call(testContext, testComment);
    expect(mockImpl.repo._repo.calledMethods.incrementCommentCountCalled).toBe(true);

});

test("Should return list of posts created by a user with specified id", async() => {
    const postList = await testPostService.findPostsByUserId({userId: "e98417a8-d912-44e0-8d37-abe712ca840f"});
    expect(Array.isArray(postList)).toBe(true);
    expect(postList[0]["id"] === "e98417a8-d912-44e0-8d37-abe712ca840f");
});


test("Should decrement the like count of a post", async() => {
    const postList = await testPostService.findPostsByUserId({userId: "e98417a8-d912-44e0-8d37-abe712ca840f"});
    expect(Array.isArray(postList)).toBe(true);
    expect(postList[0]["id"] === "e98417a8-d912-44e0-8d37-abe712ca840f");
});




/**Negative Tests**/
test("Should throw exception when attempting to create invalid post", async() => {
    try {
        const testPost = await testPostService.createPost();
    }
    catch (e) {
        expect(e.message).toMatch("PostDataEmpty");
    }
});


test("Should throw exception on missing post body", async() => {
    try {
        const testPost = await testPostService.createPost({
            handle: randomUserHandle(),
            userId: "e98417a8-d912-44e0-8d37-abe712ca840f"
        });
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidPostBody");
    }
})


test("Should throw exception when no user id provided", async() => {
    try {
        const testPost = await testPostService.createPost({
            body: "Everybody wants a happy ending, right? But it doesn’t always roll that way."
        });
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidUserId");
    }
});


test("Should throw exception on posts exceeding length limit", async() => {
    try {
        const testPost = await testPostService.createPost({
            body: "I'm baby hammock disrupt pop-up, ugh bushwick taxidermy before they sold out gentrify coloring book. Cardigan deep v taiyaki occupy. Hashtag cray dreamcatcher try-hard blog.",
            userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
            handle: "@tstark"
        });
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidPostBody.PostCharacterLimitExceeded");
    }
});


test("Should throw exception on posts with missing user ids", async() => {
    try {
        const testPost = await testPostService.createPost({
            body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
            handle: "@tstark"
        });
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidUserId");
    }
});


test("Should throw exception on posts with invalid user ids", async() => {
    try {
        const testPost = await testPostService.createPost({
            body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
            handle: "@tstark",
            userId: "xxx-yyy-zzz"
        });
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidUserId");
    }
});


test("Should throw exception on posts with non-existent user ids", async() => {
    try {
        const testPost = await testPostService.createPost({
            body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
            handle: "@tstark",
            userId: uuid.v4()
        });
    }
    catch (e) {
        expect(e.message).toMatch("UserDoesNotExist");
    }
});

test("Should throw exception on attempts to find posts with missing user ids", async() => {
    try {
        const testPost = await testPostService.findPostById();
    } catch(e) {
        expect(e.message).toMatch("MissingPostId");
    }
    
});
