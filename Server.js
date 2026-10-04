const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.get("/", (req, res) => {
  res.send("Chess Life server is running!");
});

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    socket.to(room).emit("playerJoined");
  });

  socket.on("move", (data) => {
    socket.to(data.room).emit("opponentMove", data);
  });

  socket.on("gameState", (data) => {
    socket.to(data.room).emit("gameState", data);
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Chess Life server running on port ${PORT}`);
});
