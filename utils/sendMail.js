const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "promit.revar2211@gmail.com",
    pass: "dolkldofiebtjozw",
  },
});
module.exports = async function sendEmail(email) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <promit.revar2211@gmail.com>', // sender address
      to: `${email}, revarpromit.prashant2019@vitstudent.ac.in`, // list of receivers
      subject: "Your Booking has been confirmed ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
