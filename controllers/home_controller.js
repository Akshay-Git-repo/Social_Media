module.exports.home=function(req,res)
{
    return res.end("<h1>Hi home controller is up and running");
}


module.exports.contact=function(req,res)
{
    return res.end("<h1>My Phone number is: 8793397168")
}