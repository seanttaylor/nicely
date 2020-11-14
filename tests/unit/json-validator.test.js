const IValidator = require("../../src/interfaces/validator");
const JSONValidator = require("../../src/lib/validator/json");
const schemas = require("../../src/schemas/user/api")
const validator = new IValidator(new JSONValidator(schemas));

/**Tests**/

/***Comments***/
test("Should return true for a valid comment ", async() => {
    const data = {
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        body: "Playboy. Billionaire. Genius.",
        postId: "256e3b07-5f84-4e5c-a937-15bab9188b1e"
    };
    expect(validator.validate({validateWithRequiredFields: true, schema: "comment"}, data).result).toBe(true);
});

test("Should return true for a valid comment with partial fields when `validateRequiredFields is FALSE ", async() => {
    const data = {
        body: "Playboy. Billionaire. Genius."
    };
    expect(validator.validate({validateWithRequiredFields: false, schema: "comment"}, data).result).toBe(true);
});

test("Should return false on invalid comments", async() => {
    const data = {
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        body: "Playboy. Billionaire. Genius.",
    };
    expect(validator.validate({validateWithRequiredFields: true, schema: "comment"}, data).result).toBe(false);
});

test("Should return false on valid comments that include additional properties", async() => {
    const data = {
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        body: "Playboy. Billionaire. Genius.",
        handle: "@tstark",
        foo: "bar"
    };
    expect(validator.validate({validateWithRequiredFields: true, schema: "comment"}, data).result).toBe(false);
});

/***Posts***/
test("Should return true on valid posts", async() => {
    const data = {
        body: "I'm just wild about Harry",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: "@tstark"
    };
    expect(validator.validate({validateWithRequiredFields: true, schema: "post"}, data).result).toBe(true);
});

test("Should return true for a valid post with partial fields when `validateRequiredFields is FALSE", async() => {
    const data = {
        body: "I'm just wild about Harry"
    };
    expect(validator.validate({validateWithRequiredFields: false, schema: "post"}, data).result).toBe(true);
});

test("Should return false on valid posts that include additional properties", async() => {
    const data = {
        body: "I'm just wild about Harry",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        handle: "@tstark",
        foo: "bar"
    };

    expect(validator.validate({validateWithRequiredFields: true, schema: "post"}, data).result).toBe(false);
});

test("Should return false on invalid posts", async() => {
    const data = {
        body: "I'm just wild about Harry",
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
    };

    expect(validator.validate({validateWithRequiredFields: true, schema: "post"}, data).result).toBe(false);
});

/***Users***/
test("Should return true for user withon a valid user", async() => {
    const data = {
        handle: "@somethingrandom",
        motto: "Always be prepared",
        emailAddress: "totally@somethingrandom.io",
        firstName: "George",
        lastName: "Spelvin",
        phoneNumber: "2125552424"
    };
    expect(validator.validate({validateWithRequiredFields: true, schema: "user"}, data).result).toBe(true);
});

test("Should return true on valid user with partial fields when `validateRequiredFields is FALSE", async() => {
    const data = {
        emailAddress: "totally@somethingrandom.io"
    };
    expect(validator.validate({validateWithRequiredFields: false, schema: "user"}, data).result).toBe(true);
});

test("Should return false on invalid user", async() => {
    const data = {
        emailAddress: "totally@somethingrandom.io",
        firstName: "George",
        lastName: "Spelvin",
        phoneNumber: "2125552424"
    };
    expect(validator.validate({validateWithRequiredFields: true, schema: "user"}, data).result).toBe(false);
});

test("Should return false on valid users with additional properties", async() => {
    const data = {
        handle: "@somethingrandom",
        motto: "Always be prepared",
        emailAddress: "totally@somethingrandom.io",
        firstName: "George",
        lastName: "Spelvin",
        phoneNumber: "2125552424",
        foo: "bar"
    };

    expect(validator.validate({validateWithRequiredFields: true, schema: "user"}, data).result).toBe(false);
});

/***Negative Tests***/

test("Should throw on missing validation candidate data", async() => {
    expect(()=> {
        validator.validate({validateWithRequiredFields: true, schema: "user"});
    }).toThrow();
});
