class PlayerManager {

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

    createPlayer(_username:string) {
        this.player = new Player(this.game, this.grid, _username);
        this.game.add.existing(this.player);
    }

    createOpponent(_username: string) {
        let newOpponent = new Humanoid(this.game);
        this.opponents.push(newOpponent);
        console.log(_username + " joined as a new opponent");
    }

    moveOpponent(moveData: any) {
        let opponent = moveData.player;
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
                client.createOpponent(opponents[i].username);
            }
        });
        SOCKET.on("player_joined", function (data) {
            client.createOpponent(data);
        });
        SOCKET.on("player_move", function (data) {
            client.moveOpponent(data);
        });
    }
}