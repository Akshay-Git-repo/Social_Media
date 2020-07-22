const Post= require('../models/post');
const Comment=require('../models/comment');
const User=require('../models/user');
const commentsmailer=require("../mailers/comments_mailer");

module.exports.create= async function(req,res)
{
try{
  let post=await Post.findById(req.body.post);
    if(post){
  let comment= await Comment.create({
           content:req.body.content,
           post:req.body.post,
           user:req.user._id});

 
 

       //here you have added the comment to db but now you hv to add comment id to post so that even single post will have multiple comment ,post will have id 
       //of all the comment for that partcular post

       post.comments.push(comment);
       post.save();

        // Similar for comments to fetch the user's id!
        comment = await comment.populate('user', 'name email').execPopulate();

        //now send the mail 
        commentsmailer.newComment(comment);

       if(req.xhr)
       {
           

           return res.status(200).json({
               data:{
                   comment:comment,
                   
                  
               },
               message:"Comment Created Successfully!",
               
           })
           
       }
      
       req.flash("success","Comment Added Successfully!")
        res.redirect("/");
  }
}
  catch(err)
  {
      //console.log("Error while creating the post",err);
      req.flash("error",err);
      return;
  }
};


//for deleting the comment

module.exports.destroy=async function(req,res)
{
  let comment=await Comment.findById(req.params.id);

   
  if(comment.user==req.user.id)
  {

   //storing post id bcz we want delete the comment id from the post collection where all comments id's are present
    let postid=await comment.post;
    comment.remove();
    let post=await Post.findByIdAndUpdate(postid,{$pull:{comments:req.params.id}})
    
 


    if(req.xhr)
    {

      

        return res.status(200).json({
            data:{
              comment_id: req.params.id
              
            },
            message:"Comment Deleted Successfully!",
            
        })
    }

    req.flash("success","Comment Deleted Successfully!")
    return res.redirect("back");

  }
  
  else{
    req.flash("error","Unauthorized!")
    return res.redirect("back");
  }
};