const express = require("express");
const router = express.Router();
const Score = require("../models/scores"); 
const {jwtAuthMiddleware} = require('./../auth');
const {getSignupPage,
    UpdateScores,
    UserSignup}=require("../controller/user")

router.get("/",getSignupPage)
router.post("/",UserSignup);
router.patch("/update-score",jwtAuthMiddleware,UpdateScores);
module.exports=router;