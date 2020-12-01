
/**
 * Houses the sentiment analysis logic
 */

function SentimentAnalysisService() {
   
    /**
     * 
     * @returns {Object} platform-wide sentiment analysis data 
     */
    this.getReport = async function() {
     return {};
    }


    /**
     * @param {String} text - text to perform a sentiment analysis for
     * @returns {Object} result object with analysis data on the text
     */

    this.analyzeSentiment = async function(text) {
       return {};
    }

}

/*SentimentAnalysisService*/

module.exports = SentimentAnalysisService;
