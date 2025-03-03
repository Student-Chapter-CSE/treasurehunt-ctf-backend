const mongoose=require("mongoose")
async function connectMongodb(url) {
    try {
        await mongoose.connect(url);
        console.log("Mongo DB connected...");
    } catch (err) {
        console.error("Connection failed due to ", err);
    }
}

module.exports = {connectMongodb};