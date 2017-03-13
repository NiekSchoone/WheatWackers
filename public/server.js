var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

var events = require("events");
var serverEmitter = new events.EventEmitter();

var players = [];
var connections = [];

server.listen(process.env.PORT || 3000);

console.log("server running");

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname));

//Socket connection.
io.sockets.on("connection", function (socket) {
    //Push the connection.
    connections.push(socket);
    console.log("Connected:  %s sockets connected", connections.length);

    //Disconnect.
    socket.on("disconnect", function (data) {
        connections.splice(connections.indexOf(socket), 1);
		if(isPlayer(socket)){
			var player = getPlayerObjectBySocket(socket);
			console.log(player.username + " has disconnected");
			players.splice(player, 1);
		}
        console.log("disconnected: %s sockets remaining", connections.length);
    });

    //Player joins the game.
    socket.on("player_joining", function (username) {
		players.push({socket: socket, username: username});
		io.sockets.emit("player_joined", username);
		console.log(username + " has joined the game");
    });
	
	socket.on("player_move", function (moveData) {
		io.sockets.emit("player_moving", moveData);
		console.log(moveData.player + " moved to tile " + moveData.x + " " + moveData.y);
	});
	
	
});

//Get the desired player object by its designated socket.
function getPlayerObjectBySocket(key) {
    for (var i=0; i < players.length; i++) {
        if (players[i].socket === key) {
            return players[i];
        }
    }
}

//Check if a socket is assigned to a player object.
function isPlayer(key){
	for(var i=0; i < players.length; i++){
		if(players[i].socket === key){
			return true;
		}
	}return false;
}


