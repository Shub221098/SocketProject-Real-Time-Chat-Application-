// Node server which will handle socket io connections
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
}); // listen incoming events
const users = {};
io.on("connection", (socket) => {
  cors();

  // socket.io instance. it can listen all the connect users
  // If any new user joins , let other users connected to the server know.
  socket.on("new-user-joined", (username) => {
    // socket.on listen a particular connection
    // new-user-joined event
    users[socket.id] = username;
    socket.broadcast.emit("user-joined", username); // broadcast.emit will send new user connected msg to everyone but not the user who connected.
  });
  // If someone send a message, broadcast it to other people
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
  // If someone leaves the chat, let others know
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
server.listen(5000);

// ws.on("connection", (client) => {
//   console.log("Connected to server");
//   ws.emit("data", "By");
// });
// server.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });
