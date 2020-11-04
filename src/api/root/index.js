const express = require("express");
const halson = require("halson");
const { halCuries } = require("../config.js");
const router = new express.Router();

function ApplicationRootRouter() {
    router.get("/", async(req, res, next) => {
        const appRoot = halson({})
            .addLink("self", {
                href: "/api/v1",
                title: "Application root. Nicely. A social network for nice people"
            })
            .addLink("curies", halCuries)
            .addLink("schema:users", {
                href: "/users"
            })
            .addLink("schema:posts", {
                href: "/posts",
            })
            .addLink("schema:comments", {
                href: "/comments"
            })
            .addLink("feed:realtime_updates", {
                href: "/subscribe",
                title: "Subscribe to real-time updates as new posts are published to the feed",
                name: "feed:realtime_updates"
            })
            .addLink("feed:posts", {
                href: "/feed",
                title: "See all recently published posts"
            })
            .addLink("post:comments", {
                href: "/{user_id}/posts/{post_id}/comments",
                title: "Get the comments on a specified post",
                templated: true
            })
            .addLink("user:posts", {
                href: "/{user_id}/posts",
                title: "Get all the *published* posts from a specified user",
                templated: true
            })
            .addLink("user:accounts", {
                href: "/{id}",
                title: "View a specified user account",
                templated: true
            });

        res.set("content-type", "application/json");
        res.status(200);
        res.json(appRoot);
    });

    return router;
}

module.exports = ApplicationRootRouter;
