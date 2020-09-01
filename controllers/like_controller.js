const Like=require('../models/like');
const Comment=require('../models/comment');
const Post=require('../models/post');


module.exports.toggleLike=async function(req,res)
{

    try{
            // likes/toggle/?id=abcde&type=post

                let likeable;
                let deleted=false;
                let model_diff=false;
                let model_type;
                let lowercase_model_type;
                if(req.query.type =='Post-Like'||req.query.type =='Post-Wow'||req.query.type =='Post-Love')
                {
                    likeable=await Post.findById(req.query.id).populate('likes').populate('love').populate('wow');
                }
                else                 {
                    likeable=await Comment.findById(req.query.id).populate('likes');
                }

                console.log("likeable is",likeable)

                let existingLike;   
                //now check whether like is already present one user likes only ones
                if(req.query.type=='Post-Like' ||req.query.type=='Post-Wow'||req.query.type=='Post-Love'){
                 existingLike=await Like.findOne({
                    user:req.user._id,
                    likeable:req.query.id,
                    onModel:/Post/

                })}
                else{
                     existingLike=await Like.findOne({
                        user:req.user._id,
                        likeable:req.query.id,
                        onModel:req.query.type
    
                    })

                }

console.log("Existing like is",existingLike)
                //if like already exist ,delete it

                if(existingLike)
                {
                    let model=existingLike.onModel;
                    if(model!='Comment'){
                     model_type=(/(?<=([^-]*-){1}).*/.exec(model)[0]);
                   
                     lowercase_model_type=model_type.toLowerCase();
                    }
                    if(lowercase_model_type=='like')
                    {
                        lowercase_model_type='likes';
                        likeable.likes.pull(existingLike._id);
                    }
                    if(lowercase_model_type=='love')
                    {
                        likeable.love.pull(existingLike._id);
                    }
                    if(lowercase_model_type=='wow')
                    {
                        likeable.wow.pull(existingLike._id);
                    }
                    
                   
                    existingLike.remove();
                    existingLike.save();
                    deleted=true;
            
                   
                  
                  
                  
                    if(model!=req.query.type)
            {
                                 
                            model_diff=true;   
                            if(req.query.type =='Post-Like')
                            {
                                console.log("inside like create");
                        let newLike= await Like.create({

                            user:req.user._id,
                            likeable:req.query.id,
                            onModel:req.query.type,
                        });

                            likeable.likes.push(newLike._id);
                            likeable.save();
                        }
                                    else if(req.query.type =='Post-Love')
                                        {
                                            console.log("inside love create");
                                    let newLike= await Like.create({

                                        user:req.user._id,
                                        likeable:req.query.id,
                                        onModel:req.query.type,
                                    });

                                        likeable.love.push(newLike._id);
                                        likeable.save();
                                    }

                                    else if(req.query.type =='Post-Wow')
                                        {
                                            console.log("inside wow create");
                                    let newLike= await Like.create({

                                        user:req.user._id,
                                        likeable:req.query.id,
                                        onModel:req.query.type,
                                    });

                                        likeable.wow.push(newLike._id);
                                        likeable.save();
                                    }


                                    else if(req.query.type =='Comment')
                                    {
                                        console.log("printing type",req.query.type)
                                        console.log("inside comment create");
                                let newLike= await Like.create({

                                    user:req.user._id,
                                    likeable:req.query.id,
                                    onModel:req.query.type,
                                });

                                    likeable.likes.push(newLike._id);
                                    likeable.save();
                                }

                            

                                }
                                else
                                {
                                    
                                    likeable.save();
                                }
                                console.log("model diff is ",model_diff)
                                
                }

                //else create a like

                else{
                    if(req.query.type =='Post-Like')
                    {
                        console.log("inside like create");
                   let newLike= await Like.create({

                       user:req.user._id,
                       likeable:req.query.id,
                       onModel:req.query.type,
                   });

                     likeable.likes.push(newLike._id);
                     likeable.save();
                }
               else if(req.query.type =='Post-Love')
                {
                    console.log("inside love create");
               let newLike= await Like.create({

                   user:req.user._id,
                   likeable:req.query.id,
                   onModel:req.query.type,
               });

                 likeable.love.push(newLike._id);
                 likeable.save();
            }

            else if(req.query.type =='Post-Wow')
                {
                    console.log("inside wow create");
               let newLike= await Like.create({

                   user:req.user._id,
                   likeable:req.query.id,
                   onModel:req.query.type,
               });

                 likeable.wow.push(newLike._id);
                 likeable.save();
            }


            else if(req.query.type =='Comment')
            {
                console.log("printing type",req.query.type)
                console.log("inside comment create");
           let newLike= await Like.create({

               user:req.user._id,
               likeable:req.query.id,
               onModel:req.query.type,
           });

             likeable.likes.push(newLike._id);
             likeable.save();
        }

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
        
        
        if(existingLike!=null && req.query.type!='Comment'){
                res.json("200",
                {
                    message:"Request Successfull",
                    data:
                    {
                        deleted:deleted,
                        model_diff:model_diff,
                        model:(/(?<=([^-]*-){1}).*/.exec(existingLike.onModel.toLowerCase())[0]),
                        post_id:req.query.id,
                    }
                });

            }
            else if(existingLike==null && req.query.type!='Comment'){
               
                res.json("200",
                {
                    message:"Request Successfull",
                    data:
                    {
                        deleted:deleted,
                        model_diff:model_diff,
                        post_id:req.query.id,
                    }
                });

            }

            else{
                res.json("200",
                {
                    message:"Request Successfull",
                    data:
                    {
                        deleted:deleted,
                        model_diff:model_diff,
                        post_id:req.query.id,
                    }
                });
            }

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