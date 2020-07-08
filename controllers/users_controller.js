module.exports.profile=function(req,res)
{
    return res.render('user',
    {
        title:"User Page"
    })
}

module.exports.about=function(req,res)
{
    return res.end("<h1>HI ,my name is Akshay Kharade")
}