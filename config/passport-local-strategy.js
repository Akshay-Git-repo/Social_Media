const passport=require("passport");
const User = require("../models/user");

const LocalStrategy=require("passport-local").Strategy;


//Authentication using passport
passport.use(new LocalStrategy(

    {

        usernameField:'email',
        passReqToCallback:true
        
    },function(req,email,password,done)
    {
    //find the user in mongodb
        User.findOne({email:email},function(err,user)
        {
            if(err)
            {
           // console.log("Error in finding the User---> Passport");
           req.flash("error",err);//use of flash
            return done(err);  //report an error to passport
            }
            if(!user||user.password!=password)
            {
               // console.log("Invalid Usernam/Password");
               req.flash("error","Invalid Username/Password");//use of flash
                return done(null,false); //null means no error and false means authentiction is not yet done
            }
            return done(null,user);//return null means no error and pass the user as authentication done
        });
    }
));

//serializing the user to decide which key is to be kept in the cookie

passport.serializeUser(function(user,done)
{
    done(null,user.id);
});

//deserializing the user from key in the cookies

passport.deserializeUser(function(id,done)
{
    console.log("inside deserialize");
    User.findById(id,function(err,user)
    {
        if(err)
        {
        console.log("Error in finding the User---> Passport");
        return done(err);
        }

        return done(null,user);   
    });
});

//check for the authentication to access other pages once you are sign in 

passport.checkAuthentication=function(req,res,next)
{

    console.log(req.isAuthenticated());
    //if the user is signed in pass on the request to next function(controllers action)
    if(req.isAuthenticated())
    {
        next();
    }

    //if user is ot signed in
    else{
    return res.redirect("/users/sign-in");
    }
}

passport.setAuthenticatedUser=function(req,res,next)
{

    if(req.isAuthenticated())
    {
        //req.user contains the current signrd in user data from session cookie  and we are sendig it to locals for the views
        console.log("User set in passport local strategy");
        res.locals.user=req.user;
    }

next();
}


//export it

module.exports=passport;