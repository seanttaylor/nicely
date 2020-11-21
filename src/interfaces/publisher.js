/* istanbul ignore file */

/**
 * Interface for a service to deliver published posts to a specified destination
 *
 * @interface
 * @param {Object} myImpl - object defining concrete implementations for interface methods
 */


function IPublisher(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }

    /**
    Publishes posts
    @param {Post} post - an instance of the Post class
    */
    this.publish = myImpl.publish || required;


    /** 
    Adds additional configuration necessary to execute the publish method after class is instantiated
    @param {Response} response - an instance of an Express response object
    */
    this.setup = myImpl.setup || required;



    const {
        publish,
        setup,
        ...optionalMethods
    } = myImpl;

    Object.assign(this, optionalMethods);

}


module.exports = IPublisher;