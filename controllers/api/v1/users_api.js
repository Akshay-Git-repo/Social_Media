const User=require("../../../models/user");
const jwt=require('jsonwebtoken');
const env=require("../../../config/environment");

//after api hits the createsession it will have the requested data i.e email and password and here we are create the json web token
module.exports.createSession=async function(req,res)
{
    try{
            let user=await User.findOne({email:req.body.email});
            if(!user || user.password!=req.body.password)
            {
                return res.json(422,
                    {
                        message:"Invalid Username|Password",
                    });
            }

            return res.json(200,
                {
                    message:"Sign in successfull, here is your Token ,pease keep it safe",
                    data:
                    {
                       
                        token:jwt.sign(user.toJSON(),env.jwt_secret_or_key,{expiresIn:'100000'}) //create the token ,token contains header,payload(it having all information) and signature
                        //here codeial key is use to encrypt the data
                    }
                });

    }
    catch(err)
    {
        return res.json(500,
            {
                message:"Internal Server Error",
            });
    }
}