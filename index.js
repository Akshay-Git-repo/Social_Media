const express=require("express");
const app=express();
const port=8000;



//use express layouts

 const layouts=require("express-ejs-layouts");

 app.use(layouts);

//use express router

app.use('/', require('./routes'));

//set an an view ejs

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.static("./assets"));


//add static files to layout.ejs

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

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