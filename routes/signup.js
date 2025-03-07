const express = require("express");
const router = express.Router();
const Score = require("../models/scores"); 
const {jwtAuthMiddleware, generateToken} = require('./../auth');
const {getSignupPage,
    UpdateScores,
    UserSignup,
    showLeaderboard,
    logoutuser}=require("../controller/user")

router.get("/",getSignupPage)
router.post("/",UserSignup);
router.patch("/update-score",jwtAuthMiddleware,UpdateScores);
router.get("/leaderboard",showLeaderboard );
router.get("/logout",logoutuser)  
module.exports=router;