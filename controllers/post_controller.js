const Post=require("../models/post");
const Comment=require("../models/comment");
module.exports.create=function(req,res)
{
    Post.create(                                                                                                            
        {

        content:req.body.content,   
        user:req.user._id,
        },function(err,post)
        {   
            if(err)
            {
                console.log("Error While Creating the Post ");
                return;
            }
            else
            {
                
                return res.redirect("back");
            }
           
        });
    };

//controller for the destroying the post
module.exports.destroy=function(req,res)
{
 //first we need to check whether the post is present or not in db and if present then nly delete the post

 Post.findById(req.params.id,function(err,post)
 {
     if(err)
     {
         console.log("Error while deleting the post");
         return ;
        
     }
//.id means converting objects into string automatically
     if(post.user==req.user.id)
     {
       
        post.remove();
        Comment.deleteMany({post:req.params.id},function(err)
        {
            return res.redirect("back");
        });
        }

     else{
        return res.redirect("back");
     }
 })

}

