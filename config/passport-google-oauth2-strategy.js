const passport=require("passport");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto=require("crypto");
const User=require("../models/user");
const env=require("./environment");

//use of google startegy using passport
passport.use(new GoogleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_clientSecret,
    callbackURL: env.google_callbackURL,
  },
  //once we get response from google execute this function
  function(accessToken, refreshToken, profile, done) {
      //find the user which google send us in our DB
    User.findOne({ email: profile.emails[0].value }).exec(function (err, user) {

        if(err)
        {
            console.log("Error in google-strategy-passport",err);
            return;
        }
        console.log(profile);
        //if user aready present in our DB then return no error and user as req.user
        if(user)
        {
            return done(null,user);
        }else{
     
             //if user is not  present in our DB then create the user and return no error and user as req.user
            User.create({

                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
            }, function(err,user)
            {
                if(err)
                {
                    console.log("Error in creating the user",err);
                    return;
                }
                else
                {
                    return done(null,user);
                }
            })

        }
    })
    }
));

module.exports=passport;