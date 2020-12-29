/**********************************************/
//ENSURE NODE_ENV is hardcoded to "ci/cd/test"//
/**********************************************/
process.env.NODE_ENV = "ci/cd/test";

const app = require("../../index");
const supertest = require("supertest");
const request = supertest(app);
const { randomEmailAddress, randomPhoneNumber, randomUserHandle } = require("../../src/lib/utils");

const starkUserId = "e98417a8-d912-44e0-8d37-abe712ca840f";
const thorUserId = "b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09";
const fakePassword = "superSecretPassword";
const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjpbInVzZXIiXX0.gq1_kjBm7mhhGIBR-3zO-NdOd-Bc-_WMPebWjGNXSms";


test("NODE_ENV should be `ci/cd/test`", () => {
    expect(process.env.NODE_ENV === "ci/cd/test").toBe(true);
});

test("API should return a new post", async() => {
    const res1 = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const accessToken = res1.body.meta.accessToken;
    const res = await request.post(`/api/v1/users/${starkUserId}/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        "body": "Is it better to be feared or respected? I say, is it too much to ask for both?",
        "handle": "@tstark"
    })
    .expect(200);
});

test("API should return a list of posts", async() => {
    const res1 = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const accessToken = res1.body.meta.accessToken;

    const res = await request.get("/api/v1/posts")
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(200);
    const responsePayload = JSON.parse(res.text);
    
    expect(Array.isArray(responsePayload.data)).toBe(true);
    expect(responsePayload.data.length > 0).toBe(true);
});

test("API should return specified Post instance matching id", async() => {
    const tokenRequest = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const accessToken = tokenRequest.body.meta.accessToken;
    const res1 = await request.post(`/api/v1/users/${starkUserId}/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        "body": "Is it better to be feared or respected? I say, is it too much to ask for both?",
        "handle": "@tstark"
    })
    .expect(200);
    const responsePayload = JSON.parse(res1.text);
    const [post] = responsePayload.data;
    const res2 = await request.get(`/api/v1/users/${starkUserId}/posts/${post.id}`)
    .expect(200);

    expect(post.id === res2.body.data[0].id).toBe(true);
    expect(res2.body.entries === 1).toBe(true);
});


