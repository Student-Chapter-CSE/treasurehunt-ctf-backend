require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Score = require("./models/scores"); 
const User = require("./models/user"); 
const signuprouter = require("./routes/signup");
const loginuser = require("./routes/login");
const adminlogin = require('./routes/adminlogin');
const admin = require('./routes/admin');
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});
app.use(cors({
  origin: "*", // Adjust based on your frontend
  credentials: true // Allows sending cookies
}));
//Middlewares
app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

//MongoDB Connection
const connection = require("./connection");
connection.connectMongodb(process.env.MONGOURL);


const initializeLeaderboard = async () => {
  try {
    const users = await User.find(); 
    const leaderboard = await Score.find(); 
    const existingTeams = new Set(leaderboard.map((entry) => entry.Team_Name));
    const newTeams = users.filter((user) => !existingTeams.has(user.Team_Name));
    if (newTeams.length > 0) {
      await Score.insertMany(newTeams.map((user) => ({ Team_Name: user.Team_Name })));
      console.log(`Added ${newTeams.length} new teams to the leaderboard.`);
    } else {
      console.log(" Leaderboard is already up-to-date.");
    }
  } catch (error) {
    console.error(" Error initializing leaderboard:", error.message);
  }
};
// Run this once when the server starts
initializeLeaderboard();
io.on("connection", async (socket) => {
  console.log(" User connected:", socket.id);
  const interval = setInterval(async () => {
    const leaderboard = await Score.aggregate([
      {
        $sort: { Points: -1 }, // Sort by Points first, then Last_Updated
      },
      {
        $setWindowFields: {
          partitionBy: null, // Needed for global ranking
          sortBy: { Points: -1 },
          output: {
            position: { $rank: {} }, // Assigns ranking
          },
        },
      },
      {
        $limit: 25, // Only keep the top 25 ranked players
      },
    ]);
    
    socket.emit("leaderboardUpdate", leaderboard);
  }, 1000);

  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);
    clearInterval(interval);
  });
});

//user routes
app.use("/", signuprouter);
app.use("/login", loginuser);
app.use('/admin', adminlogin);
app.use('/admin', admin);
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
