const express = require("express");
const router = new express.Router();
const halson = require("halson");

function StatusRouter() {
    router.get("/", async(req, res, next) => {
        const appStatus = halson({
                status: "OK",
                commitHash: process.env.COMMIT_HASH
            })
            .addLink("self", "/status")
            .addLink("index", {
                href: "/api/v1",
                title: "Application root. Nicely. A social network for nice people"
            });

        res.set("content-type", "application/json");
        res.status(200);
        res.json(appStatus);
    });

    return router;
}

module.exports = StatusRouter;
