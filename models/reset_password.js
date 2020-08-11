const mongoose=require("mongoose");

const resetPasswordSchema=new mongoose.Schema
({
  
    
    user:
    {
        type:String,
       
        required:true
    },

    token:
    {
        type:String,
        required:true
    },

    //include the array of id's of commnets in this schema itself
    isValid:
    {
        type:Boolean,
        default:true,
    }, 
},
    {
        timestamps:true
    }

);

const resetPassword=mongoose.model('ResetPasswordSchema',resetPasswordSchema);

module.exports=resetPassword;