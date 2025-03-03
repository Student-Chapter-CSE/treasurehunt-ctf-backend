const banmodel = require('../models/Ban');

const isBanned = async (req, res, next) => {
    let{Team_Name}=req.body;
    const banned = await banmodel.findOne({Team_Name });
  
    if (banned) {
        return res.status(403).send("Access Denied: You have been banned.");
    }
    next();
  };

module.exports.isBanned = isBanned;
  