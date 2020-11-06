const express = require("express");
const router = new express.Router();

function PostRouter(PostService) {
    router.get("/", async(req, res, next) => {
        try {
            const postList = await PostService.findAllPosts();
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: postList.map(post => post.toJSON()),
                entries: postList.length
            });
        }
        catch (e) {
            console.error(e.message);
            next(e);
        }
    });

    return router;
}

module.exports = PostRouter;
