const express = require("express");
const router = new express.Router();
const halson = require("halson");
const { halCuries } = require("../config.js");

function PostRouter(PostService) {
    router.get("/", async(req, res, next) => {
        try {
            const postList = await PostService.findAllPosts();
            const halPostList = postList.map(post => post.toHAL());
            const posts = halson({
                    entries: postList.length
                })
                .addLink("self", "/api/v1/posts")
                .addLink("curies", halCuries)
                .addEmbed("posts", halPostList);

            res.set("content-type", "application/json");
            res.status(200);
            res.json(posts);
        }
        catch (e) {
            console.error(e.message);
            next(e);
        }
    });

    return router;
}

module.exports = PostRouter;
