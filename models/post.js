const mongoose=require("mongoose");
const multer=require("multer");//multer is use to upload the file to particular path
const path=require("path");
const POST_AVATAR_PATH=path.join("/uploads/users/posts"); //file should be save /uploads/users/posts location

const postSchema=new mongoose.Schema
({
  
    content:
    {
        type:String,
        required:true
    },
    user:
    {
        type:mongoose.Schema.Types.ObjectId,
       
        ref:"User"
    },

    avatar:
    {
        type:String,

    },
    //include the array of id's of commnets in this schema itself

    comments:[
    {
        type:mongoose.Schema.Types.ObjectId,
       
        ref:"Comment"
    }],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
           
            ref:"Like"
        }]
 },  
    {
        timestamps:true
    }

);



let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',POST_AVATAR_PATH)); //create the path like /uploads/users/posts/
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())// Date.now() is called as epoch time
    }
  })

 
  
  //create the static function

  postSchema.statics.uploadedAvatar=multer({storage:storage}).single("avatar");//.single means single file  at a time
  postSchema.statics.postavatarPath=POST_AVATAR_PATH; //avatar path is publicaly available now


const Post=mongoose.model('Post',postSchema);

module.exports=Post;