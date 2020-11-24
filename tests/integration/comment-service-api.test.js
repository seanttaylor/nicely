/**********************************************/
//ENSURE NODE_ENV is hardcoded to "ci/cd/test"//
/**********************************************/
process.env.NODE_ENV = "ci/cd/test";

const app = require("../../index");
const supertest = require("supertest");
const { set } = require("../../index");
const request = supertest(app);

const globalUserId = "e98417a8-d912-44e0-8d37-abe712ca840f";
const globalUserIdNo2 = "b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09";
const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjpbInVzZXIiXX0.gq1_kjBm7mhhGIBR-3zO-NdOd-Bc-_WMPebWjGNXSms";

test("NODE_ENV should be `ci/cd/test`", () => {
    expect(process.env.NODE_ENV === "ci/cd/test").toBe(true);
});

test("API should return specified comment", async() => {
    const tokenRequest = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const accessToken = tokenRequest.body.meta.accessToken;
    const res1 = await request.post(`/api/v1/users/${globalUserId}/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        "body": "Is it better to be feared or respected? I say, is it too much to ask for both?",
        "handle": "@tstark"
    })
    .expect(200);
    const postId = res1["body"]["data"][0]["id"];

    const res2 = await request.post(`/api/v1/users/${globalUserId}/posts/${postId}/comments`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        postId,
        userId: globalUserId,
        body: "True Story. FR."
    })
    .expect(200);
    const commentId = res2["body"]["data"][0]["id"];

    const res3 = await request.get(`/api/v1/users/${globalUserId}/posts/${postId}/comments/${commentId}`)
    .expect(200);

    expect(res3["body"]["data"][0]["id"] === commentId).toBe(true);
});


test("API should return a list of all comments on the platform", async() => {
    const res1 = await request.get("/api/v1/comments")
    .expect(200);

    expect(Array.isArray(res1.body.data)).toBe(true);
    expect(res1.body.data.length > 1).toBe(true);
});


test("API shoud return updated comment matching test text", async() => {
    const tokenRequest = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const accessToken = tokenRequest.body.meta.accessToken;

    const res1 = await request.post(`/api/v1/users/${globalUserId}/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        "body": "Is it better to be feared or respected? I say, is it too much to ask for both?",
        "handle": "@tstark"
    })
    .expect(200);
    const postId = res1["body"]["data"][0]["id"];

    const res2 = await request.post(`/api/v1/users/${globalUserId}/posts/${postId}/comments`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        postId,
        userId: globalUserId,
        body: "True Story. FR."
    })
    .expect(200);
    const commentId = res2["body"]["data"][0]["id"];
    const testEdit = "True Story. Srsly.";

    const res3 = await request.put(`/api/v1/users/${globalUserId}/posts/${postId}/comments/${commentId}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        body: testEdit
    })
    .expect(200);
    
    expect(res3["body"]["data"][0]["id"] === commentId).toBe(true);
    expect(res3["body"]["data"][0]["data"]["body"] === testEdit).toBe(true);
});


test("API should return comment with incremented like count", async()=> {
    const tokenRequest = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const tokenRequestNo2 = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const starkAccessToken = tokenRequest.body.meta.accessToken;
    const thorAccessToken = tokenRequestNo2.body.meta.accessToken;

    const res1 = await request.post(`/api/v1/users/${globalUserId}/posts`)
    .set("Authorization", `Bearer ${starkAccessToken}`)
    .send({
        "body": "Is it better to be feared or respected? I say, is it too much to ask for both?",
        "handle": "@tstark"
    })
    .expect(200);
    const postId = res1["body"]["data"][0]["id"];

    const res2 = await request.post(`/api/v1/users/${globalUserId}/posts/${postId}/comments`)
    .set("Authorization", `Bearer ${starkAccessToken}`)
    .send({
        postId,
        userId: globalUserId,
        body: "True Story. FR."
    })
    .expect(200);
    const commentId = res2["body"]["data"][0]["id"];

    const res3 = await request.put(`/api/v1/users/${globalUserId}/posts/${postId}/comments/${commentId}/likes/${globalUserIdNo2}`)
    .send()
    .expect(200);
    
    expect(res3["body"]["data"][0]["data"]["likeCount"] === 1).toBe(true);
});