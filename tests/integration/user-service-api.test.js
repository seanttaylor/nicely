/**********************************************/
//ENSURE NODE_ENV is hardcoded to "ci/cd/test"//
/**********************************************/
process.env.NODE_ENV = "ci/cd/test";

const app = require("../../index");
const supertest = require("supertest");
const request = supertest(app);
const { randomEmailAddress, randomPhoneNumber, randomUserHandle } = require("../../src/lib/utils");


const globalUserId = "e98417a8-d912-44e0-8d37-abe712ca840f";
const globalUserIdNo2 = "b0a2ca71-475d-4a4e-8f5b-5a4ed9496a09";

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
        phoneNumber: randomPhoneNumber()
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
        phoneNumber: randomPhoneNumber()
    })
    .expect(200);
    const userId = res1["body"]["data"][0]["id"];
    
    const res2 = await request.put(`/api/v1/users/${userId}/name`)
    .send({
        firstName: "Bruce",
        lastName: "Banner, M.D."
    })
    .expect(200);
    expect(res2["body"]["data"][0]["data"]["lastName"] === "Banner, M.D.").toBe(true);

    const res3 = await request.put(`/api/v1/users/${userId}/name`)
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
        phoneNumber: randomPhoneNumber()
    })
    .expect(200);
    const userId = res1["body"]["data"][0]["id"];
    
    const res2 = await request.put(`/api/v1/users/${userId}/motto`)
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
        phoneNumber: randomPhoneNumber()
    })
    .expect(200);
    const userId = res1["body"]["data"][0]["id"];
    
    const res2 = await request.put(`/api/v1/users/${userId}/phone`)
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
        phoneNumber: randomPhoneNumber()
    })
    .expect(200);
   
    const res2 = await request.post(`/api/v1/users`)
    .send({
        handle: randomUserHandle(),
        motto: "Always bet on black",
        emailAddress: randomEmailAddress(),
        firstName: "Nick",
        lastName: "Fury",
        phoneNumber: randomPhoneNumber()
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
        phoneNumber: randomPhoneNumber()
    })
    .expect(200);
   
    const res2 = await request.post(`/api/v1/users`)
    .send({
        handle: randomUserHandle(),
        motto: "Always bet on black",
        emailAddress: randomEmailAddress(),
        firstName: "Nick",
        lastName: "Fury",
        phoneNumber: randomPhoneNumber()
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
        phoneNumber: randomPhoneNumber()
    })
    .expect(200);
   
    const res2 = await request.post(`/api/v1/users`)
    .send({
        handle: randomUserHandle(),
        motto: "Always bet on black",
        emailAddress: randomEmailAddress(),
        firstName: "Nick",
        lastName: "Fury",
        phoneNumber: randomPhoneNumber()
    })
    .expect(200);

    const userId = res1["body"]["data"][0]["id"];
    const followerId = res2["body"]["data"][0]["id"];

    await request.put(`/api/v1/users/${userId}/followers/${followerId}`)
    .send()
    .expect(204);
    
    const res3 = await request.get(`/api/v1/users/${userId}/followers`)
    .expect(200);

    expect(Array.isArray(res3["body"]["data"])).toBe(true);
    expect(res3["body"]["data"].length === 1).toBe(true);
});



