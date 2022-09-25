const nodemailer = require('nodemailer');
const { options } = require('../routes/user');

const sendmail = async (options) => {

    // create reusable transporter object using the default SMTP transport
    var transport = nodemailer.createTransport({
        host:   process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        // service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS 
        //   user: "shahidkhan0085200@gmail.com",
        //   pass: ""
        }
      });
    const message ={
        from: 'shahidkhan0085200@gmail.com', // sender address
        to: "shahidkhan501112@gmail.com", // list of receivers
        subject: options.subject, // Subject line
        text: options.text, // plain text body
        html: options.html, // html body
      }
    // send mail with defined transport object
    let info = await transport.sendMail(message);


}

module.exports = sendmail;
