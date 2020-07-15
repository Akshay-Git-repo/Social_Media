const Post=require("../models/post");

const User=require("../models/user");
module.exports.home=async function(req,res)
{

//this is without Async wait
    // if(req.isAuthenticated())
    // {    
    //     //populate the user of each post

    //     Post.find({})
    //     .populate("user")
    //     .populate({path:'comments',
    //      populate:{path:'user'}})
    //     .exec(function(err,posts)
    //     {
    //         User.find({},function(err,users)
    //         {

    //             return res.render('home',
    //             {
    //                   Posts:posts,
    //                   title:'Codeial | Home Page',
    //                   User:req.user.name,
    //                   all_users:users
 
    //               });

    //         });

            
         
    //     });
    // }

    //with Async Wait
try
{
    if(req.isAuthenticated())
    {    
        //populate the user of each post

        let posts=await Post.find({})
        .populate("user")
        .populate({path:'comments',
         populate:{path:'user'}});
        
        let users =await User.find({});

        return res.render('home',
        {
            Posts:posts,
            title:'Codeial | Home Page',
            User:req.user.name,
            all_users:users
    
        });


    }
    else
        {
            return res.render('user_sign_in',
            {
                title:"Codeial | Sign In"
            })
        }

} catch(err)
{
    console.log("Error",err);
}

}


module.exports.contact=function(req,res)
{
    return res.end("<h1>My Phone number is: 8793397168")
}