var PlayerManager = (function () {
    function PlayerManager(_game, _grid, _group, username) {
        this.game = _game;
        this.grid = _grid;
        this.playerName = username;
        this.opponents = [];
        this.players = [null, null, null, null];
        this.spawnPoints = [{ x: 11, y: 10 }, { x: 10, y: 11 }, { x: 11, y: 12 }, { x: 12, y: 11 }];
        this.createEvents();
        this.group = _group;
        SOCKET.emit("joining");
    }
    PlayerManager.prototype.joinAsPlayer = function () {
        var playerNumber = this.getOpenPlayerSlot();
        var spawnPoint = this.spawnPoints[playerNumber];
        SOCKET.emit("joined", { playerID: playerNumber, username: this.playerName, spawnPoint: spawnPoint });
    };
    PlayerManager.prototype.createPlayer = function (playerData) {
        var spawnAnimation = new Phaser.Sprite(this.game, this.grid.getTile(playerData.spawnPoint.x, playerData.spawnPoint.y).getX(), this.grid.getTile(playerData.spawnPoint.x, playerData.spawnPoint.y).getY(), 'spawn_anim');
        this.player = new Player(this.game, this.grid, playerData.playerID, playerData.username, playerData.spawnPoint, spawnAnimation);
        this.players[playerData.playerID] = this.player;
        this.game.add.existing(this.player);
        this.group.add(this.player.spawnAnimation);
        this.updateGroup();
    };
    PlayerManager.prototype.createOpponent = function (playerData) {
        var spawnAnimation = new Phaser.Sprite(this.game, this.grid.getTile(playerData.x, playerData.y).getX(), this.grid.getTile(playerData.x, playerData.y).getY(), 'spawn_anim');
        var newOpponent = new Humanoid(this.game, this.grid, playerData.playerID, playerData.username, playerData.x, playerData.y, spawnAnimation);
        this.players[playerData.playerID] = newOpponent;
        this.opponents.push(newOpponent);
        this.game.add.existing(newOpponent);
        this.group.add(newOpponent.spawnAnimation);
        this.updateGroup();
    };
    PlayerManager.prototype.removeOpponent = function (playerData) {
        var opponentToRemove = this.getOpponentByID(playerData.playerID);
        opponentToRemove.destroy();
        this.opponents.splice(this.opponents.indexOf(opponentToRemove), 1);
        this.players[playerData.playerID] = null;
    };
    PlayerManager.prototype.moveOpponent = function (moveData) {
        var opponent = this.getOpponentByName(moveData.player);
        opponent.moveTowards(moveData.x, moveData.y);
    };
    PlayerManager.prototype.createEvents = function () {
        var client = this;
        SOCKET.on("join_game", client.joinAsPlayer.bind(this));
        SOCKET.on("init_player", function (playerData) {
            client.createPlayer(playerData);
        });
        SOCKET.on("init_opponents", function (opponents) {
            for (var i = 0; i < opponents.length; i++) {
                client.createOpponent(opponents[i]);
            }
        });
        SOCKET.on("player_joined", function (data) {
            client.createOpponent(data);
        });
        SOCKET.on("player_disconnected", function (player) {
            client.removeOpponent(player);
        });
        SOCKET.on("player_moving", function (data) {
            client.moveOpponent(data);
        });
    };
    PlayerManager.prototype.updateGroup = function () {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i] != null) {
                this.group.add(this.players[i]);
            }
            else {
                this.group.remove(this.players[i]);
            }
        }
    };
    PlayerManager.prototype.getOpponentByName = function (username) {
        for (var i = 0; i < this.opponents.length; i++) {
            if (this.opponents[i].username == username) {
                return this.opponents[i];
            }
        }
    };
    PlayerManager.prototype.getOpponentByID = function (id) {
        for (var i = 0; i < this.opponents.length; i++) {
            if (this.opponents[i].playerID == id) {
                return this.opponents[i];
            }
        }
    };
    PlayerManager.prototype.getOpenPlayerSlot = function () {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i] == null) {
                return i;
            }
        }
    };
    return PlayerManager;
}());
