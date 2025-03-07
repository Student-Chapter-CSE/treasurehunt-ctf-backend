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
        const {Mail, Password}= req.body;
        const admin = process.env.ADMIN_NAME;
        if(Mail === admin){
            const match = await bcrypt.compare(Password, process.env.ADMIN_PASSWORD_HASH);
                if(match){
                    let token = jwt.sign({Mail}, process.env.JWT_SECRET);
                    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
                    res.json({ msg: 'Admin logged in successfully' });

                }
                else{
                    res
                    .status(403)
                    .json({ msg: "Mail or Password incorrect"});
                }
            
        }else{
            res.status(403).json({mes: "Mail or Password incorrect"})
        }
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}
async function getUser(req,res){
    try{
        let user = await usermodel.find();
        let score =  await scoresmodel.find();
        res.status(200).render('admin', {user, score});
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}
async function banUser(req,res){
    const { Team_Name } = req.body;
    if (!Team_Name) return res.status(400).send("Team_Name is required");

    try {
        await Ban.create({ Team_Name });
        res.status(200).json({ msg: `${Team_Name} has been banned.` });
    } catch (error) {
        res.status(500).send("Error banning.User might have been already banned.");
    }
}
async function unbanUser(req,res){
    const { Team_Name } = req.body;
    if (!Team_Name) return res.status(400).send("Team_Name is required");

    await Ban.deleteOne({ Team_Name });
    res.status(200).send(` ${Team_Name} has been unbanned. `);
}
module.exports={
    getAdminPage,
    loginadmin,
    getUser,
    banUser,
    unbanUser,
};