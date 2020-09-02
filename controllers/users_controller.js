const User=require("../models/user");
const Post=require("../models/post");
const Friendships=require("../models/friendship");
const fs=require("fs");
const path=require('path');
const crypto=require('crypto');
const ResetPassword=require('../models/reset_password'); 
const resetPasswordMailer=require('../mailers/reset_password_mailer');


module.exports.profile=async function(req,res)
{
   
    let status= false;
    

    
    let user=await User.findById(req.params.id);
    let user_friend_or_not=await Friendships.find({$or:[{to_user:req.params.id,from_user:req.params.from_id},{from_user:req.params.id,to_user:req.params.from_id}]});
    //let user_friend_or_not=await User.findById({_id:req.params.from_id}).populate({path:'friendships',match:{friendships:req.params.id}});
    let friends=await Friendships.find({from_user:req.params.from_id});
    let pending_user=await User.findById(req.params.from_id).populate('sendRequest');
    let send_user=await User.findById(req.params.from_id).populate('pendingRequest');
    console.log(pending_user)
    let pending=false;
    for(u of pending_user.sendRequest){
        if(u._id==req.params.id){
            pending=true;
        }
    }
let already_requested=false;
for(u of send_user.pendingRequest){
    if(u._id==req.params.id){
        already_requested=true;
    }
}

    let posts=await Post.find({})
        .sort("-createdAt")
        .populate("user")
        .populate({path:'comments',
         populate:{path:'user'},
        populate:{
            path:'likes'
        }
        }).populate('likes');

  if(user_friend_or_not!="")
  {
      status=true;
  }

  console.log(status);

        return res.render('user',
        {
            title:"User Page",
            profile_user:user,
            friends:friends,
            status:status,
            Posts:posts,
            pending_user:pending_user,
            pending:pending,
            already_requested:already_requested

        });
   
   
}

module.exports.signUp=function(req,res)
{

    

    return res.render('user_sign_up',
    {
        title:"Codeial | Sign Up"
    })
}


module.exports.signIn=function(req,res)
{

    
    return res.render('user_sign_in',
    {
        title:"Codeial | Sign In"
    })
}

//get the sign up data

module.exports.create=function(req,res)
{

    if(req.body.password!=req.body.confirm_password)
    {
        return res.redirect("back");
    }
    //check the email(as email should be unique) data came in req is present in the mongodb
    User.findOne({email:req.body.email},function(err,user)
    {
        if(err)
        {
            console.log("Error n finding user in signing up");
            return;
        }
        //if req data is not present in the mongodb create the entry in the mongodb
        if(!user)
        {
            User.create(req.body,function(err,user)
            {
                if(err)
                {
                    console.log("Error in creating the User");
                    return;
                }

                return res.redirect("/users/sign-in");
            });
        }

        //if req data is  present in the mongodb go back to the sign up page
    else{
        return res.redirect("back");
        }

    });



}

//get the sign in data and  create the session for user
module.exports.createSession=function(req,res)
{
   
   req.flash("success","Logged in successfully"); 
return res.redirect("/");



}

//logout
module.exports.destroySession=function(req,res)
{

    
  req.logout();
  req.flash("success","You are Logged Out!"); 
  return res.redirect("/");
}


//to update the logged in user info

module.exports.update=async function(req,res)
{
    // if(req.user.id==req.params.id)
    // {
    //     User.findByIdAndUpdate(req.params.id,req.body,function(err,user)
    //     {
    //         return res.redirect("back");
    //     });
    // }
    // else
    // {
    //     return res.status(401).send("Unauthorized");
    // }

    //above code is commented bcz we are converting the code to async await

    if(req.user.id==req.params.id){
        try{
               let user=await User.findById(req.params.id);
        //reason why we are npt using req.body bcz our req is multipart now ,and multipart will not have body property so here multer comes into picture 
        //as it having req and res i.e., uploadedAvatar(req,res,function(err)
               User.uploadedAvatar(req,res,function(err)
               {
                   if(err){console.log("*********Multer Error")};
                       console.log(req.file);
                   user.name=req.body.name;
                   user.email=req.body.email;


                   if(req.file) //not every time user is uploading the file so this will execute nly if req is having file
                   {

                       if(user.avatar && fs.existsSync(path.join(__dirname,'..', user.avatar)) )//first check whether user.avatar means in db whether path is present
                       //and second check is whether file is present at that path if both condition mathc then nly delete the file from /upload/users/avatars
                       {
                        fs.unlinkSync(path.join(__dirname,'..', user.avatar));
                       
                       }
                       user.avatar=User.avatarPath+'/'+req.file.filename;
                    
                   }
                   user.save();
                   return res.redirect("back");
               })

        }catch(err){
              
            req.flash("error",err);
            return;

        }


    }

    else
    {
        return res.status(401).send("Unauthorized");
    }
}


module.exports.reset_password=function(req,res)
{
       return res.render('user_email_for_reset_pass',
    {
        title:"Codeial | Reset Password"
    })
}


//action for update the users hobbies

module.exports.update_hobbies=async function(req,res)
{
    let user=await User.findById(req.params.id);
    return res.render('hobbies',
    {
        title:"Codeial | Hobbies",
        hobbies:user.hobbies
    })

}


module.exports.add_hobbies= async function(req,res)
{
   

console.log("inside the add hobbies")
   let user=await User.findById(req.params.id);
  

   for (let hobby of Object.values(req.query)) {
    
    user.hobbies.push(hobby);
        }



  user.save();
   res.redirect("back");

}



