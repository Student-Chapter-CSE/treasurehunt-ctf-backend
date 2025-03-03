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
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});
app.use(cors({
  origin: 'http://localhost:5000', // Adjust based on your frontend
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
    const users = await User.find(); // Fetch all teams from users collection
    const leaderboard = await Score.find(); // Fetch existing leaderboard

    // Convert existing team names to a Set for quick lookup
    const existingTeams = new Set(leaderboard.map((entry) => entry.Team_Name));

    // Insert only new teams that are not already in the scores collection
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

// 🏆 **Update & Broadcast Leaderboard**
const updateLeaderboard = async () => {
  try {
    const leaderboard = await Score.find().sort({ Points: -1, Last_Updated: 1 });
    io.emit("leaderboardUpdate", leaderboard);  //  Broadcast to all WebSocket clients
    console.log("📡 Leaderboard broadcasted to all clients.");
  } catch (error) {
    console.error(" Error updating leaderboard:", error.message);
  }
};
io.on("connection", async (socket) => {
  console.log(" User connected:", socket.id);

  try {
    const leaderboard = await Score.find().sort({ Points: -1, Last_Updated: 1 });
    socket.emit("leaderboard", leaderboard);  // Send initial leaderboard
  } catch (error) {
    console.error(" Error fetching leaderboard for new connection:", error.message);
  }

  // **New WebSocket Event for Real-Time Leaderboard**
  socket.on("getLeaderboard", async () => {
    try {
      const leaderboard = await Score.find().sort({ Points: -1, Last_Updated: 1 });
      console.log("Leaderboard Data Fetched:", leaderboard); 
      socket.emit("leaderboardUpdate", leaderboard);
      console.log(" Sent leaderboard on 'getLeaderboard' request.");
    } catch (error) {
      console.error(" Error sending leaderboard:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);
  });
});
app.use("/", signuprouter);
app.use("/login", loginuser);
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
