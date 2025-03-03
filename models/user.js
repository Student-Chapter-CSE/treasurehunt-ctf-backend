const mongoose=require("mongoose")
const userschema=new mongoose.Schema(
    {
        Team_Name:{
            type: String,
            required: true,
            unique: true,
        },
        Team_Leader_Name:{
            type:String,
            required:true,
        },
        Team_Leader_Mail:{
            type: String,
            required: true,
            unique: true,
        },
        Team_Leader_Dept:{
            type:String,
            required:true,
        },
        Team_Leader_RollNo:{
            type:Number,
            required:true,
        },
        Team_Leader_Year:{
            type:String,
            required:true,
        }

    }
)
const Users=mongoose.model('user',userschema);
module.exports=Users;