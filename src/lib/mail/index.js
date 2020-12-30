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
 

module.exports = {
    lib: nodemailer,
    transporter
};