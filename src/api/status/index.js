/* istanbul ignore file */

const express = require("express");
const router = new express.Router();

/**
 * 
 * @returns router - an instance of an Express router
 */


function StatusRouter(statusService) {
    router.get("/", async(req, res, next) => {
        const { databaseConnectionEstablished } = await statusService.getSystemStatus();
        
        res.set("content-type", "application/json");
        res.status(databaseConnectionEstablished ? 200 : 503);
        res.json({
            status: "OK",
            databaseStatus: databaseConnectionEstablished ? "ONLINE" : "OFFLINE",
            commitHash: process.env.COMMIT_HASH
        });
    
    
    });

    return router;
}

module.exports = StatusRouter;
