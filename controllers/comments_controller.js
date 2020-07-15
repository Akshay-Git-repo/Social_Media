const Post= require('../models/post');
const Comment=require('../models/comment');


module.exports.create= function(req,res)
{
  Post.findById(req.body.post, function(err,post)
  {

    if(post)
    {
        Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id


        },function(err,comment)
        {
            //handle the error
            if(err)
            {
                console.log("Error while Adding the comment");
            }

            //here you have added the comment to db but now you hv to add comment id to post so that even single post will have multiple comment ,post will have id 
            //of all the comment for that partcular post

            post.comments.push(comment);
            post.save();

             res.redirect("/");

        })
    }
  })


}


//for deleting the comment

module.exports.destroy=function(req,res)
{
   Comment.findById(req.params.id,function(err,comment)
   {

    if(err)
    {
      console.log("Error while deleting comment");
    }
    
     if(comment.user==req.user.id)
     {

      //storing post id bcz we want delete the comment id from the post collection where all comments id's are present
       let postid=comment.post;
       comment.remove();
       Post.findByIdAndUpdate(postid,{$pull:{comments:req.params.id}},function(err,post)
       {
          return res.redirect("back");
       })
     }
     else{
       return res.redirect("back");
     }
   });
};