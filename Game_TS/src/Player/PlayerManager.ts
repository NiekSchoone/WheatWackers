class PlayerManager {

    private player: Player;
    private opponents: Humanoid[];

    private players: any[];
    
    private spawnPoints: any[];

    private game: Phaser.Game;
    private grid: Grid;

    private group: Phaser.Group;

    constructor(_game: Phaser.Game, _grid: Grid, _group: Phaser.Group) {
        this.game = _game;
        this.grid = _grid;
        this.opponents = [];
        this.players = [null, null, null, null];
        this.spawnPoints = [{ x: 10, y: 9 }, { x: 9, y: 10 }, { x: 10, y: 11 }, { x: 11, y: 10 }];

        this.createEvents();

        this.group = _group;

        SOCKET.emit("join_ready");
    }

    createPlayer(playerData: any) {
        this.player = new Player(this.game, this.grid, playerData.playerID, playerData.username, playerData.spawnPoint);
        this.players[playerData.playerID] = this.player;
        this.game.add.existing(this.player);
        this.updateGroup();
    }
    createOpponent(playerData: any) {
        let newOpponent = new Humanoid(this.game, this.grid, playerData.playerID, playerData.username, playerData.x, playerData.y);
        this.players[playerData.playerID] = newOpponent;
        this.opponents.push(newOpponent);
        this.game.add.existing(newOpponent);
        this.updateGroup();
    }
    removeOpponent(playerData: any) {
        let opponentToRemove = this.getOpponentByID(playerData.playerID);
        opponentToRemove.destroy();
        this.opponents.splice(this.opponents.indexOf(opponentToRemove), 1);
        this.players[playerData.playerID] = null;
    }
    moveOpponent(moveData: any) {
        let opponent = this.getOpponentByName(moveData.player);
        opponent.moveTowards(moveData.x, moveData.y);
    }
    createJoinWindow() {
        let client = this;
        let joinWindow = new JoinGameMenu(this.game, function (username: string) {
            let playerNumber = client.getOpenPlayerSlot();
            let spawnPoint = client.spawnPoints[playerNumber];
            SOCKET.emit("joined", { playerID: playerNumber, username: username, spawnPoint: spawnPoint });
        });
    }

    createEvents() {
        let client = this;
        SOCKET.on("join_game", client.createJoinWindow.bind(this));

        SOCKET.on("init_player", function (playerData) {
            client.createPlayer(playerData);
        });

        SOCKET.on("init_opponents", function (opponents) {
            for (let i = 0; i < opponents.length; i++) {
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
    }

    updateGroup() {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i] != null) {
                this.group.add(this.players[i]);
            } else {
                this.group.remove(this.players[i]);
            }
        }
        console.log(this.group);
    }

    getOpponentByName(username: string) {
        for (let i = 0; i < this.opponents.length; i++) {
            if (this.opponents[i].username == username) {
                return this.opponents[i];
            }
        }
    }
    getOpponentByID(id: number) {
        for (let i = 0; i < this.opponents.length; i++) {
            if (this.opponents[i].playerID == id) {
                return this.opponents[i];
            }
        }
    }
    getOpenPlayerSlot(): number {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i] == null) {
                return i;
            }
        }
    }
}

