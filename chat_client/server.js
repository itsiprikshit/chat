var express = require('express');
var fs = require("fs");
var socket = require('socket.io');

var app = express();

var http = require('http').createServer(app);
var io = socket(http);

app.use("/style", express.static(__dirname + "/style"));
console.log("Starting...");

var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = config.port;

app.get('/', function (req, res) {
   res.sendFile(__dirname + '/chat.html');
});

io.on('connection', function(socket){

  socket.on('join', function(name){
  	console.log(name + " connected.");
  	socket.username = name;
  	io.emit('new_user', name + " joined.");
  });

  console.log(socket.username + ' connected.');

  socket.on('disconnect', function(){
    console.log(socket.username + ' disconnected.');
  });

  socket.on('chat_message', function(msg){
	console.log(socket.username + ": " + msg);
    io.emit('chat_message', socket.username + ": " + msg);		//io.emit braodcasts the message to all.
  });
});

http.listen(port, host,function(){
	console.log("Server running at " + host + ":" + port);
});