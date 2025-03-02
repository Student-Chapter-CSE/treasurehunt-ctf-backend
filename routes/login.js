const express = require("express");
const router = express.Router();
const {getLoginpage,
    userLogin}=require("../controller/user")
router.get("/",getLoginpage);
router.post("/",userLogin);
module.exports=router;