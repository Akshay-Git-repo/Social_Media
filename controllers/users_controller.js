const User=require("../models/user");



module.exports.profile=function(req,res)
{
    return res.render('user',
    {
        title:"User Page"
    })
}

module.exports.signUp=function(req,res)
{
    return res.render('user_sign_up',
    {
        title:"Codeial | Sign Up"
    })
}


module.exports.signIn=function(req,res)
{
    return res.render('user_sign_in',
    {
        title:"Codeial | Sign In"
    })
}

//get the sign up data

module.exports.create=function(req,res)
{

    if(req.body.password!=req.body.confirm_password)
    {
        return res.redirect("back");
    }
    //check the email(as email should be unique) data came in req is present in the mongodb
    User.findOne({email:req.body.email},function(err,user)
    {
        if(err)
        {
            console.log("Error n finding user in signing up");
            return;
        }
        //if req data is not present in the mongodb create the entry in the mongodb
        if(!user)
        {
            User.create(req.body,function(err,user)
            {
                if(err)
                {
                    console.log("Error in creating the User");
                    return;
                }

                return res.redirect("/users/sign-in");
            });
        }

        //if req data is  present in the mongodb go back to the sign up page
    else{
        return res.redirect("back");
        }

    });



}

//get the sign in data and  create the session
module.exports.createSession=function(req,res)
{
    
}



//JUST FOR PRACTICE 
module.exports.about=function(req,res)
{
    return res.end("<h1>HI ,my name is Akshay Kharade")
}