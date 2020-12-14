/* istanbul ignore file */

const express = require("express");
const router = new express.Router();

/**
 * 
 * @param {PostService} postService - an instance of the PostService
 * @returns router - an instance of an Express router
 */

function UIApplicationRouter(postService) {
    router.get("/", async(req, res, next) => {
        res.render("index");
       
    });

    return router;
}

module.exports = UIApplicationRouter;