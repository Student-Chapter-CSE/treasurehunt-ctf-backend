const express = require("express");
const router = express.Router();
const Score = require("../models/scores");
const {showLeaderboard}=require("../controller/user")
router.get("/",showLeaderboard );
module.exports=router;