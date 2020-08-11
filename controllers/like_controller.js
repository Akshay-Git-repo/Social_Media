const Like=require('../models/like');
const Comment=require('../models/comment');
const Post=require('../models/post');


module.exports.toggleLike=async function(req,res)
{

    try{
            // likes/toggle/?id=abcde&type=post

                let likeable;
                let deleted=false;

                if(req.query.type =='Post')
                {
                    likeable=await Post.findById(req.query.id).populate('likes');
                }
                else
                {
                    likeable=await Comment.findById(req.query.id).populate('likes');
                }


                //now check whether like is already present one user likes only ones

                let existingLike=await Like.findOne({
                    user:req.user._id,
                    likeable:req.query.id,
                    onModel:req.query.type

                })


                //if like already exist ,delete it

                if(existingLike)
                {

                    likeable.likes.pull(existingLike._id);
                    likeable.save();

                    existingLike.remove();
                    deleted=true;

                }

                //else create a like

                else{
                   let newLike= await Like.create({

                       user:req.user._id,
                       likeable:req.query.id,
                       onModel:req.query.type,
                   });

                     likeable.likes.push(newLike._id);
                     likeable.save();


                }


                // if(req.xhr)
                // {
                //     let count= likeable.likes.length;

                    
                //     return res.status(200).json({
                //         data:{
                //             type_id:req.query.id,
                //             count:count
                //         },
                //         message:"Post has been liked!",
                        
                //     })
                // }
        
        
        
                res.json("200",
                {
                    message:"Request Successfull",
                    data:
                    {
                        deleted:deleted,
                    }
                });





    }
    catch(err)
    {
        console.log(err);
        res.json("500",
        {
            message:"Internal server Error",
        });
    }

}