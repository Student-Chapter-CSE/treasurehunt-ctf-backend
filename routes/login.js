const express = require("express");
const router = express.Router();
const User = require("../models/user");
router.get("/",(req,res)=>{
    res.json({msg:"login page"})
})
router.post("/", async (req, res) => {
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
});
module.exports=router;