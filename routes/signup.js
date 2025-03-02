const express = require("express");
const router = express.Router();
const {getSignupPage,
    UpdateScores,
    UserSignup,
    showLeaderboard}=require("../controller/user")

router.get("/",getSignupPage)
router.post("/",UserSignup);
router.patch("/update-score",UpdateScores);
router.get("/leaderboard",showLeaderboard );
  
module.exports=router;