const express = require("express");
const router = express.Router();
const User = require("../models/user");
router.get("/",(req,res)=>{
    res.json({msg:"Signup page"})
})
router.post("/", async (req, res) => {
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
    } catch (err) {
        console.error("Error:", err);
        req.session.error = "An error occurred while creating your account. Please try again.";
        res.redirect("/signup");
    }
});
module.exports=router;