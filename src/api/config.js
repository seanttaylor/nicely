const nicelyAPIConfig = {
    halCuries: [{
            name: "schema",
            href: "/api/schemas/{rel}/latest",
            title: "Learn more about Compact URIs here: https://tools.ietf.org/html/draft-kelly-json-hal-06#section-8.2",
            templated: true
        },
        {
            name: "user",
            href: "/api/v1/users"
        },
        {
            name: "post",
            href: "/api/v1/posts"
        },
        {
            name: "feed",
            href: "/api/v1/feed"
        }
    ]
}

module.exports = nicelyAPIConfig;
