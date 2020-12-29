/* istanbul ignore file */

const express = require("express");
const router = new express.Router();

/**
 * 
 * @param {PostService} postService - an instance of the PostService
 * @returns router - an instance of an Express router
 */

function FeedRouter(postService) {
    router.get("/latest", async(req, res, next) => {
        try {
            const postList = await postService.getRecentPosts();
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

module.exports = FeedRouter;
