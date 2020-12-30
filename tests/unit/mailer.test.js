const IMailer= require("../../src/interfaces/mailer");
const MailService = require("../../src/services/mail");
const console = require("../../src/lib/utils/mocks/console");
const events = require("events");
const eventEmitter = new events.EventEmitter();
const mailLib = require("../../src/lib/utils/mocks/mailer");
const testMailService = new IMailer(new MailService({console, eventEmitter}, mailLib));
const EmailTemplate = require("../../src/lib/mail/email-templates");

/**Tests**/

test("Should send an email", async() => {
    testMailService.send({
        from: "qa@nicely.io", 
        to: ["noone@none.com"], 
        subject: "Test Email",
        html: "<h1>A Test Email</h1>"
    });
    expect(mailLib.calledMethods.sendMail).toBe(true);
});

test("Should throw an error when interface methods are NOT overridden with an implementation", async() => {
    const testMailService1 = new IMailer({});

    try {
        testMailService1.send({
            from: "qa@nicely.io", 
            to: ["noone@none.com"], 
            subject: "Test Email",
            html: "<h1>A Test Email</h1>"
        });
    } catch (e) {
        expect(e.message).toMatch("Missing implementation");
    }
});

test("Should use a specified template filename to render email if a named templated is not provided", async() => {
    const myTemplate = await EmailTemplate.of({
        filePath: "./src/lib/mail/email-templates/welcome-email.ejs", 
        data: {
            data: {
                firstName: "Tony"
            }
        }
    });

    expect(typeof(myTemplate) === "string").toBe(true);
});


