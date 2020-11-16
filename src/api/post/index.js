/* istanbul ignore file */

const express = require("express");
const router = new express.Router();
const { validateJWT } = require("../../lib/middleware");


/**
 * 
 * @param {PostService} postService - an instance of the PostService
 * @returns {Object} router - an instance of an Express router
 */

function PostRouter(postService) {
    router.get("/", validateJWT, async(req, res, next) => {
        try {
            const postList = await postService.findAllPosts();
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
