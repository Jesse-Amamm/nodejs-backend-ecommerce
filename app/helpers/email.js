const nodemailer = require("nodemailer");

//sample transport object
// {
//     receiver: "ekemammezez@gmail.com",
//     subject: "Account Verification",
//     text: "Please click https://verificationlink to verify your account",
//     html: "<html><body><p>Please click <a href='#'>Here</a> to verify your account</p></body></html>"
// }
exports.sendMail = async transportObject => {
  try {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass // generated ethereal password
      }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      //   from: '"Fred Foo 👻" <foo@example.com>', // sender address
      from: '"Sino Digital Africa Exchange" <sade.com>', // sender address
      to: transportObject.receiver, // list of receivers
      subject: transportObject.subject, // Subject line
      text: transportObject.plainText, // plain text body
      html: transportObject.htmlBody // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    return true;
  } catch (err) {
    console.log(err);
  }
};
