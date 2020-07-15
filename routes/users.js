const express=require("express");

const router=express.Router();

const user_controller=require("../controllers/users_controller");
const passport=require("passport");

//Route to signIn function in user_controller
router.get("/sign-in",user_controller.signIn);

//Route to signUp function in user_controller
router.get("/sign-up",user_controller.signUp);

router.post("/create",user_controller.create);


//use passport as middleware to autheticate the user
router.post("/createsession",passport.authenticate(

    'local',
    {failureRedirect:'/users/sign-in'},

),user_controller.createSession);


router.get("/sign-out",user_controller.destroySession);


//this is just for practise
router.get("/profile/:id",passport.checkAuthentication,user_controller.profile);

router.post("/update/:id",passport.checkAuthentication,user_controller.update);



router.get("/about",user_controller.about);

console.log("route is loaded");

module.exports=router;