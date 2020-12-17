const IMailer= require("../../src/interfaces/mailer");
const MailService = require("../../src/lib/mailer");
const console = require("../../src/lib/utils/mocks/console");
const testMailService = new IMailer(new MailService({console}));
const mockImpl = require("../../src/lib/utils/mocks/mailer");

/**Tests**/

test("Should send an email", async() => {
    testMailService.send.call(mockImpl, {
        from: "qa@nicely.io", 
        to: ["noone@none.com"], 
        subject: "Test Email",
        html: "<h1>A Test Email</h1>"
    });
    expect(mockImpl.calledMethods.sendMail).toBe(true);
});

test("Should throw an error when interface methods are NOT overridden with an implementation", async() => {
    const testMailService1 = new IMailer({});

    try {
        testMailService1.send.call(mockImpl, {
            from: "qa@nicely.io", 
            to: ["noone@none.com"], 
            subject: "Test Email",
            html: "<h1>A Test Email</h1>"
        });
    } catch (e) {
        expect(e.message).toMatch("Missing implementation");
    }
});


