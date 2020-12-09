const Card = {
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
                    m("time", `${vnode.attrs.createdDate}`)        
                )//div.content    
            )//div.card-content
        )//div.card
    }
}

export {Card};
