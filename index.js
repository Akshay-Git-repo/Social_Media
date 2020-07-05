const express=require("express");
const app=express();
const port=8000;

//set an an view ejs

app.set('view engine','ejs');
app.set('views','./views');


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