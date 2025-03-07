const mongoose=require("mongoose")
const userschema=new mongoose.Schema(
    {
        Team_Name:{
            type: String,
            required: true,
            unique: true,
        },
        Points:{
            type:Number,
            required:true,
            default:0,
        },
        Last_Updated: {
            type: Date,
            default: Date.now,
        }
    }
)
const Score=mongoose.model("Score", userschema);
module.exports=Score;