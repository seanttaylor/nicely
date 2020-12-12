/*
* Implements IPublisher interface for publishing posts
* See interfaces/publisher for method documentation
* Publishes posts to connected clients via Server-Sent Events (e.g. a web browser)
*/

const ServerSentEvent = require("../sse");
const sse = ServerSentEvent();

/**
 * @implements {IPublisherAPI}
 * @param {EventEmitter} eventEmitter - an instance of EventEmitter
 */

function SSEPublisher(eventEmitter) {

    let onPublish = undefined;
    /** 
    * Serializes an instance of the Post class to EventStream format sending Server-Sent Events
    * @param {Array} eventData - whose elements consist of a {String} eventName and an {Object} having a toJSON method
    */

    this.publish = function([eventName, post]) {
        if (onPublish === undefined) {
            return;
        }
        const event = sse.of(eventName, post.toJSON());
        return onPublish(event);
    }

    eventEmitter.on("posts.newPostReadyToPublish", this.publish);
    eventEmitter.on("posts.postUpdated", this.publish);

    /** 
    * Adds additional configuration necessary to execute the publish method after class is instantiated
    * @param {Function} onPublishFn - a function containing the implementation for publishing events
    */

    this.setup = function(onPublishFn) {
        onPublish = onPublishFn;
    }

}

module.exports = SSEPublisher;