const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Ban = require('../models/Ban');
const usermodel = require('../models/user');
const scoresmodel = require('../models/scores');
async function getAdminPage(req,res){
    return res.json({msg:"Admin page"})
}

const loginadmin = async(req, res)=>{
    try{
        const { Id , Password}= req.body;
        const admin = process.env.ADMIN_ID;
        if(Id === admin){
            const match = await  bcrypt.compare(Password, process.env.ADMIN_PASSWORD_HASH);
            //const match=(Password.trim()==process.env.ADMIN_PASSWORD_HASH.trim())
                if(match){
                    let token = jwt.sign({Id}, process.env.JWT_SECRET);
                    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
                    res.json({ msg: 'Admin logged in successfully' });

                }
                else{
                    res
                    .status(403)
                    .json({ msg: "Password incorrect"});
                }
            
        }else{
            res.status(403).json({mes: "Admin Id or Password incorrect"})
        }
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}
async function logoutadmin(req,res){
    res.cookie('token', "");
    res.json({ message: "Logged out successfully" });
}

async function getUser(req,res){
    try{
        let user = await usermodel.find();
        let score =  await scoresmodel.find();
        res.status(200).json({user, score});
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}
async function banUser(req,res){
    const { Team_Name } = req.body;
    if (!Team_Name) return res.status(400).send("Team_Name is required");

    try {
        await Ban.create({ Team_Name });
        res.status(200).redirect('/login');
    } catch (error) {
        res.status(500).send("Error banning.User might have been already banned.");
    }
}
async function unbanUser(req,res){
    const { Team_Name } = req.body;
    if (!Team_Name) return res.status(400).send("Team_Name is required");

    await Ban.deleteOne({ Team_Name });
    res.status(200).json({ msg: ` ${Team_Name} has been unbanned. ` });
}
module.exports={
    getAdminPage,
    loginadmin,
    logoutadmin,
    getUser,
    banUser,
    unbanUser,
};