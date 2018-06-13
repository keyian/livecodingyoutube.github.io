var osc = require("osc");

var bodyParser = require("body-parser");

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const fs = require('fs');


app.get('/', function(req, res){
  res.sendFile(__dirname + '/');
});

io.on('connection', function(socket){
  console.log('a user connected');
});
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

http.listen(3000, function() {
  console.log("hey dudelistening to=3000");
});

console.log('Started server on port 3000');

var udpPort = new osc.UDPPort({
    // This is the port we're listening on.
    localAddress: "127.0.0.1",
    localPort: 57121,

    // This is where sclang is listening for OSC messages.
    remoteAddress: "127.0.0.1",
    remotePort: 57120,
    metadata: true
});

udpPort.on("message", function(oscMsg) {
  io.emit("oscMSG", oscMsg);
});


// Open the socket.
udpPort.open();

// Every second, send an OSC message to SuperCollider
// setInterval(function() {
//     var msg = {
//         address: "/hello/from/oscjs",
//         args: [
//             {
//                 type: "f",
//                 value: Math.random()
//             },
//             {
//                 type: "f",
//                 value: Math.random()
//             }
//         ]
//     };
//     console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
//     udpPort.send(msg);
// }, 10000);
