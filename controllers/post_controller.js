const Post=require("../models/post");
const Comment=require("../models/comment");
const User=require("../models/user");
module.exports.create=async function(req,res)
{
    console.log("inside the post controller");

    try{
    let post=await Post.create(                                                                                                            
        {
            
        content:req.body.content,   
        user:req.user._id,
        });
let user_name=await User.findById(post.user);

        if(req.xhr)
        {
            post = await post.populate('user', 'name').execPopulate();
            return res.status(200).json({
                data:{
                    post:post,
                    user_info:user_name.name,
                },
                message:"Post Created Successfully!",
                
            })
            
        }

        req.flash("success","Post Created Successfully!");
        return res.redirect("back");
    }
    catch(err)
    {
        //console.log("Error while creating the post",err);
        req.flash("error",err);
        return;
    }


};

//controller for the destroying the post
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

        if(req.xhr)
        {


            return res.status(200).json({
                data:{
                    post_id:req.params.id,
                  
                },
                message:"Post Deleted Successfully!",
                
            })
        }



        req.flash("success","Post And Associated Comments Deleted Successfully!")
        return res.redirect("back");
    
    }   
}
catch(err)
{
    //console.log("Error while deleting the post",err);
    req.flash("error",err);
        return;

}
     


}




