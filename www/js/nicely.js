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

    function onNewPost(e) {
        const eventData = JSON.parse(e.data);
        const {payload: post} = eventData;
                  
        const myCardComponent = m(Card, {
            handle: post.data.author, 
            body: post.data.body, 
            firstName: post.data.firstName,
            lastName: post.data.lastName,
            createdDate: "just now!"
            //createdDate: //dateFns.distanceInWords(new Date(post["created_date"]), new Date())
        });
        
        m.render(app.config.dom.root.node, myCardComponent);
    }
  

    async function init() {
        console.info("INITIALIZING");
        const source = new EventSource("/api/v1/feed/realtime-updates");
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
