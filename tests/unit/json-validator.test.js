const IValidator = require("../../src/interfaces/validator");
const JSONValidator = require("../../src/lib/validator/json");
const schemas = require("../../src/schemas/user/api")
const validator = new IValidator(new JSONValidator(schemas));

/**Tests**/

test("Should return true for a valid comment ", async() => {
    const data = {
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        body: "Playboy. Billionaire. Genius.",
        handle: "@tstark"
    };
    const res = validator.validate({validateWithRequiredFields: true, schema: "comment"}, data);

    expect(res).toBe(true);
});

test("Should return true for a valid comment with partial fields when `validateRequiredFields is FALSE ", async() => {
    const data = {
        body: "Playboy. Billionaire. Genius."
    };
    const res = validator.validate({validateWithRequiredFields: false, schema: "comment"}, data);

    expect(res).toBe(true);
});

test("Should throw on invalid comments", async() => {
    const data = {
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        body: "Playboy. Billionaire. Genius.",
    };
    expect(() => {
        validator.validate({validateWithRequiredFields: true, schema: "comment"}, data);
    }).toThrow();
});

test("Should throw on valid comments that include additional properties", async() => {
    const data = {
        userId: "e98417a8-d912-44e0-8d37-abe712ca840f",
        body: "Playboy. Billionaire. Genius.",
        handle: "@tstark",
        foo: "bar"
    };
    expect(()=> {
        validator.validate({validateWithRequiredFields: true, schema: "comment"}, data);
    }).toThrow();
});