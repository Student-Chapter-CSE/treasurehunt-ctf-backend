const express = require("express");
const router = express.Router();
const { isBanned } = require('../middleware/isBanned');
const {getLoginpage,
    userLogin}=require("../controller/user")
router.get("/",getLoginpage);
router.post("/",isBanned, userLogin);
module.exports=router;