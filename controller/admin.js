const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

async function getAdminPage(req,res){
    return res.json({msg:"Admin page"})
}

const loginadmin = async(req, res)=>{
    try{
        const {Mail, Password}= req.body;
        const admin = process.env.ADMIN_NAME;
        if(Mail === admin){
            bcrypt.compare(Password , process.env.ADMIN_PASSWORD_HASH, (err, result)=>{
                if(result){
                    let token = jwt.sign({Mail}, process.env.JWT_SECRET);
                    res.cookie('token', token)
                    .json({ msg: 'admin page'});
                }
                else{
                    res
                    .status(403)
                    .json({ msg: "Mail or Password incorrect"});
                }
            })
        }else{
            res.status(403).json({mes: "Mail or Password incorrect"})
        }
    }catch(err){
        res.send(err.message);
    }
}

module.exports={
    getAdminPage,
    loginadmin
};