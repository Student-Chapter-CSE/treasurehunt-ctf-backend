const express = require("express");
const router = express.Router();
const { loginadmin , getAdminPage }=require("../controller/admin");

router.get("/",getAdminPage);
router.post("/", loginadmin);
module.exports=router;