//sending the reset password mail to user

module.exports.reset_password_email= async function(req,res)
{
 try{
   let user=await User.findOne({email:req.body.email});
        //if req data is not present in the mongodb create the entry in the mongodb
        if(!user)
        {
            req.flash("error","No User Found");
            return res.redirect('back');
            
        }

        //if req data is  present in the mongodb go back to the sign up page
            if(user)
            {
                let resetpass_data=await ResetPassword.create({

                    user:user.email,
                    token:crypto.randomBytes(20).toString('hex'),
                    isValid:true,
                });
                
                
                      let  resetPassword_data = await ResetPassword.findOne({user:req.body.email,isValid:true});
                        
                        req.flash("success",`User Found ,Email Sent to ${req.body.email}`);
                        
                        resetPasswordMailer.resetpassword(resetPassword_data);
                        return res.redirect('back');
                    
                
            }

        }
         catch(err)
         {
             req.flash('error',err);
             return res.redirect('back');
         }




}

module.exports.reset_password_link=async function(req,res)
{
    try{
        console.log(req.params.id);
       
    let  resetPassword_token = await ResetPassword.findOne({token:req.params.id});
    if(resetPassword_token)
    {
        console.log("inside reset the pass");
        if(resetPassword_token.isValid==true)
        return res.render('user_form_for_reset_pass',
        {
            title:"Codeial | Reset Password Form",
            resetPassword_token:resetPassword_token
            
        })
        else{
            req.flash("error","Token Expired");
            return res.redirect("back");
        }  
    }
  }
catch{
    req.flash("error","Token is incorrect");
}
}

module.exports.reset_password_validation=async function(req,res)
{
    if(req.body.password ==req.body.confirm_password)
    {
            
            
           
            let user=await User.findOne({email:req.params.id});

               if(user)
               {
                   user.password=req.body.password;
                   user.save();
               }
                   let resetpass=await ResetPassword.findOne({user:req.params.id,isValid:true});
                    if(resetpass)
                    {
                        resetpass.isValid=false;
                        resetpass.save();

                    }   
                 
                    req.flash("success","Password Updated Successfully") ;
                    return res.redirect("/");
               }


        
           
    
    else{
        req.flash("error","Password and Confirm Password is not Matching");
        res.redirect('back');
    }
}


//add friend to user list

module.exports.addfriend= async function(req,res)
{
    try{
        
        
        
        let to_user=await User.findById(req.params.id);
        let from_user1=await User.findById(req.params.from_id);
       
         from_user1.sendRequest.push(req.params.id);
         to_user.pendingRequest.push(req.params.from_id);
         from_user1.save();
         to_user.save();
       

       
        
         req.flash("success","Request sent");
    return res.redirect("back");

     
    }
    catch(err)
    {
        req.flash("error","Error in adding the Friend to the friend list");
    }
}

module.exports.removefriend=async function(req,res)
{

try{
//find the id of the friendship from friendship collection
   let id= await Friendships.find({$or:[{to_user:req.params.id,from_user:req.params.from_id},{from_user:req.params.id,to_user:req.params.from_id}]});
   await Friendships.deleteOne({$or:[{to_user:req.params.id,from_user:req.params.from_id},{from_user:req.params.id,to_user:req.params.from_id}]});


//delete the id from friendship array from bothe the user as they both are not friend with each other
await User.findByIdAndUpdate(req.params.from_id,{$pull:{friendships:id[0]._id}});
await User.findByIdAndUpdate(req.params.id,{$pull:{friendships:id[0]._id}});
   
  
    return res.redirect("back");
}
catch(err)
{

console.log("Not able to delete the friend from friendlist ",err)

    }

}

//to find out the pending requests

module.exports.friend_requests= async function(req,res)
{
    try{
        console.log("inside request",req.params.id)
        let pending_request=await User.findById(req.params.id).populate('pendingRequest');
        
       
        console.log(pending_request);
      
        
    return res.render('requests',
    {
        title:"Codeial | Friend Requests",
        pending_request:pending_request
    })

     
    }
    catch(err)
    {
        req.flash("error","Error in adding the Friend to the friend list");
    }
}

//add the requested friend 

module.exports.addrequestedfriend= async function(req,res)
{
    try{

        let to_user=await User.findById(req.params.id);
        let from_user1=await User.findById(req.params.from_id);
        
        let friends=await Friendships.create({
          
            from_user:req.params.from_id,
            to_user:req.params.id,
            
            });
            from_user1.friendships.push(friends);
            to_user.friendships.push(friends);
            from_user1.sendRequest.pull(req.params.id);
            to_user.pendingRequest.pull(req.params.from_id);
            from_user1.save();
            to_user.save();
            

        return res.redirect("back");
     
    }
    catch(err)
    {
        req.flash("error","Error in adding the Friend to the friend list");
    }
}


//remove the requested friend 

module.exports.removerequestedfriend= async function(req,res)
{
    try{

        let to_user=await User.findById(req.params.id);
        let from_user1=await User.findById(req.params.from_id);
        
       
            
            from_user1.sendRequest.pull(req.params.id);
            to_user.pendingRequest.pull(req.params.from_id);
            from_user1.save();
            to_user.save();
            

        return res.redirect("back");
     
    }
    catch(err)
    {
        req.flash("error","Error in adding the Friend to the friend list");
    }
}



//JUST FOR PRACTICE 
module.exports.about=function(req,res)
{
    return res.end("<h1>HI ,my name is Akshay Kharade")
}