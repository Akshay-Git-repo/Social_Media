const express=require("express");
const app=express();
const port=8000;
const layouts=require("express-ejs-layouts");
const db=require("./config/mongoose");
const cookieParser=require("cookie-parser");

//use for session cookie 
const session=require("express-session");

//for authentication
const passport=require("passport");
const passportLocal=require("./config/passport-local-strategy");

// module  to store the cookie so that even server restart user dont have to log in again 
const MongoStore=require("connect-mongo")(session);

const sassMiddleware=require("node-sass-middleware");

app.use(sassMiddleware({
    src:'./assets/scss',
    dest:"./assets/css",
    debug:true,
    outputStyle:"extended",
    prefix:"/css"

}));

//middleware

app.use(express.urlencoded());
app.use(cookieParser());



//use express layouts



 app.use(layouts);



//static file location
app.use(express.static("./assets"));


//add static files to layout.ejs

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



//set an an view ejs

app.set('view engine','ejs');
app.set('views','./views');


//middleware for session

app.use(session(
    {
    name:'codeial',
    //change the secret before deployment on production 
    secret:'balhsomething',
    saveUninitialized:false,
    resave:false,
    cookie:
    {
    maxAge:(1000*60*100)

    },
    //to store the cookie in to the mongo so even server restarted your session will be thier and you can able to login without doing the sign up again
    store:new MongoStore({
        mongooseConnection:db,
        autoRemove:'disabled',

    },function(err)
    {
        console.log(err||'connect mongodb setup ok');
    })
}
));


app.use(passport.initialize());
app.use(passport.session());


app.use(passport.setAuthenticatedUser);
//use express router

app.use('/', require('./routes'));


app.listen(port,function(err)
{
    if(err)
    {
        //console.log("Error while connecting to app");
        //we are using interpolation now

        console.log(`Error: ${err}`)
        return;
    }

    console.log(`Express Server is up and running on port ${port}`);
})