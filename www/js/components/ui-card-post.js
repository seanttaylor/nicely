
/**
 * @typedef UiCard
 * @property {String} _id - the id of the post associated with this UiCard
 * @property {String} _createdDate - the createdDate of the post associated with this UiCard
 * @property {Node} _node - the reference DOM node that will be used to render this component as HTML
 * @property {Object} _data - data object the component will consume to render HTML onscreen
 * @property {Object} html - the final HTML that will be rendered onscreen
 * @property {Function} update - method triggering an update of the component subtree
 * @property {Function} render - method triggering the drawing of the component in the DOM
 */


/**
 * 
 * @param {Node} node - an instance of a DOM Node
 * @param {Object} componentData - data object the component will consume to render HTML on screen
 */
function UiCard(node, componentData) {
    const {id, data, createdDate} = componentData;
    this._id = id;
    this._createdDate = createdDate
    this._node = node;
    this._data = data;
    this.html = `<div class="ui card centered" data-post-${this._id}>
                <div class="content">
                    <div class="right floated meta">${this._createdDate}</div>
                        <img src="https://placehold.it/50" alt="Placeholder image" class="ui avatar image"/>
                        ${this._data.author}
                    </div>
                <div class="image">
                    <img src="https://placehold.it/150" alt="Placeholder image">
                </div>
                <div class="content">
                    <span class="post-body">${this._data.body}</span>
                    <span class="right floated"><i class="heart outline like icon"></i>
                        <span data-post-${this._id}-like-count>${this._data.likeCount}</span>
                    likes</span>
                    <i class="comment icon"></i>
                        <span data-post-${this._id}-comment-count>${this._data.commentCount}</span> comments
                </div>
                <div class="extra content">
                    <div class="ui large transparent left icon input">
                        <i class="heart outline icon"></i>
                        <input type="text" placeholder="Add Comment">
                    </div>
                </div>
            </div>`

    /**
     * Updates specific elements in the component's subtree
     */        
    
    this.update = function() {
        const nodeIsNotInDOM = document.querySelector(`[data-post-${this._id}]`) === null;

        if (nodeIsNotInDOM) {
            console.info(`Tried to update UiCard component that is not in the dom: data-id (${this._id})`);
            return;
        }

        document.querySelector(`[data-post-${this._id}-comment-count]`).innerText = `${this._data.commentCount}`;
        document.querySelector(`[data-post-${this._id}-like-count]`).innerText = `${this._data.likeCount}`;
    }

    /**
     * 
     * @param {Function} fn - callback function that renders the component 
     */

    this.render = function(fn) {
        fn(this._node, this.html);
    }

}

module.exports = UiCard;