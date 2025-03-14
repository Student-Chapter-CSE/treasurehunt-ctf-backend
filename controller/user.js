const User = require("../models/user");
const Score = require("../models/scores");
const {jwtAuthMiddleware, generateToken} = require('./../auth');
async function getSignupPage(req,res){
    res.json({msg:"Signup page"})
}
async function UserSignup(req,res){
    const {Team_Name, Team_Leader_Name, Team_Leader_Mail,Team_Leader_Dept,Team_Leader_RollNo,Team_Leader_Year } = req.body;

    try {
        const existingUser = await User.findOne({ Team_Leader_Mail: Team_Leader_Mail });

        if (existingUser) {
            return res.status(409).json({
                msg:"User already exists! Try logging in..."
            });
        }
        else{
            await User.create({ Team_Name:Team_Name, Team_Leader_Name:Team_Leader_Name, Team_Leader_Mail:Team_Leader_Mail,Team_Leader_Dept:Team_Leader_Dept,Team_Leader_RollNo:Team_Leader_RollNo,Team_Leader_Year:Team_Leader_Year });
        }
        const existingScore = await Score.findOne({ Team_Name });
        if (!existingScore) {
            await Score.create({ Team_Name:Team_Name, Points: 0 }); // Add team with default 0 points
        }
        const payload = {
            Team_Name: Team_Name,
            Team_lead_email:Team_Leader_Mail
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is : ", token);
        res.cookie("auth_token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production'? true : false, sameSite: "Strict" });
        res.status(200).json({ msg: "Signup Successful & Team Added to Leaderboard!", token: token });


    } catch (err) {
        console.error("Error:", err);
        res.status(400).json({ msg: "An error occurred while creating your account. Please try again."});
        res.redirect("/");
    }
}
async function getLoginpage(req,res){
    return res.json({msg:"login page"})
}
async function userLogin(req,res){
    const {Team_Name} = req.body;
    try {
        const existingUser = await User.findOne({ Team_Name: Team_Name });

        if (existingUser) {
            /*console.log(existingUser.Team_Name,existingUser.Team_Leader_Mail)*/
            const payload = {
                Team_Name:existingUser.Team_Name,
                Team_lead_email:existingUser.Team_Leader_Mail
            }
            const token = generateToken(payload);
            res.cookie("auth_token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production'? true : false, sameSite: "Strict" });
            // resturn token as response
            return res.status(200).json({ msg: "Login Successful",Team_name:Team_Name,Token: token });

        }
        else{
            return res.status(400).json({
                msg:"User does not exist! Signup first"
            });
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(400).json ({ msg: "An error occurred while creating your account. Please try again."});
        res.redirect("/signup");
    }
}
async function UpdateScores(req,res){
    try {
        const userData = req.user;
        const Team_Name = userData.Team_Name;
        const {Points} = req.body;
        if (!Team_Name || Points === undefined) {
          return res.status(400).json({ error: "Invalid input entered..." });
        }
    
        let team = await Score.findOne({ Team_Name });
        if (team) {
          team.Points = Points;
          team.Last_Updated = Date.now();
          await team.save();
        } else {
          return res.status(400).json({ error: "Team not found" });
        }
    
        /*await updateLeaderboard();*/
        res.json({ message: "Score updated successfully!"})
      } catch (error) {
        res.status(500).json({ error: " Internal Server Error" });
      }
}
async function showLeaderboard(req,res){
    try {
        const leaderboard = await Score.find().sort({ Points: -1, Last_Updated: 1 });
        res.json(leaderboard);
      } catch (error) {
        res.status(500).json({ error: " Internal Server Error" });
      }
}
async function logoutuser(req,res){
    res.clearCookie("auth_token");
    res.json({ message: "Logged out successfully" });
}
module.exports={
    getSignupPage,
    UpdateScores,
    UserSignup,
    showLeaderboard,
    getLoginpage,
    userLogin,
    logoutuser,
}