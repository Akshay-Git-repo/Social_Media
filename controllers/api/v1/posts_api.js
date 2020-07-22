const Post=require('../../../models/post');
const Comment=require('../../../models/comment');

module.exports.index=async function(req,res)
{

    let posts=await Post.find({})
    .sort("-createdAt")
    .populate("user",'-password')//.populate("user",'-password') this will send all users data except password field
    .populate({path:'comments',
     populate:{path:'user'}});


    return res.json(200,{
        message:"List Of Posts in version 1",
        posts:posts,

    });
}





module.exports.destroy=async function(req,res)
{
 //first we need to check whether the post is present or not in db and if present then nly delete the post
try{
 let post =await Post.findById(req.params.id);
//.id means converting objects into string automatically
    
if(post.user==req.user.id)
{
       
        post.remove();
        await Comment.deleteMany({post:req.params.id});

        return res.json(200,
            {
                message:"Post and Associated Comments Deleted !",
            });
}
else
{
    return res.json(401,
        {
            message:"You Cannot Delete this post!!!!",
        });
}

  
}
catch(err)
{
   return res.json(500,
    {
        message:"Internal Server Error",
    })

}
     


}
