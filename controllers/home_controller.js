const Post=require("../models/post");
const Friendships=require("../models/friendship");
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
        console.log("inside the home controller");
        let posts=await Post.find({})
        .sort("-createdAt")
        .populate("user")
        .populate({path:'comments',
         populate:{path:'user'},
        populate:{
            path:'likes'
        }
        }).populate('likes');
        
        let users =await User.find({});
        
        let friendships=await User.findById(req.user._id).populate('friendships');
        let friends=await Friendships.find({from_user:req.user._id}).populate("to_user");
        let friends_requested=await Friendships.find({to_user:req.user._id}).populate("from_user");
      // let friends=await Friendships.find({$or:[{from_user:req.user._id},{to_user:req.user._id}]}).populate("to_user").populate("from_user");


    //    console.log(friends);
      
        return res.render('home',
        {
            Posts:posts,
            title:'Codeial | Home Page',
            User:req.user.name,
            all_users:users,
            friends:friends,
            friends_requested:friends_requested,
            friendships:friendships
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