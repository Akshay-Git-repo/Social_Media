const express=require("express");

const router=express.Router();

const post_controller=require("../controllers/post_controller");

router.get("/post",post_controller.post);



console.log("route is loaded");

module.exports=router;