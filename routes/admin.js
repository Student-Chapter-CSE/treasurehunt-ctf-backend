const express = require('express');
const router = express.Router();
const Ban = require('../models/Ban');
const usermodel = require('../models/user');
const scoresmodel = require('../models/scores');
const { getUser , getAdminPage, banUser, unbanUser}=require("../controller/admin");
const { isAdmin }= require('../middleware/isAdmin');
router.get('/',isAdmin ,getAdminPage);
router.get('/getuser', isAdmin, getUser)
router.post("/ban",isAdmin ,banUser);
router.delete("/unban", isAdmin, unbanUser);
module.exports = router;
