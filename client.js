const socket = io("http://localhost:5000");
// Get DOM elements in respective Js Variables.
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageImp");
const messageContainer = document.querySelector(".container");
// Audio that will play on receiving messages
var audio = new Audio("ding.mp3");

// Function which will append event info to the container
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
};

// Ask new User for his/Her name and let the server know
const username = prompt("Enter your name");
socket.emit("new-user-joined", username);

// If a new user joins, receive his/her name from the server
socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "right");
});

//If server send the message, receive it.
socket.on("receive", (data) => {
  append(`${data.name} : ${data.message}`, "left");
});

// If a user leaves the chat, append the info to the container
socket.on("left", (name) => {
  append(`${name} left the chat`, "right");
});

// If the form gets submitted, send server the message.
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});
