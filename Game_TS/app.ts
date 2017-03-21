declare var SOCKET: Socket;

class Game {

    private game: Phaser.Game;
    private stage: Phaser.Stage;
    private grid: Grid;
    private joinMenu: JoinGameMenu;
    private playerManager: PlayerManager;

    private background: Phaser.TileSprite;

    public group: Phaser.Group;

    constructor() {
        this.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
        this.game.stage = new Phaser.Stage(this.game);

        SOCKET = io.connect();
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
        this.game.load.spritesheet('player_0', 'assets/spritesheets/player_1.png', 150, 150);
        this.game.load.spritesheet('player_1', 'assets/spritesheets/player_2.png', 150, 150);
        this.game.load.spritesheet('player_2', 'assets/spritesheets/player_3.png', 150, 150);
        this.game.load.spritesheet('player_3', 'assets/spritesheets/player_4.png', 150, 150);
    }

    create() {
        this.game.stage.disableVisibilityChange = true;

        this.background = new Phaser.TileSprite(this.game, 0, 0, 3024, 3024, 'background');
        this.background.texture.width = 864;
        this.background.texture.height = 864;
        this.game.add.existing(this.background);

        this.group = new Phaser.Group(this.game);

        let gridSizeX = 21;
        let gridSizeY = 21;

        let client = this;
        this.grid = new Grid(this.game, gridSizeX, gridSizeY, function (tiles: Tile[][]) {
            for (let i = 0; i < tiles.length; i++) {
                let tile = tiles[i];
                for (let j = 0; j < tile.length; j++) {
                    client.group.add(tile[j].GetSprite());
                }
            }
        });

        this.playerManager = new PlayerManager(this.game, this.grid, this.group);
    }

    update() {
        this.group.sort("y", Phaser.Group.SORT_ASCENDING);
    }
}

window.onload = () => {
    var game = new Game();
};