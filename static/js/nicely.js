import {Card} from "./components/card.js";

function HypermediaApplication({rootURI}={}) {
    if (rootURI === undefined) {
        throw Error("A root URI is required to bootstrap the application");
    } else {
        console.info("BOOTSTRAPPED OK");
    }
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
    app.config.rootURI = rootURI;

    function loadCurrentCURIEs(curiesList) {
        app.currentCuries = curiesList.reduce((result, currentItem) => {
            result[currentItem["name"]] = currentItem;
            return result;
        }, {});
    }

    function loadCurrentLinkRelations(links) {
        const {curies, ...rels} = links;
        app.currentLinkRelations = rels;
    }

    /**
     * Fetches the application Web Services Transition Language spec
     * @param Object linksDoc - the "_links" object from the API root containing all link relations for the current resource
     */

    async function loadApplicationWESTLConfiguration(linksDoc) {
        const {westl} = linksDoc;
        const result = await fetch(westl.href);
        const response = await result.json();
        app.config.westl = response;
    }

    /**
     * Expands a Compact URI (CURIE)
     * @param String curie - a compact URI related to an application resource
     * @returns String - the full URL of the resource the CURIE references 
     */
    function expandCURIE(curie) {
        const [curieIdentifier] = curie.split(":");
        const curieRootURI = app.currentCuries[curieIdentifier]["href"];
        const relURI = app.currentLinkRelations[curie]["href"];
        const expandedURL = `${curieRootURI}${relURI}`;

        return expandedURL;
    }

    /**
     * Move to a new application state
     * @param String transitionName - name of a valid app transition specified in the westl document
     * @returns String - the full URL of the resource the transitionName references 
     */
    async function transition(transitionName) {
        const transitionRef = app["config"]["westl"]["transitions"][transitionName];
        const curie = transitionRef.rel;
        const URL = expandCURIE(curie);
        const method = transitionRef.method || "GET";
        try {
            //TODO: Include conditional logic to attach facilitate alternative event registration and emission behavior outside browser context
            const result = await fetch(URL, {method});
            const response = await result.json();
            const uiHandle =  app.config.dom.uiHandle.node;
          
            uiHandle.dispatchEvent(new CustomEvent(`tx:${curie}`, {detail: response}));
        } catch(e) {
            console.error(e);
        }
       
    }

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
        const response = await fetch(app.config.rootURI);
        const apiRoot = await response.json();
        loadCurrentCURIEs(apiRoot._links.curies);
        loadCurrentLinkRelations(apiRoot._links); 
        await loadApplicationWESTLConfiguration(apiRoot._links);
        transition("allFeedPosts");
        const realtimeUpdatesURL = expandCURIE(apiRoot["_links"]["feed:realtime_updates"]["name"]);
        
        const source = new EventSource(realtimeUpdatesURL);
        source.addEventListener("NewPost", console.log);
        
    } 

    return {addEventListener, init, transition, config: app.config};
}


(async function $() {
    var myApp;
    function onTxFeedPosts({detail}) {
        const postList = detail._embedded.posts.map((post)=> {            
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
        myApp = HypermediaApplication({rootURI: "http://localhost:5000/api/v1"});
        myApp.addEventListener("tx:feed:posts", onTxFeedPosts);
        await myApp.init();
    } catch(e) {
        console.error(e);
    }
}());
