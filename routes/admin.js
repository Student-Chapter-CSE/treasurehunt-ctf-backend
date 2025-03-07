const express = require('express');
const router = express.Router();
const Ban = require('../models/Ban');
const usermodel = require('../models/user');
const scoresmodel = require('../models/scores');
const { getUser , getAdminPage, banUser, unbanUser}=require("../controller/admin");
router.get('/',getAdminPage);
router.get('/getuser',getUser)
router.post("/ban",banUser);
router.delete("/unban", unbanUser);
module.exports = router;
