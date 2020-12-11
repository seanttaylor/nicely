const Card = {
    view: function(vnode) {
        return m("div", {class: "ui card centered"},
            m("div", {class: "content"},
                m("div", {class: "right floated meta"}, `${vnode.attrs.createdDate}`),
                m("img", {
                    class: "ui avatar image",
                    src: "https://placehold.it/50",
                    alt: "Placeholder image"
                }, `${vnode.attrs.firstName} ${vnode.attrs.lastName}`)

            ), //div.content
            m("div", {class: "image"}, 
                m("img", {
                    src: "https://placehold.it/150",
                    alt: "Placeholder image"
                })
            ), //div.image
            m("div", {class: "content"}, 
                m("span", {class: "post-body"}, `${vnode.attrs.body}`),
                m("span", {class: "right floated" },
                    m("i", {class: "heart outline like icon"}),
                    `${vnode.attrs.likeCount} likes`
                ),
                m("i", {class: "comment icon"}),
                `${vnode.attrs.commentCount} comments`
            ),//div.content
            m("div", {class: "extra content"},
                m("div", {class: "ui large transparent left icon input"}, 
                    m("i", {class: "heart outline icon"}),
                    m("input", {type: "text", placeholder: "Add Comment"})
                ) //div.ui
            ) //div.extra 
        ); //div.card
    }
};

/*const Card = {
    view: function(vnode) {
        return m("div", {class: "card"}, 
            m("div", {class: "card-image"},
                m("figure", {class: "image is-4by3"},
                    m("img", {
                        src: "https://bulma.io/images/placeholders/1280x960.png",
                        alt: "Placeholder image" 
                    })//img
                )//figure
            ),//div.card-image
            m("div", {class: "card-content"},
                m("div", {class: "media"},
                    m("div", {class: "media-left"},
                        m("figure", {class: "image is-48x48"},
                            m("img", {
                                src: "https://bulma.io/images/placeholders/96x96.png",
                                alt: "Placeholder image" 
                            })
                        )//figure.image
                    ),//div.media-left
                    m("div", {class: "media-content"},
                        m("p", {class: "title is-4"}, `${vnode.attrs.firstName} ${vnode.attrs.lastName}`),
                        m("p", {class: "subtitle is-6"}, `${vnode.attrs.handle}`)
                    )//div.media-content       
                ),//div.media
                m("div", {class: "content"}, `${vnode.attrs.body}`,
                    m("br"),
                    m("time", `${vnode.attrs.createdDate} ago`)        
                )//div.content    
            )//div.card-content
        )//div.card
    }
}*/

module.exports = Card;