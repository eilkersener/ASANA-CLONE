const nodemailer = require('nodemailer');
const eventEmitter = require('./eventEmitter');


module.exports = ()=>{
    eventEmitter.on("send_email", async(emaildData)=>{
        
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.EMAIL_USER, // generated ethereal user
              pass: process.env.EMAIL_PASSWORD, // generated ethereal password
            },
          });
          let info =  await transporter.sendMail({
            from: process.env.EMAIL_FROM, // sender address
            ...emaildData,
          });
          console.log("Message send:", info.messageId)
         
      })
}