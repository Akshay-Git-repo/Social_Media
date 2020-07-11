const Post=require("../models/post");

module.exports.home=function(req,res)
{


    if(req.isAuthenticated())
    {    

        Post.find({user:req.user._id},function(err,posts)
        {
            if(err)
            {
                console.log("Error while finding the Post");
            }
            else
            {
                console.log(req.cookies);
                // res.cookie('user_id','aaa');
                return res.render('home',
                {
                    Posts:posts,
                    title:'Codeial | Home Page',
                    User:req.user.name

                })
            }
        });
    }
else
{
    return res.render('user_sign_in',
    {
        title:"Codeial | Sign In"
    })
}
}


module.exports.contact=function(req,res)
{
    return res.end("<h1>My Phone number is: 8793397168")
}