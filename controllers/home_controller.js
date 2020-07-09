module.exports.home=function(req,res)
{

    console.log(req.cookies);
    res.cookie('user_id','aaa');
    return res.render('home',
    {
        title:'Home Page'
    });
}


module.exports.contact=function(req,res)
{
    return res.end("<h1>My Phone number is: 8793397168")
}