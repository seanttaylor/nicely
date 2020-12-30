/**********************************************/
//ENSURE NODE_ENV is hardcoded to "ci/cd/test"//
/**********************************************/
process.env.NODE_ENV = "ci/cd/test";

const app = require("../index");
const supertest = require("supertest");
const request = supertest(app);
const { randomEmailAddress, randomPhoneNumber, randomUserHandle } = require("../../src/lib/utils");

const globalUserId = "e98417a8-d912-44e0-8d37-abe712ca840f";
const globalUserIdNo2 = "b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09";
const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjpbInVzZXIiXX0.gq1_kjBm7mhhGIBR-3zO-NdOd-Bc-_WMPebWjGNXSms";
const fakePassword = "superSecretPassword";

test("NODE_ENV should be `ci/cd/test`", () => {
    expect(process.env.NODE_ENV === "ci/cd/test").toBe(true);
});

test("Should return new user", async()=> {
    const res1 = await request.post(`/api/v1/users`)
    .send({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber(),
        password: fakePassword
    })
    .expect(200);
});

test("API should return list of users", async()=> {
    const res1 = await request.get(`/api/v1/users`)
    .expect(200);

    expect(Array.isArray(res1["body"]["data"])).toBe(true);
    expect(res1["body"]["data"].length > 0).toBe(true);
});

test("API should return a specified User instance", async() => {
    const res1 = await request.get(`/api/v1/users/${globalUserId}`)
    .expect(200);

    expect(res1["body"]["data"].length === 1).toBe(true);
    expect(res1["body"]["data"][0]["id"] === globalUserId).toBe(true);
});

test("API should update user name", async() => {
      
    const res1 = await request.post(`/api/v1/users`)
    .send({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber(),
        password: fakePassword
    })
    .expect(200);
    
    const accessToken = res1["body"]["meta"]["accessToken"];
    const userId = res1["body"]["data"][0]["id"];
    
    const res2 = await request.put(`/api/v1/users/${userId}/name`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        firstName: "Bruce",
        lastName: "Banner, M.D."
    })
    .expect(200);
    expect(res2["body"]["data"][0]["data"]["lastName"] === "Banner, M.D.").toBe(true);

    const res3 = await request.put(`/api/v1/users/${userId}/name`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        firstName: "Hulk",
        lastName: "Smash!"
    })
    .expect(200);
    expect(res3["body"]["data"][0]["data"]["lastName"] === "Smash!").toBe(true);
    expect(res3["body"]["data"][0]["data"]["firstName"] === "Hulk").toBe(true);
});

test("API should update user motto", async() => {
    const res1 = await request.post(`/api/v1/users`)
    .send({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber(),
        password: fakePassword
    })
    .expect(200);

    const accessToken = res1["body"]["meta"]["accessToken"];
    const userId = res1["body"]["data"][0]["id"];
    
    const res2 = await request.put(`/api/v1/users/${userId}/motto`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        motto: "Always be smashing!"
    })
    .expect(200);
    
    expect(res2["body"]["data"][0]["data"]["motto"] === "Always be smashing!").toBe(true);
});


test("API should update user phone number", async() => {
    const testPhoneNumberEdit = randomPhoneNumber();
    const res1 = await request.post(`/api/v1/users`)
    .send({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber(),
        password: fakePassword
    })
    .expect(200);

    const accessToken = res1["body"]["meta"]["accessToken"];
    const userId = res1["body"]["data"][0]["id"];
    
    const res2 = await request.put(`/api/v1/users/${userId}/phone`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        phoneNumber: testPhoneNumberEdit
    })
    .expect(200);
});

test("API should add a follower to an existing user", async() => {
    const res1 = await request.post(`/api/v1/users`)
    .send({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber(),
        password: fakePassword
    })
    .expect(200);
   
    const res2 = await request.post(`/api/v1/users`)
    .send({
        handle: randomUserHandle(),
        motto: "Always bet on black",
        emailAddress: randomEmailAddress(),
        firstName: "Nick",
        lastName: "Fury",
        phoneNumber: randomPhoneNumber(),
        password: fakePassword
    })
    .expect(200);

    const userId = res1["body"]["data"][0]["id"];
    const followerId = res2["body"]["data"][0]["id"];

    const res3 = await request.put(`/api/v1/users/${userId}/followers/${followerId}`)
    .send()
    .expect(204);
    
    const res4 = await request.get(`/api/v1/users/${userId}`)
    .expect(200);

    expect(res4["body"]["data"][0]["data"]["followerCount"] === 1).toBe(true);
});

test("API should remove a follower from an existing user", async() => {
    const res1 = await request.post(`/api/v1/users`)
    .send({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber(),
        password: fakePassword
    })
    .expect(200);
   
    const res2 = await request.post(`/api/v1/users`)
    .send({
        handle: randomUserHandle(),
        motto: "Always bet on black",
        emailAddress: randomEmailAddress(),
        firstName: "Nick",
        lastName: "Fury",
        phoneNumber: randomPhoneNumber(),
        password: fakePassword
    })
    .expect(200);

    const userId = res1["body"]["data"][0]["id"];
    const followerId = res2["body"]["data"][0]["id"];

    const res3 = await request.delete(`/api/v1/users/${userId}/followers/${followerId}`)
    .send()
    .expect(204);
    
    const res4 = await request.get(`/api/v1/users/${userId}`)
    .expect(200);

    expect(res4["body"]["data"][0]["data"]["followerCount"] === 0).toBe(true);
});

