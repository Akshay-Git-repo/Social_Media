const express=require("express");
const passport=require("passport");
const router=express.Router();

const post_controller=require("../controllers/post_controller");

router.post("/create",passport.checkAuthentication,post_controller.create);

router.get("/destroy/:id",passport.checkAuthentication,post_controller.destroy);

console.log("route is loaded");

module.exports=router;