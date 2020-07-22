const passport=require("passport");
const FacebookStrategy = require('passport-facebook');
const crypto=require("crypto");
const User=require("../models/user")

//use of google startegy using passport
passport.use(new FacebookStrategy({
    clientID: '307337027063550',
    clientSecret: '825e85aee8ef2c37a290e5a187b128e9',
    callbackURL: "http://localhost:8000/users/auth/facebook/callback"
  },
  //once we get response from google execute this function
  function(accessToken, refreshToken, profile, done) {
      //find the user which google send us in our DB
      console.log(profile);
    User.findOne({ email: profile.id+'@gmail.com' }).exec(function (err, user) {

        if(err)
        {
            console.log("Error in facebook-strategy-passport",err);
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
                email:profile.id+'@gmail.com',
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