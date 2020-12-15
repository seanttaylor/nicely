/* Implements the IMailer interface
* See interfaces/mailer for method documentation
* Sends email messages
*/

/**
* An configuration object for send emails via the Mailable interface.
* @typedef {Object} EmailMessageConfiguration
* @property {String} from - email addrress of the sender
* @property {String} to - email address of the primary recipient
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

function Mailer () {
    
    /**
    * Sends an email to specified recipients
    * @param {EmailMessageConfiguration} 
    */

    this.send = async function({ from, to, bcc, subject }) {
        this._message = Object.assign(this.__message, {
            from,
            to: to.join(', '), // Nodemailer API requires a single comma-separated string of addresses
            subject
        });

        const outboundMessage = await transporter.sendMail(this.__message);
        console.log({
            messageId: outboundMessage.messageId,
            messagePreviewURL: nodemailer.getTestMessageUrl(outboundMessage)
        });
    }

    this.addAttachments = function() {

    }

    /**
    * Sets the HTML email template that will be used to display the message when sent
    * @param {String} renderedTemplate - the finalized template produced by the Templatable API
    */

    this.useTemplate = function(renderedTemplate) {
        this._message.html = renderedTemplate;
    }

}
 

module.exports = Mailer;