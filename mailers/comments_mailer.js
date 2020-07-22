const nodemailer=require('../config/nodemailer');


exports.newComment=(comment)=>
{
    console.log("Inside NodeMailer Section");
    let htmlString=nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');
    nodemailer.transporter.sendMail({
        
        from: 'test@codeial.com', // sender address
        to: comment.user.email, // list of receivers
        subject: "New Comment Published", // Subject line
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
