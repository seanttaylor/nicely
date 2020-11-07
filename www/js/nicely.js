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

    function onNewPosts({detail}) {
        const eventData = JSON.parse(detail.data);
        const {payload: post} = eventData;
                  
        const myCardComponent = m(Card, {
            handle: post["author"], 
            body: post["body"], 
            firstName: post["first_name"],
            lastName: post["last_name"],
            createdDate: dateFns.distanceInWords(new Date(post["created_date"]), new Date())
        });
        
        m.render(app.config.dom.root.node, myCardComponent);
    }
  

    async function init() {
        console.info("INITIALIZING");
        const source = new EventSource("/api/v1/subscribe");
        source.addEventListener("newPost", onNewPost);
        
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
