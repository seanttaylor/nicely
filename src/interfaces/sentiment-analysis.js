/* istanbul ignore file */

/**
* An object having the ISentimentAnalysisService API; a set of methods for running sentiment analysis on text
* @typedef {Object} ISentimentAnalysisServiceAPI
* @property {Function} analyzeSentiment - get a numerical sentiment score for a given piece of text
* @property {Function} getReport - fetches a summary report of sentiment data across a data source housing 
* sentiment analytics
*/

/**
 * Interface for a service to perform sentiment anaylsis and generate reports on teh analysis results
 * @param {ISentimentAnalysisAPI} myImpl - object defining concrete implementations for interface methods
 */

function ISentimentAnalysisService(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }

    /**
    @param {String} text - the text to perform sentiment analysis on
    */
    this.analyzeSentiment = myImpl.analyzeSentiment || required;


    /** 
    @returns {Object} a sentiment analysis report as a JSON document
    */
    this.getReport = myImpl.getReport || required;



    const {
        analyzeSentiment,
        getReport,
        ...optionalMethods
    } = myImpl;

    Object.assign(this, optionalMethods);

}


module.exports = ISentimentAnalysisService;