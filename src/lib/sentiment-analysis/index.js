
/* Implements the ISentimentAnalyisService interface 
* See interfaces/sentiment-analysis for method documentation
* See https://cloud.google.com/natural-language/docs/reference/rest for Google Natural Language API documentation
*/

const fetch = require("node-fetch");
const URL = process.env.GOOGLE_CLOUD_NATURAL_LANGUAGE_API_URL;
const API_KEY = process.env.GOOGLE_CLOUD_NATURAL_LANGUAGE_API_KEY;

/**
 * @param {EventEmitter} eventEmitter - an instance of EventEmitter
 * @param {Object} fetch - an instance of the node-fetch NPM package
 * @param {Object} console - the console object
 */

function SentimentAnalysisService({eventEmitter, fetch, console}) {
    //Promises are used here because the implementation could not be made to work with async functions
     
    eventEmitter.on("postService.newPost", (post)=> {
        this.analyzeSentiment(post._data.body)
        .then(({sentimentScore, magnitude})=> post.setSentimentScore({sentimentScore, magnitude}))
        .catch((e) => console.error(e))
    });
   

    this.getReport = async function() {
        return {};
    }


    this.analyzeSentiment = async function(text) {
        if (typeof(text) !== "string") {
            throw Error("InputError.InputTextShouldBeAString");
        }

        try {
            const request = await fetch(`${URL}?key=${API_KEY}`, {
                "method": "POST",
                "body": JSON.stringify({
                    document: {
                        type: "PLAIN_TEXT",
                        content: text
                    }
                })
            });

            const {documentSentiment} = await request.json();
            return {
                sentimentScore: documentSentiment.score,
                magnitude: documentSentiment.magnitude
            };

        } catch(e) {
            throw Error(e);
        }
    }

}

module.exports = SentimentAnalysisService;
