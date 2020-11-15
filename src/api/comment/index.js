/* istanbul ignore file */

const express = require("express");
const router = new express.Router();

/**
 * 
 * @param {CommentService} CommentService - an instance of the CommentService
 * @returns router - an instance of an Express router
 */

function CommentRouter(CommentService) {
    router.get("/", async(req, res, next) => {
        try {
            const commentList = await CommentService.findAllComments();
            res.set("content-type", "application/json");
            res.status(200);
            res.json({
                data: commentList.map(comment => comment.toJSON()),
                entries: commentList.length
            });
        }
        catch (e) {
            console.error(e.message);
            next(e);
        }
    });

    return router;
}

module.exports = CommentRouter;
