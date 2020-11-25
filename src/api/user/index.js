/* istanbul ignore file */

const express = require("express");
const router = new express.Router();
const {
    validateRequestBodyWith, 
    authorizeRequest, 
    validateJWT,
    validateUserCanViewUnpublished
} = require("../../lib/middleware");

/**
 * 
 * @param {PostService} postService - an instance of the PostService
 * @param {UserService} userService - an instance of the UserService
 * @param {CommentService} commentService - an instance of the CommentService
 * @param {AuthService} authService - an instance of the AuthService
 * @returns router - an instance of an Express router
 */

function UserRouter({postService, userService, commentService, authService}) {

    async function verifyUserExists(req, res, next) {
        const userExists = await userService.userExists(req.params.id);

        if (!userExists) {
            res.status(404);
            res.json({
                data: [],
                errors: [],
                entries: 0
            });
            return; 
        }

        next();
    }

    async function verifyPostExists(req, res, next) {
        const postExists = await postService.postExists(req.params.post_id);

        if (!postExists) {
            res.status(404);
            res.json({
                data: [],
                errors: [],
                entries: 0
            });
            return; 
        }

        next();
    }

    /****** GET *******/

    router.get("/:id/posts", verifyUserExists, validateJWT, authorizeRequest({actionId: "readAny:posts", allowResourceOwnerOnly: false}), validateUserCanViewUnpublished, async(req, res, next) => {
        const userId = req.params.id;
        const showUnpublished = res.locals.permissions.userCan.viewUnpublishedPosts;
        
        try {
            const postList = await postService.findPostsByUserId({userId, showUnpublished});
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: postList,
                entries: postList.length
            });
        }
        catch (e) {
            next(e);
        }
    });

    router.get("/:id/posts/:post_id", verifyUserExists, async(req, res, next) => {
        const userId = req.params.id;
        const postId = req.params.post_id;
        
        try {
            const postList = await postService.findPostById(postId);
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: postList,
                entries: 1
            });
        }
        catch (e) {
            next(e);
        }
    });

    router.get("/:id/subscriptions", verifyUserExists, async(req, res, next) => {
        const userId = req.params.id;
       
        try {
            const [user] = await userService.findUserById(userId);
            const userSubscriptionsList = await user.follows();

            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: userSubscriptionsList,
                entries: userSubscriptionsList.length
            });
        }
        catch (e) {
            next(e);
        }
    });

    router.get("/:id/posts/:post_id/comments/:comment_id", verifyUserExists, async(req, res, next) => {
        const userId = req.params.id;
        const postId = req.params.post_id;
        const commentId = req.params.comment_id;

        try {
            const [comment] = await commentService.findCommentById(commentId);
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: [comment],
                entries: 1
            });
        }
        catch (e) {
            next(e);
        }
    });

    router.get("/", async(req, res, next) => {

        try {
            const userList = await userService.findAllUsers();
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: userList.map(u => u.toJSON()),
                entries: userList.length
            });
        }
        catch (e) {
            next(e);
        }
    });

    router.get("/:id", verifyUserExists, async(req, res, next) => {
        const userId = req.params.id;

        try {
            const userList = await userService.findUserById(userId);
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: userList.map(u => u.toJSON()),
                entries: userList.length
            });
        }
        catch (e) {
            next(e);
        }
    });

    router.get("/:id/followers", verifyUserExists, async(req, res, next) => {
        const userId = req.params.id;

        try {
            const [user] = await userService.findUserById(userId);
            const followerList = await user.getFollowers(); 
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: followerList.map(f => f.toJSON()),
                entries: followerList.length
            });
        }
        catch (e) {
            next(e);
        }
    });

    /*** POST ****/

    router.post("/token", async(req, res, next) => {
        const password = req.body.password;
        const userEmailAddress = req.body.emailAddress;
        const [user] = await userService.findUserByEmail(userEmailAddress);
        const result = await userService.isUserPasswordCorrect({user, password});

        if (!result) {
            res.status(401);
            res.json({
                data: [],
                errors: ["Email address and/or password do not match"],
                entries: 0
            });
        }
        const accessToken = await authService.issueAuthCredential(user);
        res.status(200);
        res.json({
            meta: {
                accessToken
            },
            data: [],
            errors: [],
            entries: 0
        });
    });

    router.post("/:id/posts", validateJWT, verifyUserExists, validateRequestBodyWith({requiredFields: true, schema: "post"}), async(req, res, next) => {
        const userId = req.params.id;

        try {
            const post = await postService.createPost({userId, ...req.body});
            await post.save();
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: [post],
                entries: 1
            });
        }
        catch (e) {
            next(e);
        }
    });

    router.post("/:id/posts/:post_id/comments", validateJWT, validateRequestBodyWith({requiredFields: true, schema: "comment"}), async(req, res, next) => {
        const userId = req.params.id;
        const postId = req.params.post_id;

        try {
            const [post] = await postService.findPostById(postId);
            const comment = await commentService.createComment(req.body);
            await post.addComment(comment);
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: [comment],
                entries: 1
            });
        }
        catch (e) {
            next(e);
        }
    });

    router.post("/", validateRequestBodyWith({requiredFields: true, schema: "user"}), async(req, res, next) => {
        const {password, ...requestBody} = req.body;

        try {
            const user = await userService.createUser(requestBody);
            await user.save();
            await userService.createUserPassword({user, password});
            const token = await authService.issueAuthCredential(user);

            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                meta: {accessToken: token},
                data: [user],
                entries: 1
            });
        }
        catch (e) {
            next(e);
        }
    });

    router.post("/:id/posts/:post_id/publish", validateJWT, async(req, res, next) => {
        const postId = req.params.post_id;

        try {
            const [post] = await postService.findPostById(postId);
            await postService.markAsPublished(post);
            res.set("content-type", "application/json");
            res.status(204);
            res.end();
        }
        catch (e) {
            next(e);
        }
    });

    /*** PUT ***/

    router.put("/:id/posts/:post_id", validateJWT, authorizeRequest({actionId: "updateOwn:posts"}), validateRequestBodyWith({requiredFields: false, schema: "post"}) , async(req, res, next) => {
        const userId = req.params.id;
        const postId = req.params.post_id;

        try {
            const [post] = await postService.findPostById(postId);
            await post.edit(req.body.body);
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: [post],
                entries: 1
            });
        }
        catch (e) {
            next(e);
        }
    });

    router.put("/:id/posts/:post_id/likes/:actor_id", async(req, res, next) => {
        const userId = req.params.id;
        const postId = req.params.post_id;
        const actorId = req.params.actor_id;

        try {
            const [post] = await postService.findPostById(postId);
            //Will become await post.incrementLikeCount({from: actorId});
            await post.incrementLikeCount();
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: [post],
                entries: 1
            });
        }
        catch (e) {
            next(e);
        }
    });

    router.put("/:id/posts/:post_id/comments/:comment_id", validateJWT, authorizeRequest({actionId: "updateOwn:comments"}), validateRequestBodyWith({requiredFields: false, schema: "comment"}), async(req, res, next) => {
        const userId = req.params.id;
        const postId = req.params.post_id;
        const commentId = req.params.comment_id;

        try {
            const [comment] = await commentService.findCommentById(commentId);
            await comment.edit(req.body.body);
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: [comment],
                entries: 1
            });
        }
        catch (e) {
            next(e);
        }
    });

    router.put("/:id/posts/:post_id/comments/:comment_id/likes/:actor_id", async(req, res, next) => {
        const userId = req.params.id;
        const postId = req.params.post_id;
        const commentId = req.params.comment_id;
        const actorId = req.params.actor_id;

        try {
            const [comment] = await commentService.findCommentById(commentId);
            //Will become await comment.incrementLikeCount({from: actorId});
            await comment.incrementLikeCount();
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: [comment],
                entries: 1
            });
        }
        catch (e) {
            next(e);
        }
    });

    router.put("/:id/name", validateJWT, validateRequestBodyWith({requiredFields: false, schema: "user"}), async(req, res, next) => {
        const userId = req.params.id;

        try {
            const [user] = await userService.findUserById(userId);
            await user.editName({firstName: req.body.firstName, lastName: req.body.lastName})
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: [user],
                entries: 1
            });
        }
        catch (e) {
            next(e);
        }
    });

    router.put("/:id/motto", validateJWT, validateRequestBodyWith({requiredFields: false, schema: "user"}), async(req, res, next) => {
        const userId = req.params.id;

        try {
            const [user] = await userService.findUserById(userId);
            await user.editMotto(req.body.motto);
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: [user],
                entries: 1
            });
        }
        catch (e) {
            next(e);
        }
    });

    router.put("/:id/phone", validateJWT, validateRequestBodyWith({requiredFields: false, schema: "user"}), async(req, res, next) => {
        const userId = req.params.id;

        try {
            const [user] = await userService.findUserById(userId);
            await user.editPhoneNumber(req.body.phoneNumber);
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: [user],
                entries: 1
            });
        }
        catch (e) {
            next(e);
        }
    });

    router.put("/:id/followers/:follower_id", verifyUserExists, async(req, res, next) => {
        const userId = req.params.id;
        const followerId = req.params.follower_id;

        try {
            const [follower] = await userService.findUserById(followerId);
            const [targetUser] = await userService.findUserById(userId);

            await follower.followUser(targetUser);
            res.set("content-type", "application/json");
            res.status(204);
            res.end();
        }
        catch (e) {
            next(e);
        }
    });

    router.delete("/:id/followers/:follower_id", async(req, res, next) => {
        const userId = req.params.id;
        const followerId = req.params.follower_id;

        try {
            const [follower] = await userService.findUserById(followerId);
            const [targetUser] = await userService.findUserById(userId);

            await follower.unfollowUser(targetUser);
            res.set("content-type", "application/json");
            res.status(204);
            res.end();
        }
        catch (e) {
            next(e);
        }
    });


    return router;
}

module.exports = UserRouter;