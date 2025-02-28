//require("dotenv").config();
const express=require("express")
const path=require("path")
const app=express()
const connection=require("./connection")
connection.connectMongodb('mongodb://127.0.0.1:27017/treasure_hunt')
//const port = process.env.PORT || 4000;
const port=4000;
const signuprouter=require("./routes/signup")
const loginuser=require("./routes/login")
app.use(express.urlencoded({ extended: false }));
app.use("/",signuprouter)
app.use("/login",loginuser)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
