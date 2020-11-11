const ServerSentEvent = require("../sse");
const sse = ServerSentEvent();

function SSEPublisher(eventEmitter) {
    /*
    * Implements IPublisher interface for publishing posts
    * See interfaces/publisher for method documentation
    * Publishes posts to connected clients via Server-Sent Events (e.g. a web browser)
    */

    let onPublish = undefined;
    /** 
    * Serializes an instance of the Post class to EventStream format sending Server-Sent Events
    * @param {Post} post - an instance of the Post class
    */

    this.publish = function(post) {
        if (onPublish === undefined) {
            return;
        }
        const event = sse.of("newPost", post.toJSON());
        return onPublish(event);
    }

    eventEmitter.on("posts.newPostReadyToPublish", this.publish);

    /** 
    * Adds additional configuration necessary to execute the publish method after class is instantiated
    * @param {Function} onPublishFn - a function containing the implementation for publishing events
    */

    this.setup = function(onPublishFn) {
        onPublish = onPublishFn;
    }

}

module.exports = SSEPublisher;