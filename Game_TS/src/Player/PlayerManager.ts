class PlayerManager {

    private player: Player;
    private opponents: Object[];

    private game: Phaser.Game;
    private grid: Grid;

    constructor(_game: Phaser.Game, _grid: Grid) {
        this.createPlayer("Niek");
    }

    createPlayer(_username:string) {
        SOCKET.emit("player_joining", _username);
        this.player = new Player(this.game, this.grid, _username);
    }

    createOpponent(_username: string) {
        let newOpponent = new Player(this.game, this.grid, _username);
        this.opponents.push(newOpponent);
    }

    moveOpponent() {

    }

    createEvents() {
        let client = this;
        SOCKET.on("player_joined", function (data) {
            client.createOpponent(data);
        });
        SOCKET.on("player_moving", function (data) {

        });
    }
}