test("Should return updated post body matching text", async() => {
    const tokenRequest = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const accessToken = tokenRequest.body.meta.accessToken;
    const testEdit = "Okay, I take it back";
    const res1 = await request.post(`/api/v1/users/${starkUserId}/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        "body": "Is it better to be feared or respected? I say, is it too much to ask for both?",
        "handle": "@tstark"
    })
    .expect(200);
    const postId = res1["body"]["data"][0]["id"];

    const res2 = await request.put(`/api/v1/users/${starkUserId}/posts/${postId}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        body: "Okay, I take it back"
    })
    .expect(200);

    const res3 = await request.get(`/api/v1/users/${starkUserId}/posts/${postId}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(200);

    expect(res3["body"]["data"][0]["data"]["body"] === testEdit).toBe(true);
    expect(res3["body"]["data"][0]["lastModified"] !== null).toBe(true);
});


test("API should add a comment to a post", async() => {
    const tokenRequest = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const accessToken = tokenRequest.body.meta.accessToken;

    const res1 = await request.post(`/api/v1/users/${starkUserId}/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        "body": "Is it better to be feared or respected? I say, is it too much to ask for both?",
        "handle": "@tstark"
    })
    .expect(200);
    const postId = res1["body"]["data"][0]["id"];

    const res2 = await request.post(`/api/v1/users/${starkUserId}/posts/${postId}/comments`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        postId,
        userId: starkUserId,
        body: "True Story. FR."
    })
    .expect(200);

    const res3 = await request.get(`/api/v1/users/${starkUserId}/posts/${postId}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(200);

    expect(res3["body"]["data"][0]["data"]["commentCount"] === 1).toBe(true);
});

test("API should increment post like count", async()=> {
    const tokenRequest = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const starkAccessToken = tokenRequest.body.meta.accessToken;

    const tokenRequestNo2 = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "thor@avengers.io",
        password: "thor@superSecretPassword"
    })
    .expect(200);

    const thorAccessToken = tokenRequestNo2.body.meta.accessToken;

    const res1 = await request.post(`/api/v1/users/${starkUserId}/posts`)
    .set("Authorization", `Bearer ${starkAccessToken}`)
    .send({
        "body": "Is it better to be feared or respected? I say, is it too much to ask for both?",
        "handle": "@tstark"
    })
    .expect(200);
    const postId = res1["body"]["data"][0]["id"];

    const res2 = await request.put(`/api/v1/users/${starkUserId}/posts/${postId}/likes/${thorUserId}`)
    .set("Authorization", `Bearer ${thorAccessToken}`)
    .send()
    .expect(200);

    const res3 = await request.get(`/api/v1/users/${starkUserId}/posts/${postId}`)
    .set("Authorization", `Bearer ${starkAccessToken}`)
    .expect(200);

    expect(res3["body"]["data"][0]["data"]["likeCount"] === 1).toBe(true);
});


test("API should decrement post like count", async()=> {
    const tokenRequest = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const starkAccessToken = tokenRequest.body.meta.accessToken;

    const tokenRequestNo2 = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "thor@avengers.io",
        password: "thor@superSecretPassword"
    })
    .expect(200);

    const thorAccessToken = tokenRequestNo2.body.meta.accessToken;

    const res1 = await request.post(`/api/v1/users/${starkUserId}/posts`)
    .set("Authorization", `Bearer ${starkAccessToken}`)
    .send({
        "body": "Is it better to be feared or respected? I say, is it too much to ask for both?",
        "handle": "@tstark"
    })
    .expect(200);
    const postId = res1["body"]["data"][0]["id"];

    const res2 = await request.put(`/api/v1/users/${starkUserId}/posts/${postId}/likes/${thorUserId}`)
    .set("Authorization", `Bearer ${thorAccessToken}`)
    .send()
    .expect(200);

    const res3 = await request.get(`/api/v1/users/${starkUserId}/posts/${postId}`)
    .set("Authorization", `Bearer ${starkAccessToken}`)
    .expect(200);

    expect(res3["body"]["data"][0]["data"]["likeCount"] === 1).toBe(true);

    await request.delete(`/api/v1/users/${starkUserId}/posts/${postId}/likes/${thorUserId}`)
    .set("Authorization", `Bearer ${thorAccessToken}`)
    .send()
    .expect(200);

    const res4 = await request.get(`/api/v1/users/${starkUserId}/posts/${postId}`)
    .set("Authorization", `Bearer ${starkAccessToken}`)
    .expect(200);

    expect(res4["body"]["data"][0]["data"]["likeCount"] === 0).toBe(true);
});


test("API should return 200 status when attempting to like the same post twice", async() => {
    const tokenRequest = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const starkAccessToken = tokenRequest.body.meta.accessToken;

    const tokenRequestNo2 = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "thor@avengers.io",
        password: "thor@superSecretPassword"
    })
    .expect(200);

    const thorAccessToken = tokenRequestNo2.body.meta.accessToken;

    const res1 = await request.post(`/api/v1/users/${starkUserId}/posts`)
    .set("Authorization", `Bearer ${starkAccessToken}`)
    .send({
        "body": "Is it better to be feared or respected? I say, is it too much to ask for both?",
        "handle": "@tstark"
    })
    .expect(200);
    const postId = res1["body"]["data"][0]["id"];

    const res2 = await request.put(`/api/v1/users/${starkUserId}/posts/${postId}/likes/${thorUserId}`)
    .set("Authorization", `Bearer ${thorAccessToken}`)
    .send()
    .expect(200);

    const res3 = await request.put(`/api/v1/users/${starkUserId}/posts/${postId}/likes/${thorUserId}`)
    .set("Authorization", `Bearer ${thorAccessToken}`)
    .send()
    .expect(200);
});


test("API should return list of users a specified user has subscribed to", async()=> {
    const res1 = await request.get(`/api/v1/users/${thorUserId}/subscriptions`)
    .expect(200);

    expect(Array.isArray(res1.body.data)).toBe(true);
    expect(res1.body.data.length >= 1).toBe(true);
    expect(res1["body"]["data"][0]["data"]["followerCount"] === 1).toBe(true);
});


test("API should return list of the (35) most recent posts", async()=> {
    const res1 = await request.get("/api/v1/feed/latest")
    .expect(200);

    expect(Array.isArray(res1.body.data)).toBe(true);
    expect(res1.body.data.length > 0).toBe(true);
});

test("API should return 204 status when a post is marked as published", async() => {
    const tokenRequest = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const accessToken = tokenRequest.body.meta.accessToken;

    const res1 = await request.post(`/api/v1/users/${starkUserId}/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        "body": "Is it better to be feared or respected? I say, is it too much to ask for both?",
        "handle": "@tstark"
    })
    .expect(200);
    const postId = res1["body"]["data"][0]["id"];
    
    
    const res2 = await request.post(`/api/v1/users/${starkUserId}/posts/${postId}/publish`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(204);
});

