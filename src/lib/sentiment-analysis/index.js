
/* Implements the ISentimentAnalyisService interface 
* See interfaces/sentiment-analysis for method documentation
*/

function SentimentAnalysisService() {
   
    this.getReport = async function() {
     return {};
    }


    this.analyzeSentiment = async function(text) {
       return {
           sentimentScore: null,
           magnitude: null
       };
    }

}

module.exports = SentimentAnalysisService;
