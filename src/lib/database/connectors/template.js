//Basic structure for JSON file or in-memory document database implementation

module.exports = {
    "users": {
        "e98417a8-d912-44e0-8d37-abe712ca840f": {
            "id": "e98417a8-d912-44e0-8d37-abe712ca840f",
            "handle": "@tstark",
            "emailAddress": "tstark@avengers.io",
            "phoneNumber": "12125552424",
            "firstName": "Tony",
            "lastName": "Stark",
            "createdDate": "2020-09-26T23:08:27.645Z",
            "lastModified": null,
            "followerCount": 1
        },
        "b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09": {
            "id": "b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09",
            "handle": "@thor",
            "emailAddress": "thor@avengers.io",
            "phoneNumber": "12125552020",
            "firstName": "Thor",
            "lastName": "Odinson",
            "createdDate": "2020-09-26T23:08:27.645Z",
            "lastModified": null,
            "followerCount": 0
        }
    },
    "posts": {
        "ace3e658-fd8f-4339-900e-027aea182016": {
            "id": "ace3e658-fd8f-4339-900e-027aea182016",
            "userId": "e98417a8-d912-44e0-8d37-abe712ca840f",
            "body": "Billionaire. Playboy. Genius.",
            "commentCount": 138,
            "likeCount": 2000,
            "sequenceNo": 47,
            "createdDate": "2020-09-26T23:08:27.645Z",
            "lastModified": null,
            "handle": "@tstark",
            "firstName": "Tony",
            "lastName": "Stark",
            "sentimentScore": "1.2",
            "magnitude": "1.0",
            "isPublished": false,
            "publishDate": "2020-09-26T23:08:27.645Z"
        }
    },
    "comments": {
        "088c250d-9760-4ef2-ac99-90fa63db0bcd": {
            id: "088c250d-9760-4ef2-ac99-90fa63db0bcd",
            body: "True story. FR.",
            userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
            postId: "f24488e8-d079-4106-9e11-8cc597e9f67e",
            likeCount: 0,
            createdDate: "2020-12-26T23:34:08.248Z",
            lastModified: null
        }
    },
    "comment_likes": {
        "57dc2040-1a42-477d-b52d-aefe0b9c659e": {
            likes: [],
            id: "57dc2040-1a42-477d-b52d-aefe0b9c659e",
            createdDate: "2020-12-27T00:25:42.898Z",
            lastModified: null
        }
    },
    "post_likes": {},
    "user_roles": {
        "e98417a8-d912-44e0-8d37-abe712ca840f": {
            "id": "e98417a8-d912-44e0-8d37-abe712ca840f",
            "role": "admin",
            "createdDate": "2020-09-26T23:08:27.645Z",
            "lastModified": null
        },
        "b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09": {
            "id": "b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09",
            "role": "user",
            "createdDate": "2020-09-26T23:08:27.645Z",
            "lastModified": null
        }
    },
    "user_credentials": {
        "tstark@avengers.io": {
            "userId": "e98417a8-d912-44e0-8d37-abe712ca840f",
            "password": "$2y$12$VMp52ykXPMUJoubKQ9H0ru9oGpkXR6Cxrq.s3ddh.si9zS4A6VekC",
            "emailAddress": "tstark@avengers.io",
            "createdDate": "2020-09-26T23:08:27.645Z",
            "lastModified": null
        },
        "thor@avengers.io": {
            "userId": "b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09",
            "password": "$2y$10$JGt.9x9ZOOZ7//S5fSRo7uKOck96G3Nz18aZ7oZ9pGqD8z7pPbR7O",
            "emailAddress": "thor@avengers.io",
            "createdDate": "2020-09-26T23:08:27.645Z",
            "lastModified": null
        }
    },
    "user_followers": {
        "e98417a8-d912-44e0-8d37-abe712ca840f": {
            "subscriptions": [
                "b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09"
            ],
            "id": "e98417a8-d912-44e0-8d37-abe712ca840f",
            "createdDate": "2020-12-25T18:52:21.887Z",
            "lastModified": "2020-12-25T18:52:29.352Z"
        },
        "346d89b9-485d-4525-bd0c-bf12f1f07f65": {
            "subscriptions": [
                "157966ea-3dac-495f-872f-e2ffad568f20"
            ],
            "id": "346d89b9-485d-4525-bd0c-bf12f1f07f65",
            "createdDate": "2020-12-25T18:52:21.887Z",
            "lastModified": "2020-12-25T18:52:29.352Z"
        }
    },
    "user_subscriptions": {
        "157966ea-3dac-495f-872f-e2ffad568f20": {
            "subscriptions": [
                "346d89b9-485d-4525-bd0c-bf12f1f07f65"
            ],
            "id": "157966ea-3dac-495f-872f-e2ffad568f20",
            "createdDate": "2020-12-25T18:52:21.887Z",
            "lastModified": "2020-12-25T18:52:29.352Z"
        },
        "b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09": {
            "subscriptions": [
                "e98417a8-d912-44e0-8d37-abe712ca840f"
            ],
            "id": "b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09",
            "createdDate": "2020-12-25T18:52:21.887Z",
            "lastModified": "2020-12-25T18:52:29.352Z"
        }
    }
}