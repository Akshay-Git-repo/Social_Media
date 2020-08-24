const express=require("express");
const app=express();

const port=8000;
const logger=require("morgan");
const layouts=require("express-ejs-layouts");
const db=require("./config/mongoose");
const cookieParser=require("cookie-parser");
const path=require("path");
const env=require("./config/environment");
//use for session cookie 
const session=require("express-session");
require('./config/view-helpers')(app);
//for authentication
const passport=require("passport");
const passportLocal=require("./config/passport-local-strategy");

const passportJWT=require("./config/passport-jwt-strategy");

const passportGoogle=require("./config/passport-google-oauth2-strategy");
const passportFacebook=require("./config/passport-facebook-strategy");


// module  to store the cookie so that even server restart user dont have to log in again 
const MongoStore=require("connect-mongo")(session);

const sassMiddleware=require("node-sass-middleware");


//for flash messages
const flash=require("connect-flash");
const customMware=require("./config/middleware");

//setting up socket io

const chatServer=require("http").Server(app);
const chatSockets=require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log("chat server is listening on port 5000");


//static file location
app.use(express.static(env.asset_path));
if(env.name=='development')
{
app.use(sassMiddleware({
    src:path.join(__dirname,env.asset_path,'/scss'),
    dest:path.join(__dirname,env.asset_path,'/css'),
    debug:true,
    outputStyle:"extended",
    prefix:"/css"

}));
}
//middleware
app.use(express.urlencoded());
app.use(cookieParser());



//use express layouts



 app.use(layouts);





//add static files to layout.ejs

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



//set an an view ejs

app.set('view engine','ejs');
app.set('views','./views');

//make the upload folder available to browser

app.use('/uploads/',express.static(__dirname+'/uploads'));

app.use(logger(env.morgan.mode,env.morgan.options));
//middleware for session

app.use(session(
    {
    name:'codeial',
    //change the secret before deployment on production 
    secret:env.session_cookie_key,
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
//flash uses session cookies so place it after session cookies set

app.use(flash());
app.use(customMware.setFlash);

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