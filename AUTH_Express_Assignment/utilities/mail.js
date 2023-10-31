import {createTransport} from "nodemailer";

const sendMessage=async function(email,subject,message){
let myEmail=createTransport({
host:process.env.SMTP_HOST,
port:process.env.SMTP_PORT,
secure:false,
auth:{
    user:process.env.SMTP_USERNAME,
    pass:process.env.SMTP_PASSWORD,
},

});

const mail={
    from:process.env.EMAIL_SEND_FROM,
    to:email,
    subject:subject,
    text:message
};

// await myEmail.sendMail(mail,function(error,info){
//     if(error){
//     console.log(error);

//   }
// else
//  console.log("Email send: "+info.response);
// });
await myEmail.sendMail(mail);
}
export default sendMessage;