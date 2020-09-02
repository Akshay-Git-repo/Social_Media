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

//passport google authentication
router.get("/auth/google/",passport.authenticate('google',{scope:['profile','email']}));
router.get("/auth/google/callback",passport.authenticate(

    'google',
    {failureRedirect:'/users/sign-in'},

),user_controller.createSession);

//passport facebook authentication

//router.get("/auth/facebook/",passport.authenticate('facebook',{scope:['profile','user_likes']}));
router.get("/auth/facebook/",passport.authenticate('facebook'));
router.get("/auth/facebook/callback",passport.authenticate(

    'facebook',
    {failureRedirect:'/users/sign-in'},

),user_controller.createSession);


router.get("/sign-out",user_controller.destroySession);

router.get("/reset_password",user_controller.reset_password);
router.get("/reset_password/:id",user_controller.reset_password_link);
router.post("/reset_password_email",user_controller.reset_password_email);
router.post("/reset_password_validation/:id",user_controller.reset_password_validation);

 router.get("/profile/:id/:from_id",passport.checkAuthentication,user_controller.profile);


router.post("/update/:id",passport.checkAuthentication,user_controller.update);
router.get("/update_hobbies/:id",user_controller.update_hobbies);

router.get("/add-hobby/:id",user_controller.add_hobbies);

router.get("/addfriend/:id/:from_id",user_controller.addfriend);
//removefriend
router.get("/removefriend/:id/:from_id",user_controller.removefriend);
router.get("/friend_request/:id",user_controller.friend_requests);
router.get("/addrequestedfriend/:from_id/:id",user_controller.addrequestedfriend);
router.get("/removerequestedfriend/:from_id/:id",user_controller.removerequestedfriend);

//this is just for practise
router.get("/about",user_controller.about);

console.log("route is loaded");

module.exports=router;