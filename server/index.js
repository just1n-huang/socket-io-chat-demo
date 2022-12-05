const express = require("express");
const app = express();

const http = require("http");
// needed to build server with socket-io

const cors = require("cors");
// socket-io deals with a lot of cors issues

const { Server } = require("socket.io");

app.use(cors());
// resolves issues above

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    // tells socket-io that it is acceptable to commucate with above url
    methods: ["GET", "POST"],
    // acceptable requests
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined the room: ${data}`);
  });

  socket.on("send_message", (data) => {
    // console.log(data);
    socket.to(data.room).emit("receive_message", data);
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
// listens for connection

server.listen(3001, () => {
  console.log("server running on port 3001");
});
