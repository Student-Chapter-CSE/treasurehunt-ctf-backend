const User = require("../models/user");
const Score = require("../models/scores");
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
            res.status(200).json({
                 msg:"Signup Successful"
            })
        }
        const existingScore = await Score.findOne({ Team_Name });
        if (!existingScore) {
            await Score.create({ Team_Name:Team_Name, Points: 0 }); // Add team with default 0 points
        }

        res.status(200).json({ msg: "Signup Successful & Team Added to Leaderboard!" });

    } catch (err) {
        console.error("Error:", err);
        req.session.error = "An error occurred while creating your account. Please try again.";
        res.redirect("/");
    }
}
async function UpdateScores(req,res){
    try {
        const {Team_Name,Points } = req.body;
        if (!Team_Name || Points === undefined) {
          console.log(Team_Name,Points)
          return res.status(400).json({ error: "Invalid input entered..." });
        }
    
        let team = await Score.findOne({ Team_Name });
        console.log(Team_Name,Points,team)
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
async function getLoginpage(req,res){
    return res.json({msg:"login page"})
}
async function userLogin(req,res){
    const {Team_Name} = req.body;
    try {
        const existingUser = await User.findOne({ Team_Name: Team_Name });

        if (existingUser) {
            res.status(200).json({
                msg:"Login Succesful"
           })
        }
        else{
            return res.status(400).json({
                msg:"User does not exist! Signup first"
            });
        }
    } catch (err) {
        console.error("Error:", err);
        req.session.error = "An error occurred while creating your account. Please try again.";
        res.redirect("/signup");
    }
}
module.exports={
    getSignupPage,
    UpdateScores,
    UserSignup,
    showLeaderboard,
    getLoginpage,
    userLogin
}