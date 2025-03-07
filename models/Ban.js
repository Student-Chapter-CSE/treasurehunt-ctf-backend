const mongoose = require('mongoose');

const banSchema = new mongoose.Schema({
    Team_Name:{
        type:String,
        requied: true,
        unique: true
    }
});
  
const Ban = mongoose.model("Ban", banSchema);

module.exports = Ban;