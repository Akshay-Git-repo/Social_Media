const nodemailer=require('nodemailer');
const path=require('path');
const ejs=require('ejs');

let transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    port: 587, //port for TLS ,foer more details check gmail smtp settings
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'akshaykharade95@gmail.com', // generated ethereal user
      pass: 'kharade6041995@', // generated ethereal password
    }
  ,});



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


  module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate

  };