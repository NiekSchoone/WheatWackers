declare var SOCKET: Socket;

class Game {

    private game: Phaser.Game;
    private stage: Phaser.Stage;
    private grid: Grid;
    private joinMenu: JoinGameMenu;
    private playerManager: PlayerManager;

    private background: Phaser.TileSprite;

    constructor() {
        this.game = new Phaser.Game(864, 864, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
        this.game.stage = new Phaser.Stage(this.game);

        //SOCKET = io.connect();
    }

    preload() {
        this.game.load.image('background', 'assets/images/level/background.jpg');
        this.game.load.image('wheat_1', 'assets/images/level/wheat_01.png');
        this.game.load.image('wheat_2', 'assets/images/level/wheat_02.png');
        this.game.load.image('wheat_3', 'assets/images/level/wheat_03.png');
        this.game.load.image('wheat_4', 'assets/images/level/wheat_04.png');
        this.game.load.image('wheat_5', 'assets/images/level/wheat_05.png');
        this.game.load.image('wheat_cut_1', 'assets/images/level/wheat_cut_01.png');
        this.game.load.image('wheat_cut_2', 'assets/images/level/wheat_cut_02.png');
        this.game.load.image('wheat_cut_3', 'assets/images/level/wheat_cut_03.png');
        this.game.load.image('obstacle_1', 'assets/images/level/obstacle_01.png');
        this.game.load.image('obstacle_2', 'assets/images/level/obstacle_02.png');
        this.game.load.image('obstacle_3', 'assets/images/level/obstacle_03.png');
        this.game.load.image('button_join', 'assets/images/ui/button_join.png');
    }

    create() {
        this.game.stage.disableVisibilityChange = true;

        this.background = new Phaser.TileSprite(this.game, 0, 0, 3024, 3024, 'background');
        this.background.texture.width = 864;
        this.background.texture.height = 864;
        this.game.add.existing(this.background);

        let gridSizeX = 21;
        let gridSizeY = 21;
        this.grid = new Grid(this.game, gridSizeX, gridSizeY);

        //this.playerManager = new PlayerManager(this.game, this.grid);
    }
}

window.onload = () => {
    var game = new Game();
};