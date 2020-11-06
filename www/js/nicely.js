import {Card} from "./components/card.js";

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

    /**
     * Wrapper around native addEventListener method to allow application to listen for state transitions;
     * @param String eventName - name of event to listen for
     * @param Function handlerFn - handler function to fire when the event is trigged
     * @returns
     */
    function addEventListener(eventName, handlerFn) {
        app.config.dom.uiHandle.node.addEventListener(eventName, handlerFn);
    }  

    async function init() {
        console.info("INITIALIZING");
        const source = new EventSource("/api/v1/subscribe");
        source.addEventListener("newPost", console.log);
        
    } 

    return {addEventListener, init, config: app.config};
}


(async function $() {
    var myApp;
    function onTxFeedPosts({detail}) {
        const postList = detail.data.map((post)=> {            
            return m(Card, {
                handle: post["author"], 
                body: post["body"], 
                firstName: post["first_name"],
                lastName: post["last_name"],
                createdDate: dateFns.distanceInWords(new Date(post["created_date"]), new Date())
            });
        });
        
        m.render(myApp.config.dom.root.node, postList);
    }

    try {
        myApp = Application();
        myApp.addEventListener("on-tx-feed-posts", onTxFeedPosts);
        await myApp.init();
    } catch(e) {
        console.error(e);
    }
}());
