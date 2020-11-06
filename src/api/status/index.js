const express = require("express");
const router = new express.Router();

function StatusRouter() {
    router.get("/", async(req, res, next) => {
        res.set("content-type", "application/json");
        res.status(200);
        res.json({
            status: "OK",
            commitHash: process.env.COMMIT_HASH
        });
    });

    return router;
}

module.exports = StatusRouter;
