const express = require("express");
const router = express.Router(); 
const {jwtAuthMiddleware, generateToken} = require('./../auth');
const {logoutuser}=require("../controller/user")
router.get("/",logoutuser)  
module.exports=router;