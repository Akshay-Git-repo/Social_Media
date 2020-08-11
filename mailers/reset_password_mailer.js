const nodemailer=require('../config/nodemailer');


exports.resetpassword=(resetpassword)=>
{
    console.log("Inside NodeMailer Section");
    console.log(resetpassword.user);
    let htmlString=nodemailer.renderTemplateForResetPassword({resetpassword:resetpassword},'/reset_pass/reset_pass_template.ejs');
    nodemailer.transporter.sendMail({
        
        from: 'test@codeial.com', // sender address
        to: resetpassword.user, // list of receivers
        subject: "Reset Your Password", // Subject line
       // html: "<h1>Congratulations!!You have commented on a Post</h1>", // html body if we didnt define the htmlbody in another ejs file
       html:htmlString,
    },(err,info)=>
    {
        if(err)
        {
            console.log("Error While sending the Mail",err);
            return;
        }
        else{
            console.log("Mail Sent",info);
            return;

        }
    });
}