test("API should return a list of followers of a specified user", async() => {
    const res1 = await request.post(`/api/v1/users`)
    .send({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: randomEmailAddress(),
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber(),
        password: fakePassword
    })
    .expect(200);
   
    const res2 = await request.post(`/api/v1/users`)
    .send({
        handle: randomUserHandle(),
        motto: "Always bet on black",
        emailAddress: randomEmailAddress(),
        firstName: "Nick",
        lastName: "Fury",
        phoneNumber: randomPhoneNumber(),
        password: fakePassword
    })
    .expect(200);

    const userId = res1["body"]["data"][0]["id"];
    const followerId = res2["body"]["data"][0]["id"];

    await request.put(`/api/v1/users/${userId}/followers/${followerId}`)
    .send()
    .expect(204);
    
    const res3 = await request.get(`/api/v1/users/${userId}/followers`)
    .send()
    .expect(200);

    expect(Array.isArray(res3["body"]["data"])).toBe(true);
    expect(res3["body"]["data"].length === 1).toBe(true);
});

test("API should return an access token", async() => {
    const res1 = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const accessToken = res1.body.meta.accessToken;
    expect(typeof(accessToken)).toBe("string");
});

/*
TEST MAY BE DEPRECATED
test("API should return a 401 status code on attempt(s) to access unauthorized resources", async() => {
    const res1 = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "thor@avengers.io",
        password: "thor@superSecretPassword"
    })
    .expect(200);

    const accessToken = res1.body.meta.accessToken;

    const re2 = await request.get(`/api/v1/users/${globalUserId}/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send()
    .expect(401);
});
TEST MAY BE DEPRECATED
*/

test("API should return the feed of a specified user", async() => {
    const userNo1EmailAddress = randomEmailAddress();
    const userNo1Handle = randomUserHandle();

    const res1 = await request.post(`/api/v1/users`)
    .send({
        handle: randomUserHandle(),
        motto: "Hulk smash!",
        emailAddress: userNo1EmailAddress,
        firstName: "Bruce",
        lastName: "Banner",
        phoneNumber: randomPhoneNumber(),
        password: fakePassword
    })
    .expect(200);

    const userNo1Id = res1["body"]["data"][0]["id"];

    const accessTokenRequest =  await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: userNo1EmailAddress,
        password: fakePassword
    })
    .expect(200);

    const accessToken = accessTokenRequest.body.meta.accessToken;

    const res2 = await request.post(`/api/v1/users/${userNo1Id}/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
        "body": "Is it better to be feared or respected? I say, is it too much to ask for both?",
        "handle": userNo1Handle
    })
    .expect(200)

    const postId = res2["body"]["data"][0]["id"];
   
    const res3 = await request.post(`/api/v1/users`)
    .send({
        handle: randomUserHandle(),
        motto: "Always bet on black",
        emailAddress: randomEmailAddress(),
        firstName: "Nick",
        lastName: "Fury",
        phoneNumber: randomPhoneNumber(),
        password: fakePassword
    })
    .expect(200);

    const followerId = res3["body"]["data"][0]["id"];

    await request.post(`/api/v1/users/${userNo1Id}/posts/${postId}/publish`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(204);

    await request.put(`/api/v1/users/${userNo1Id}/followers/${followerId}`)
    .send()
    .expect(204);
    
    const res4 = await request.get(`/api/v1/users/${followerId}/feed`)
    .expect(200);

    expect(Array.isArray(res4["body"]["data"])).toBe(true);
    expect(res4["body"]["data"]["length"] === 1).toBe(true);
    expect(res4["body"]["data"][0]["id"] === postId).toBe(true);
});

test("API should return 200 status code on attempt(s) to access authorized resources", async() => {
    const res1 = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const accessToken = res1.body.meta.accessToken;

    const res2 = await request.get(`/api/v1/users/${globalUserId}/posts`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send()
    .expect(200);
});

test("API should return 401 status when user attempts to edit post they have NOT created", async() => {
    const testEdit = "Thor out here playing games";
    const res1 = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "tstark@avengers.io",
        password: "superSecretPassword"
    })
    .expect(200);

    const starkAccessToken = res1.body.meta.accessToken;

    const res2 = await request.post(`/api/v1/users/token`)
    .send({
        emailAddress: "thor@avengers.io",
        password: "thor@superSecretPassword"
    })
    .expect(200);

    const thorAccessToken = res2.body.meta.accessToken;

    const res3 = await request.post(`/api/v1/users/${globalUserId}/posts`)
    .set("Authorization", `Bearer ${starkAccessToken}`)
    .send({
        "body": "Is it better to be feared or respected? I say, is it too much to ask for both?",
        "handle": "@tstark"
    })
    .expect(200);

    const postId = res3["body"]["data"][0]["id"];

    const res4 = await request.put(`/api/v1/users/${globalUserId}/posts/${postId}`)
    .set("Authorization", `Bearer ${thorAccessToken}`)
    .send({
        "body": testEdit,
        "handle": "@tstark"
    })
    .expect(401);
});





