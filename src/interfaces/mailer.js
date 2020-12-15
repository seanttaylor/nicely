/**
* An object having the IMailer API; a set of methods for sending emails
* @typedef {Object} IMailerAPI
* @property {Function} send - send an email to specified recipients
* @property {Function} addAttachments - add attachments to an email
* @property {Function} useTemplate - configure the email template to send the message 
*/

/**
* Interface for an email message service
* @param {IMailerAPI} myImpl - Object containing methods implementing the IMailerAPI
* @returns 
*/

function IMailer(myImpl) {
    function required() {
        throw Error("Missing implementation");
    }

    this._message = {};

    this.addAttachments = myImpl.addAttachments || required;

    this.send = myImpl.send || required;

    this.useTemplate = myImpl.useTemplate || required;

    return;
}

module.exports = IMailer;