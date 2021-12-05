require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.port || 3000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/view/index.html");
});

app.get("/local", (req, res) => {
  res.sendFile(__dirname + "/view/local.html");
});

app.get("/online", (req, res) => {
  res.sendFile(__dirname + "/view/online.html");
});

io.on("connection", (socket) => {
  socket.on("login", (msg) => {
    console.log(msg);
  });
});

server.listen(PORT, () => {
  console.log("listening on : " + port);
});
