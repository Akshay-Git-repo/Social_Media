const mongoose=require("mongoose");
const multer=require("multer");//multer is use to upload the file to particular path
const path=require("path");
const AVATAR_PATH=path.join("/uploads/users/avatars"); //file should be save /uploads/users/avatars location

const userSchema=new mongoose.Schema
({
    email:
    {
        type:String,
        required:true,
        unique:true
    },
    password:
    {
        type:String,
        required:true
    },
    name:
    {
        type:String,
        required:true
    },
    avatar:
    {
        type:String,

    },

    friendships:[

        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'

        }
    ],

    pendingRequest:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
        }
    ],

    sendRequest:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
        }
    ],

    hobbies:[
        {
            type:String,
        }

    ]



},
{
    timestamps:true
});


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH)); //create the path like /uploads/users/avatars/
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())// Date.now() is called as epoch time
    }
  })



  //create the static function

  userSchema.statics.uploadedAvatar=multer({storage:storage}).single("avatar");//.single means single file  at a time
  userSchema.statics.avatarPath=AVATAR_PATH; //avatar path is publicaly available now


const User=mongoose.model('User',userSchema);

module.exports=User;