test("API should return ALL posts when the requester is the author of the posts", async() => {
    const testUserHandle = randomUserHandle();
    const res1 = await request.post(`/api/v1/users`)
    .send({
        handle: testUserHandle,
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber(),
        password: fakePassword
    })
    .expect(200);

    const accessToken = res1.body.meta.accessToken;
    const userId = res1["body"]["data"][0]["id"];

    const res2 = await request.post(`/api/v1/users/${userId}/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        "body": "You better watch out for the green guy",
        "handle": testUserHandle
    })
    .expect(200);

    const postIdNo1 = res2["body"]["data"][0]["id"];

    await request.post(`/api/v1/users/${userId}/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        "body": "You better watch out for Thanos too. He ain''t playin''",
        "handle": testUserHandle
    })
    .expect(200);

    await request.post(`/api/v1/users/${userId}/posts/${postIdNo1}/publish`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(204);
        
    const res3 = await request.get(`/api/v1/users/${userId}/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(200);

    expect(res3["body"]["data"]["length"] === 2).toBe(true);
});


test("API should return ONLY published posts when the requester is NOT author of the posts", async() => {
    const testUserHandle = randomUserHandle();
    const res1 = await request.post(`/api/v1/users`)
    .send({
        handle: testUserHandle,
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber(),
        password: fakePassword
    })
    .expect(200);

    const hulkAccessToken = res1.body.meta.accessToken;
    const userId = res1["body"]["data"][0]["id"];

    const res2 = await request.post(`/api/v1/users/${userId}/posts`)
    .set("Authorization", `Bearer ${hulkAccessToken}`)
    .send({
        "body": "You better watch out for the green guy",
        "handle": testUserHandle
    })
    .expect(200);

    const postIdNo1 = res2["body"]["data"][0]["id"];

    await request.post(`/api/v1/users/${userId}/posts`)
    .set("Authorization", `Bearer ${hulkAccessToken}`)
    .send({
        "body": "You better watch out for Thanos too. He ain''t playin''",
        "handle": testUserHandle
    })
    .expect(200);

    await request.post(`/api/v1/users/${userId}/posts/${postIdNo1}/publish`)
    .set("Authorization", `Bearer ${hulkAccessToken}`)
    .expect(204);

    const tokenRequest = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "thor@avengers.io",
        password: "thor@superSecretPassword"
    })
    .expect(200);

    const thorAccessToken = tokenRequest.body.meta.accessToken;
        
    const res = await request.get(`/api/v1/users/${userId}/posts`)
    .set("Authorization", `Bearer ${thorAccessToken}`)
    .expect(200);

    expect(res["body"]["data"]["length"] === 1).toBe(true);
});

/***Negative Tests***/


test("Should return status code 400 when attempting to create invalid post", async() => {
    const tokenRequest = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const accessToken = tokenRequest.body.meta.accessToken;

    const res1 = await request.post(`/api/v1/users/${starkUserId}/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        body: "Is it better to be feared or respected? I say, is it too much to ask for both?"
    })
    .expect(400);
});


test("Should return status code 400 when attempting to create post exceeding configured length limit", async() => {
    const tokenRequest = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const accessToken = tokenRequest.body.meta.accessToken;

    const res1 = await request.post(`/api/v1/users/${starkUserId}/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        body: "I'm baby hammock disrupt pop-up, ugh bushwick taxidermy before they sold out gentrify coloring book. Cardigan deep v taiyaki occupy. Hashtag cray dreamcatcher try-hard blog.",
        handle: "@tstark"
    })
    .expect(400);
});

test("Should return status code 404 when attempting to create post for a user that does not exist", async() => {
    const tokenRequest = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const accessToken = tokenRequest.body.meta.accessToken;

    const res1 = await request.post(`/api/v1/users/@tstark/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        body: "Is it better to be feared or respected? I say, is it too much to ask for both?",
        handle: "@tstark"
    })
    .expect(404);
});

test("Should return status code 404 when attempting to get posts for a user that does not exist", async() => {
    const tokenRequest = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const accessToken = tokenRequest.body.meta.accessToken;

    const res1 = await request.get(`/api/v1/users/@tstark/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        body: "Is it better to be feared or respected? I say, is it too much to ask for both?",
        handle: "@tstark"
    })
    .expect(404);
});
