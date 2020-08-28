const Post=require("../models/post");
const Comment=require("../models/comment");
const User=require("../models/user");
const Like=require("../models/like");
const fs=require("fs");
const path=require('path');
module.exports.create=async function(req,res)
{
    console.log("inside the post controller");

    try{
    

        Post.uploadedAvatar(req,res,function(err)
        {
            if(err){console.log("*********Multer Error")};
                
           
                if(!req.file)
                {
               Post.create(                                                                                                            
                    {     
                    content:req.body.content,   
                    user:req.user._id,
                    });
                }

            if(req.file) //not every time user is uploading the file so this will execute nly if req is having file
            {
                
               
                Post.create(                                                                                                            
                    {
                    content:req.body.content,   
                    user:req.user._id,
                    avatar:Post.postavatarPath+'/'+req.file.filename
                    });
                
             
            }
           
            return res.redirect("back");
        })

        


//let user_name=await User.findById(post.user);
//console.log("user name is ",user_name)
        if(req.xhr) 
        {
            console.log("insid the xhr request");
            post = await post.populate('user', 'name').execPopulate();
            console.log("post data is",post)
            return res.status(200).json({
                data:{
                    post:post,
                    
                },
                message:"Post Created Successfully!",
                
            });
            
        }

       // req.flash("success","Post Created Successfully!");
        //return res.redirect("back");
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
        // CHANGE :: delete the associated likes for the post and all its comments' likes too
        await Like.deleteMany({likeable: post, onModel: 'Post'});
        await Like.deleteMany({_id: {$in: post.comments}});
        if(post.avatar){
        await fs.unlinkSync(path.join(__dirname,'..', post.avatar));
        }
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




