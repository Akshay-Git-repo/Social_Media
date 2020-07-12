const express=require("express");

const router=express.Router();

const homecontroller=require("../controllers/home_controller");

router.get("/",homecontroller.home);

router.get("/contact",homecontroller.contact);

router.use("/users",require("./users"));

router.use("/post",require("./post"));

router.use("/comments",require("./comments"));

console.log("route is loaded");

module.exports=router;