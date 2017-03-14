declare var SOCKET: Socket;

class Game {

    private game: Phaser.Game;
    private grid: Grid;

    private player: Player;

    private background: Phaser.TileSprite;

    constructor() {
        this.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });

        /*SOCKET.on("player_joined", function (data) {
            console.log(data + " has joined");
        });*/
    }

    preload() {
        this.game.load.image('background', 'Images/Level/background.jpg');
        this.game.load.image('wheat_1', 'Images/Level/wheat_01.png');
        this.game.load.image('wheat_2', 'Images/Level/wheat_02.png');
        this.game.load.image('wheat_3', 'Images/Level/wheat_03.png');
        this.game.load.image('wheat_4', 'Images/Level/wheat_04.png');
        this.game.load.image('wheat_5', 'Images/Level/wheat_05.png');
        this.game.load.image('wheat_cut_1', 'Images/Level/wheat_cut_01.png');
        this.game.load.image('wheat_cut_2', 'Images/Level/wheat_cut_02.png');
        this.game.load.image('wheat_cut_3', 'Images/Level/wheat_cut_03.png');
        this.game.load.image('obstacle_1', 'Images/Level/obstacle_01.png');
        this.game.load.image('obstacle_2', 'Images/Level/obstacle_02.png');
        this.game.load.image('obstacle_3', 'Images/Level/obstacle_03.png');
        this.game.load.image('button_join', 'Images/Level/button_join.png');
    }

    create() {
        this.background = new Phaser.TileSprite(this.game, 0, 0, 864, 864, 'background');
        this.background.texture.width = 864;
        this.background.texture.height = 864;
        this.game.add.existing(this.background);

        this.grid = new Grid(this.game);
        this.grid.generateGrid(6, 6);

        this.player = new Player(this.game);
    }
}

window.onload = () => {
    var game = new Game();
};