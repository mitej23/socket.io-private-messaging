import io from "socket.io-client";

var socket = io("ws://localhost:3000/", {
  transports: ["websocket"],
  jsonp: false,
});

socket.onAny(function (data) {
  console.log(data);
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
