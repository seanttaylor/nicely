/* istanbul ignore file */

/**
 * Mock implementation for various mailer service methods
 */
const mockMailerImplementation =  {
    transporter: {
        async sendMail(data) {
            mockMailerImplementation.calledMethods.sendMail = true;
            return {messageId: "fake-id", messagePreviewURL: "http://who-cares.io"}
        }
    },
    lib: {
        getTestMessageUrl() {
            mockMailerImplementation.calledMethods.getTestMessageUrl = true;
        }
    },
    calledMethods: {
        sendMail: false,
        getTestMessageUrl: false
    }
}

module.exports = mockMailerImplementation;