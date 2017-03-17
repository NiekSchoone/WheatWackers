﻿class PlayerManager {

    private player: Player;
    private opponents: Humanoid[];

    private game: Phaser.Game;
    private grid: Grid;

    constructor(_game: Phaser.Game, _grid: Grid) {
        this.game = _game;
        this.grid = _grid;
        this.opponents = [];

        this.createEvents();

        SOCKET.emit("join_ready");
    }

    createPlayer(_username: string) {
        this.player = new Player(this.game, this.grid, _username);
        this.game.add.existing(this.player);
    }
    createOpponent(playerData: any) {
        let newOpponent = new Humanoid(this.game, this.grid, playerData.username, playerData.x, playerData.y);
        this.opponents.push(newOpponent);
        this.game.add.existing(newOpponent);
        console.log(playerData.username + " joined as a new opponent");
    }
    removeOpponent(_username: string) {
        let opponentToRemove = this.getOpponentByName(_username);
        this.opponents.splice(this.opponents.indexOf(opponentToRemove), 1);
        opponentToRemove.destroy();
    }

    moveOpponent(moveData: any) {
        let opponent = this.getOpponentByName(moveData.player);
        opponent.moveTowards(moveData.x, moveData.y);
    }

    createJoinWindow() {
        let joinWindow = new JoinGameMenu(this.game);
    }

    createEvents() {
        let client = this;
        SOCKET.on("join_game", client.createJoinWindow.bind(this));

        SOCKET.on("init_player", function (username) {
            client.createPlayer(username);
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

    getOpponentByName(username: string) {
        for (let i = 0; i < this.opponents.length; i++) {
            if (this.opponents[i].username === username) {
                return this.opponents[i];
            }
        }
    }
}