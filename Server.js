const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

let posts = []; // shared online memory

io.on("connection", socket => {
  socket.emit("init", posts);

  socket.on("newPost", post => {
    posts.unshift(post);
    io.emit("update", posts);
  });

  socket.on("reply", ({ postIndex, reply }) => {
    posts[postIndex].replies.push(reply);
    io.emit("update", posts);
  });

  socket.on("yeah", index => {
    posts[index].yeahs++;
    io.emit("update", posts);
  });
});

server.listen(3000, () =>
  console.log("BreakVerse online at http://localhost:3000")
);