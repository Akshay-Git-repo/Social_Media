const express=require("express");

const router=express.Router();

const homecontroller=require("../controllers/home_controller");

router.get("/",homecontroller.home);


console.log("route is loaded");

module.exports=router;