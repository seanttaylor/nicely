const EmailTemplate = require("../lib/mail/email-templates");

/**
* An configuration object for send emails via the Mailable interface.
* @typedef {Object} EmailMessageConfiguration
* @property {String} from - email addrress of the sender
* @property {Array} to - email address of the primary recipient
* @property {Array} bcc - List of email addresses to 'bcc'
* @property {Array} cc - List of email addresses to 'cc'
* @property {String} subject - Subject of the email
*/


/**
* @typedef {Object} MailSService
* @property {Object} _mailLib - the mail library containing the business logic to send email
* @property {Object} _transporter - a transporter object for sending the email message
* @property {Function} send - sends an email
*/

/**
 * @implements {IMailerAPI}
 * @returns {Object} an implementation of the IMailer interface
 */

/**
 * @param {Object} console - the console object
 * @param {Object} eventEmitter - an instance of EventEmitter
 * @param {Object} mailLib - an email library 
 */

function MailService({console, eventEmitter}, mailLib) {
    //this._mailLib = mailLib.lib;
    //this._transporter = mailLib.transporter;

    eventEmitter.on("userService.newUserCreated", sendWelcomeEmail.bind(this));

    async function sendWelcomeEmail(user) {
        await this.send({
            from: process.env.PLATFORM_OUTBOUND_EMAIL_USERNAME,
            to: [user._data.emailAddress],
            subject: "Welcome to Nicely!",
            html: await EmailTemplate.of({templateName: "welcomeEmail", data: user._data})
        });
    }

    /**
    * Sends an email to specified recipients
    * @param {EmailMessageConfiguration} 
    */

    this.send = async function({ from, to, bcc, subject, html}) {
        const message = {
            from,
            to: to.join(', '), // Nodemailer API requires a single comma-separated string of addresses
            bcc,
            subject,
            html
        };

        const outboundMessage = await mailLib.transporter.sendMail(message);
        console.log({
            messageId: outboundMessage.messageId,
            messagePreviewURL: mailLib.lib.getTestMessageUrl(outboundMessage)
        });
    }
}



module.exports = MailService;