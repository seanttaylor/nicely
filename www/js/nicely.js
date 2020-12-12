const Card = require("./components/card.js");

function Application() {
    const app = {};
    app.config = {};
    app.config.dom = {
        "root": {
            "selector": "body",
            "node": document.querySelector("body")
        },
        "uiHandle": {
            "selector": "#nicely",
            "node": document.querySelector("#nicely")
        }
    };

    function onPostUpdate(e) {
        const eventData = JSON.parse(e.data);
        const {payload: post} = eventData;
        console.log(post);
    }

    function onNewPost(e) {
        const eventData = JSON.parse(e.data);
        const {payload: post} = eventData;
        
        const myCard = Card({
            handle: post.data.author, 
            body: post.data.body, 
            firstName: post.data.firstName,
            lastName: post.data.lastName,
            likeCount: post.data.likeCount,
            commentCount: post.data.commentCount,
            createdDate: `${dateFns.distanceInWords(new Date(post.createdDate), new Date())} ago`
        });
        
        app.config.dom.uiHandle.node.insertAdjacentHTML("afterbegin", myCard);
    }
  

    async function init() {
        console.info("INITIALIZING");
        const source = new EventSource("/api/v1/feed/realtime-updates");
        source.addEventListener("newPost", onNewPost);
        source.addEventListener("postUpdate", onPostUpdate);

    } 

    return {init};
}


(async function $() {
    var myApp;
   
    try {
        myApp = Application();
        await myApp.init();
    } catch(e) {
        console.error(e);
    }
}());
