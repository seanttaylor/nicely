const UiCardPost = require("./components/ui-card-post.js");

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
        new UiCardPost(app.config.dom.uiHandle.node, post).update();
    }

    function onNewPost(e) {
        const eventData = JSON.parse(e.data);
        const { payload } = eventData;
        const post = Object.assign(payload, {
            createdDate: `${dateFns.distanceInWords(new Date(payload.createdDate), new Date())} ago`
        });
        
        const myCard = new UiCardPost(app.config.dom.uiHandle.node, post);
        myCard.render((node, html) => node.insertAdjacentHTML("afterbegin", html));
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
