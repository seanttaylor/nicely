/* Implements the IMailer interface
* See interfaces/mailer for method documentation
* Sends email messages
*/

/**
* An configuration object for send emails via the Mailable interface.
* @typedef {Object} EmailMessageConfiguration
* @property {String} from - email addrress of the sender
* @property {Array} to - email address of the primary recipient
* @property {Array} bcc - List of email addresses to 'bcc'
* @property {Array} cc - List of email addresses to 'cc'
* @property {String} subject - Subject of the email
*/


const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.PLATFORM_OUTBOUND_EMAIL_USERNAME,
        pass: process.env.PLATFORM_OUTBOUND_EMAIL_PASSWORD
    }
});

/**
 * @implements {IMailerAPI}
 * @returns {Object} an implementation of the IMailer interface
 */

function Mailer ({console}) {
    this._mailLib = nodemailer;
    this._transporter = transporter;

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

        const outboundMessage = await this._transporter.sendMail(message);
        console.log({
            messageId: outboundMessage.messageId,
            messagePreviewURL: this._mailLib.getTestMessageUrl(outboundMessage)
        });
    }

}
 

module.exports = Mailer;