const uuid = require("uuid");
const events = require("events");
const eventEmitter = new events.EventEmitter();
const { mockImpl } = require("../../src/lib/utils/mocks");
const { randomEmailAddress, randomPhoneNumber, randomUserHandle } = require("../../src/lib/utils");
const DatabaseConnector = require("../../src/lib/database/connectors/mysql");
const testSqlDbConnector = new DatabaseConnector();
/*UserService*/
const { UserService } = require("../../src/services/user");
const UserRepository = require("../../src/lib/repository/user/mysql");
const IUserRepository = require("../../src/interfaces/user-repository");
const testUserMySqlRepo = new IUserRepository(new UserRepository(testSqlDbConnector));
const testUserService = new UserService(testUserMySqlRepo);
/*PostService*/
const { PostService } = require("../../src/services/post");
const PostRepository = require("../../src/lib/repository/post/mysql");
const IPostRepository = require("../../src/interfaces/post-repository");
const testPostMySqlRepo = new IPostRepository(new PostRepository(testSqlDbConnector));
const testPostService = new PostService({
    repo: testPostMySqlRepo,
    userService: testUserService,
    eventEmitter
});
/*CommentService*/
const { CommentService } = require("../../src/services/comment");
const CommentRepository = require("../../src/lib/repository/comment/mysql");
const ICommentRepository = require("../../src/interfaces/comment-repository");
const testCommentMySqlRepo = new ICommentRepository(new CommentRepository(testSqlDbConnector));
const testCommentService = new CommentService({
    userService: testUserService,
    postService: testPostService,
    repo: testCommentMySqlRepo
});

/**Tests**/

test("Should return new Comment instance", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: randomUserHandle()
    });
    const testPostId = await testPost.save();

    const testComment = await testCommentService.createComment({
        body: "True story. FR.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        postId: testPostId
    });
    await testComment.save();

    expect(Object.keys(testComment).includes("_data")).toBe(true);
});


test("Should return specified Comment", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: randomUserHandle()
    });
    const testPostId = await testPost.save();

    const testComment = await testCommentService.createComment({
        body: "True story. FR.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        postId: testPostId
    });
    const testCommentId = await testComment.save();
    const [returnedTestComment] = await testCommentService.findCommentById(testCommentId);

    expect(Object.keys(returnedTestComment).includes("_data")).toBe(true);
    expect(returnedTestComment._id === testCommentId).toBe(true);
});



test("Should return list of Comment instances", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: randomUserHandle()
    });
    const testPostId = await testPost.save();

    const testComment = await testCommentService.createComment({
        body: "True story. FR.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        postId: testPostId
    });
    await testComment.save();
    const result = await testCommentService.findAllComments();

    expect(Array.isArray(result)).toBe(true);
});


test("Should return Comment id on save", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: randomUserHandle()
    });
    const testPostId = await testPost.save();

    const testComment = await testCommentService.createComment({
        body: "True story. FR.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        postId: testPostId
    });
    const testCommentId = await testComment.save();

    expect(uuid.validate(testCommentId)).toBe(true);
});


test("Should return updated Comment matching test text", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: randomUserHandle()
    });
    const testPostId = await testPost.save();
    const testEdit = "True story. No doubt.";

    const testComment = await testCommentService.createComment({
        body: "True story. FR.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        postId: testPostId
    });
    await testComment.save();
    await testComment.edit(testEdit);

    expect(testComment._data.body === testEdit).toBe(true);
});


test("Should return increment Comment like count", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: randomUserHandle()
    });
    const testPostId = await testPost.save();
    const testEdit = "True story. No doubt.";

    const testComment = await testCommentService.createComment({
        body: "True story. FR.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        postId: testPostId
    });
    await testComment.save();
    await testComment.incrementLikeCount();

    expect(testComment._data.likeCount === 1).toBe(true);
});

test("Should return increment Comment like count when likeCount property already exists", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: "@tstark"
    });
    const testPostId = await testPost.save();
    const testEdit = "True story. No doubt.";

    const testComment = await testCommentService.createComment({
        body: "True story. FR.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        postId: testPostId
    });
    await testComment.save();

    await testComment.incrementLikeCount.call(mockImpl.repo);
    expect(mockImpl.repo._repo.calledMethods.incrementLikeCountCalled).toBe(true);
});



test("Should associate a comment with a post id", async() => {
    const testPost = await testPostService.createPost({
        body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: randomUserHandle()
    });
    const testPostId = await testPost.save();
    const testEdit = "True story. No doubt.";

    const testComment = await testCommentService.createComment({
        body: "True story. FR.",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        postId: testPostId
    });
    await testComment.save();

    testComment.onPost(testPostId);
    expect(testComment._data.postId === testPostId).toBe(true);
});


/**Negative Tests**/
test("Should throw exception when attempting to create invalid comment", async() => {

    try {
        const testComment = await testCommentService.createComment();
    }
    catch (e) {
        expect(e.message).toMatch("CommentDataEmpty");
    }
});


test("Should throw exception when user id missing", async() => {

    try {
        const testPost = await testPostService.createPost({
            body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
            userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
            handle: randomUserHandle()
        });
        const testPostId = await testPost.save();
        const testComment = await testCommentService.createComment({
            body: "True story. FR.",
            postId: testPostId
        });
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidUserId.Missing");
    }
});


test("Should throw exception when post id missing", async() => {

    try {
        const testComment = await testCommentService.createComment({
            body: "True story. FR.",
            userId: "e98417a8-d912-44e0-8d37-abe712ca840f"
        });
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidPostId.Missing");
    }
});


test("Should throw exception when post id does NOT exist", async() => {

    try {
        const testComment = await testCommentService.createComment({
            body: "True story. FR.",
            userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
            postId: uuid.v4()
        });
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidPostId.PostDoesNotExist");
    }
});

test("Should throw exception when user id does NOT exist", async() => {

    try {
        const testPost = await testPostService.createPost({
            body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
            userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
            handle: randomUserHandle()
        });
        const testPostId = await testPost.save();
        const testComment = await testCommentService.createComment({
            body: "True story. FR.",
            userId: uuid.v4(),
            postId: testPostId
        });
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidUserId.UserDoesNotExist");
    }
});

test("Should throw exception when comment body is missing", async() => {

    try {
        const testPost = await testPostService.createPost({
            body: "Everybody wants a happy ending, right? But it doesn’t always roll that way.",
            userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
            handle: "@tstark"
        });
        const testPostId = await testPost.save();
        const testComment = await testCommentService.createComment({
            userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
            postId: testPostId
        });
    }
    catch (e) {
        expect(e.message).toMatch("MissingOrInvalidCommentBody.Missing");
    }
});