const express = require("express");
const router = new express.Router();

function UserRouter(PostService) {

    router.post("/:id/posts", async(req, res, next) => {
        const userId = req.params.id;

        try {
            const post = await PostService.createPost({userId, ...req.body});
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

    router.post("/:id/posts/:post_id/publish", async(req, res, next) => {
        const postId = req.params.post_id;

        try {
            const [post] = await PostService.findPostById(postId);
            await PostService.markAsPublished(post);

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