import nodeMailer from "nodemailer";

const sendEmail = async (options) => {
  // creat ea transport
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // defien the email  options
  const mailOptions = {
    from: "Jatin Dua<jatin.dua2003@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
  };
  console.log(mailOptions);

  // actually send the email
  await transporter.sendMail(mailOptions);
};
export default sendEmail;
