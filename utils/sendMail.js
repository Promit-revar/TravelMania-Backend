const nodemailer = require("nodemailer");
const emailTemplate = require("./constants");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.ADMIN_EMAIL_ID,
    pass: process.env.ADMIN_EMAIL_APP_PASSWORD,
  },
});
module.exports = async function sendEmail({email, name, bookingData}) {
    // send mail with defined transport object
    const info = await transporter.sendMail(emailTemplate({email,name, bookingData}));
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
