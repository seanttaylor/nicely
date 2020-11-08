/* istanbul ignore file */

const express = require("express");
const router = new express.Router();

function UserRouter({postService, userService, commentService}) {

    router.post("/:id/posts", async(req, res, next) => {
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

    router.get("/:id/posts/:post_id", async(req, res, next) => {
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

    router.put("/:id/posts/:post_id/edit", async(req, res, next) => {
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

    router.get("/:id/subscriptions", async(req, res, next) => {
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

    router.post("/:id/posts/:post_id/comments", async(req, res, next) => {
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

    router.get("/:id/posts/:post_id/comments/:comment_id", async(req, res, next) => {
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

    router.put("/:id/posts/:post_id/comments/:comment_id/edit", async(req, res, next) => {
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
        const actorId = req.params.actor_id

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

    router.post("/:id/posts/:post_id/publish", async(req, res, next) => {
        const postId = req.params.post_id;

        try {
            const [post] = await postService.findPostById(postId);
            await postService.markAsPublished(post);

            res.set("content-type", "application/json");
            res.status(204);
            res.json({
                data: [],
                entries: 0
            });
        }
        catch (e) {
            next(e);
        }
    });

    return router;
}

module.exports = UserRouter;