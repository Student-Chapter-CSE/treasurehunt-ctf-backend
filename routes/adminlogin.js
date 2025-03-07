const express = require("express");
const router = express.Router();
const { loginadmin , getAdminPage, logoutadmin }=require("../controller/admin");

router.get("/",getAdminPage);
router.post("/login", loginadmin);
router.get('/logout', logoutadmin);
module.exports=router;