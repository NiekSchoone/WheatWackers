var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

var connections = [];
var players = [];
var grid;

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
    socket.on("disconnect", function (dcData) {
		if(isPlayer(socket.id)){
			var player = getPlayerObjectBySocket(socket.id);
			socket.broadcast.emit("player_disconnected", player);
			
			console.log("Player " + player.playerID + " named " + player.username + " has disconnected");
			
			players.splice(players.indexOf(player), 1);
		}
		connections.splice(connections.indexOf(socket), 1);
		
        console.log("disconnected: %s sockets remaining", connections.length);
    });
	
	socket.on("grid_created", function(gridData){
		grid = gridData;
		
		console.log(grid);
	});
	
	socket.on("joining", function(){
		if(grid != undefined){
			socket.emit("init_grid", grid);
		}else{
			socket.emit("create_grid");
		}
		socket.emit("init_opponents", players);
		socket.emit("join_game");
	});
	
	socket.on("joined", function(userData){
		var player = {socket: socket.id, playerID: userData.playerID, username: userData.username, x: userData.spawnPoint.x, y: userData.spawnPoint.y};
		players.push(player);
		socket.emit("init_player", userData);
		socket.broadcast.emit("player_joined", player);
		
		console.log("socket: " + player.socket + " has joined the game as player " + player.playerID + " with username " + player.username);
	});
	
	socket.on("player_move", function (moveData) {
		var player = getPlayerObjectBySocket(socket.id);
		player.x = moveData.x;
		player.y = moveData.y;
		socket.broadcast.emit("player_moving", moveData);
		
		console.log(moveData.player + " moved to tile " + player.x + " " + player.y);
	});
	socket.on("wheat_cut", function (cutData){
		socket.broadcast.emit("wheat_cutted", cutData);
		grid[cutData.x][cutData.y] = 2;
		
		console.log("tile x: " + cutData.x + " y: " + cutData.y + " was cut down");
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

