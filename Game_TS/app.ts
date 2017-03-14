declare var SOCKET: Socket;

class Game {

    private game: Phaser.Game;
    private grid: Grid;

    constructor() {
        this.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });

        /*SOCKET.on("player_joined", function (data) {
            console.log(data + " has joined");
        });*/
    }

    preload() {
        this.game.load.image('wheat', 'Images/wheat_01.png');
        this.game.load.image('wheat_cut', 'Images/wheat_cut.png');
        this.game.load.image('button_join', 'Images/button_join.png');
    }

    create() {
        this.grid = new Grid(this.game);
        this.grid.generateGrid(12, 12);
        var tileToCut = this.grid.getTile(3, 3).setTile(false);
    }
}

window.onload = () => {
    var game = new Game();
};