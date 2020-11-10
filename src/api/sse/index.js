/* istanbul ignore file */

const express = require("express");
const router = new express.Router();


function SSERouter(publishService) {
    
    router.get("/", (req, res) => {
        res.status(200).set({
            "connection": "keep-alive",
            "cache-control": "no-cache",
            "content-type": "text/event-stream"
        });
        
        //An initial OK response must be sent clients to establish a connection
        res.write("data: CONNECTION_OK \n\n");
        publishService.setup(([eventName, eventData]) => {
            res.write(eventData);
            res.write(eventName);
        });
    });
    
    return router;
}

module.exports = SSERouter;


