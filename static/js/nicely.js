function HypermediaApplication({rootURI}={}) {
    if (rootURI === undefined) {
        throw Error("A root URI is required to bootstrap the application");
    } else {
        console.info("BOOTSTRAPPED OK");
    }
    const app = {};
    app.config = {};
    app.config.dom = {
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
     * Fetches the Application Web Services Transition Language spec
     * @param Object linksDoc - the "_links" object from the API root containing all link relations for the current resource
     */

    async function loadApplicationWESTLConfiguration(linksDoc) {
        const {westl} = linksDoc;
        const result = await fetch(westl.href);
        const response = await result.json();
        app.config.westl = response["westl@nicely"];
    }

    /**
     * Expands a Compact URI (CURIE)
     * @param String curie - a compact URI related to an application resource
     * @returns String - the full URL of the resource the CURIE references 
     */
    function expandCURIE(curie) {
        const [curieIdentifier, relIdentifier] = curie.split(":");
        const curieRootURI = app.currentCuries[curieIdentifier]["href"];
        const relURI = app.currentLinkRelations[curie]["href"];
        const expandedURL = `${curieRootURI}${relURI}`;

        return expandedURL;
    }

    /**
     * Move to a new application state
     * @param String curie - a compact URI related to an application resource
     * @returns String - the full URL of the resource the CURIE references 
     */
    async function transition(curie) {
        const URL = expandCURIE(curie);
        const method = app.config.westl.transitions[curie]["method"] || "GET";
        const result = await fetch(URL, {method});
        const response = await result.json();
        const uiHandle =  app.config.dom.uiHandle.node;

        uiHandle.dispatchEvent(new CustomEvent(`tx:${curie}`, {detail: response}));
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
        transition("feed:posts");
    } 

    return {addEventListener, init, transition};
}


(async function $() {
    
    function onTxFeedPosts({detail}) {
        console.log(detail);
        //RENDER HERE//
    }

    try {
        const myApp = HypermediaApplication({rootURI: "http://localhost:5000/api/v1"});
        myApp.addEventListener("tx:feed:posts", onTxFeedPosts);
        await myApp.init();
    } catch(e) {
        console.error(e);
    }
}());
