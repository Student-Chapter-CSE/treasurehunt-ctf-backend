const mongoose=require("mongoose")
async function connectMongodb(url) {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/treasure-hunt");
        console.log("Mongo DB connected...");
    } catch (err) {
        console.error("Connection failed due to ", err);
    }
}

module.exports = {connectMongodb};