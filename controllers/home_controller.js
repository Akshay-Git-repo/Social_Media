module.exports.home=function(req,res)
{
    return res.render('home',
    {
        title:'Home Page'
    });
}


module.exports.contact=function(req,res)
{
    return res.end("<h1>My Phone number is: 8793397168")
}