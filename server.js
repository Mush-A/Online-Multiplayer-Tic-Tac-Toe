require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/view/index.html");
});

app.get("/local", (req, res) => {
  res.sendFile(__dirname + "/view/local.html");
});

app.get("/join", (req, res) => {
  res.sendFile(__dirname + "/view/join.html");
});

app.get("/online", (req, res) => {
  res.sendFile(__dirname + "/view/online.html");
});

io.on("connection", (socket) => {
  socket.on("login", (THIS_PLAYER) => {
    let room = io.sockets.adapter.rooms.get(THIS_PLAYER.room_id);

    if (!room) {
      // Join the first player
      socket.join(THIS_PLAYER.room_id);

      // Send to self - player one
      io.to(socket.id).emit("playerOne");
      //
    } else if (room.size === 1) {
      // Join the second player
      socket.join(THIS_PLAYER.room_id);

      // Send to self - player two
      io.to(socket.id).emit("playerTwo");

      //send out connection status between the players.
      io.in(THIS_PLAYER.room_id).emit("connected");
      //
    } else {
      return console.log("room full");
    }

    // Exchange data about each other
    socket.on("dataExchange", (THIS_PLAYER) => {
      socket.broadcast
        .to(THIS_PLAYER.room_id)
        .emit("dataExchange", THIS_PLAYER);
    });

    // Exchange moves
    socket.on("move", (data) => {
      socket.broadcast.to(THIS_PLAYER.room_id).emit("move", data);
    });

    socket.on("win", (win) => {
      io.in(THIS_PLAYER.room_id).emit("win", win);
    });

    socket.on("reset", () => {
      io.in(THIS_PLAYER.room_id).emit("reset");
    });
  });
});

server.listen(PORT, () => {
  console.log("listening on : " + PORT);
});
