const Post=require("../models/post");
const Comment=require("../models/comment");
module.exports.create=async function(req,res)
{

    try{
    await Post.create(                                                                                                            
        {

        content:req.body.content,   
        user:req.user._id,
        });

        req.flash("success","Post Created Successfully!")
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




