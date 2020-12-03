
/* Implements the ISentimentAnalyisService interface 
* See interfaces/sentiment-analysis for method documentation
* See https://cloud.google.com/natural-language/docs/reference/rest for Google Natural Language API documentation
*/

const fetch = require("node-fetch");
const URL = process.env.GOOGLE_CLOUD_NATURAL_LANGUAGE_API_URL;
const API_KEY = process.env.GOOGLE_CLOUD_NATURAL_LANGUAGE_API_KEY;

/**
 * @param {EventEmitter} eventEmitter - an instance of EventEmitter
 * @param {PostRepository} postRepository - an instance of the PostRepository
 * @param {Object} fetch - an instance of the node-fetch NPM package
 */

function SentimentAnalysisService({eventEmitter, postRepository, fetch}) {

    /*eventEmitter.on("postService.newPost", (async({id, body})=> {
        const {sentimentScore, magnitude} = await this.analyzeSentiment(body);
        await postRepository.addSentimentScore({id, sentimentScore, magnitude});
    }).bind(this));*/

   
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
                "body": {
                    document: {
                        type: "PLAIN_TEXT",
                        content: text
                    }
                }
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
