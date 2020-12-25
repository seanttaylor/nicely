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
          "createdDate": "2020-09-26T23:08:27.645Z"
        }
    },
    "posts": {},
    "comments": {},
    "comment_likes": {},
    "post_likes": {},
    "user_roles": {
        "e98417a8-d912-44e0-8d37-abe712ca840f": {
            "id": "e98417a8-d912-44e0-8d37-abe712ca840f",
            "role": "admin"
        }
    },
    "user_credentials": {
        "tstark@avengers.io": {
            "password": "$2y$12$VMp52ykXPMUJoubKQ9H0ru9oGpkXR6Cxrq.s3ddh.si9zS4A6VekC",
            "emailAddress": "tstark@avengers.io",
            "createdDate": "2020-09-26T23:08:27.645Z",
            "lastModified": null
        }
    },
    "user_followers": {},
    "user_subscriptions": {
        "157966ea-3dac-495f-872f-e2ffad568f20": {
            "subscriptions": [
                "346d89b9-485d-4525-bd0c-bf12f1f07f65"
            ],
            "id": "157966ea-3dac-495f-872f-e2ffad568f20",
            "createdDate": "2020-12-25T18:52:21.887Z",
            "lastModified": "2020-12-25T18:52:29.352Z"
        }
    }
}