const express=require("express");

const router=express.Router();

const user_controller=require("../controllers/users_controller");

router.get("/profile",user_controller.profile);

router.get("/about",user_controller.about);

console.log("route is loaded");

module.exports=router;