const nodemailer=require('nodemailer');
const path=require('path');
const ejs=require('ejs');
const env=require("./environment");
let transporter = nodemailer.createTransport(env.smtp);



  //now here we want to define that we want to use ejs for template

  let renderTemplate=(data,relativePath)=>
  {

    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template)
        {
            if(err)
            {
                console.log("Error in rendering the template",err);
                return;
            }
            mailHTML=template;
        }
    )
        return mailHTML;
  }

//render template for the reset password mail

let renderTemplateForResetPassword=(data,relativePath)=>
  {
    console.log('insidetemplateresetpass');

    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template)
        {
            if(err)
            {
                console.log("Error in rendering the template",err);
                return;
            }
            mailHTML=template;
        }
    )
        return mailHTML;
  }



  module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate,
    renderTemplateForResetPassword:renderTemplateForResetPassword
  };