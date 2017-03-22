declare var SOCKET: Socket;

class Game {

    private game: Phaser.Game;
    private stage: Phaser.Stage;
    private grid: Grid;
    private joinMenu: JoinGameMenu;
    private playerManager: PlayerManager;

    private background: Phaser.TileSprite;

    public group: Phaser.Group;

    private musicLoop: Phaser.Sound;

    constructor() {
        this.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
        this.game.stage = new Phaser.Stage(this.game);

        SOCKET = io.connect();
    }

    preload() {
        //Image loading
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
        this.game.load.image('fence_side', 'assets/images/level/fence_side.png');
        this.game.load.image('fence_bottom', 'assets/images/level/fence_bottom.png');
        this.game.load.image('fence_top', 'assets/images/level/fence_top.png');
        this.game.load.image('fence_corner_top', 'assets/images/level/fence_corner_top.png');
        this.game.load.image('fence_corner_bottom', 'assets/images/level/fence_corner_bottom.png');
        this.game.load.image('button_join', 'assets/images/ui/button_join.png');

        //Spritesheet loading
        this.game.load.spritesheet('spawn_anim', 'assets/spritesheets/spawn_anim.png', 500, 800);
        this.game.load.spritesheet('player_0', 'assets/spritesheets/player_1.png', 150, 150);
        this.game.load.spritesheet('player_1', 'assets/spritesheets/player_2.png', 150, 150);
        this.game.load.spritesheet('player_2', 'assets/spritesheets/player_3.png', 150, 150);
        this.game.load.spritesheet('player_3', 'assets/spritesheets/player_4.png', 150, 150);
        this.game.load.spritesheet('wheat_cut_anim', 'assets/spritesheets/wheat_cut_anim.png', 256, 256);

        //Audio loading
        this.game.load.audio('music_loop', 'assets/audio/music_loop.mp3');
        this.game.load.audio('button_sound', 'assets/audio/button_sound.mp3');
        this.game.load.audio('spawn_sound', 'assets/audio/spawn_sound.mp3');
        this.game.load.audio('walk_sound', 'assets/audio/walk_sound.mp3');
        this.game.load.audio('cut_sound', 'assets/audio/cut_sound.mp3');
        this.game.load.audio('cow_sound', 'assets/audio/cow_sound.mp3');
    }

    create() {
        this.game.stage.disableVisibilityChange = true;

        let gridSizeX = 23;
        let gridSizeY = 23;

        this.background = new Phaser.TileSprite(this.game, 0, 0, gridSizeX * 144, gridSizeY * 144, 'background');
        this.background.texture.width = 864;
        this.background.texture.height = 864;
        this.game.add.existing(this.background);

        this.group = new Phaser.Group(this.game);

        let client = this;
        this.grid = new Grid(this.game, gridSizeX, gridSizeY, function (tiles: Tile[][]) {
            for (let i = 0; i < tiles.length; i++) {
                let tile = tiles[i];
                for (let j = 0; j < tile.length; j++) {
                    client.group.add(tile[j].GetSprite());
                    client.group.add(tile[j].GetAnimSprite());
                }
            }
        });
        this.playerManager = new PlayerManager(this.game, this.grid, this.group);

        this.musicLoop = this.game.add.audio('music_loop', 0.25, true);
        this.musicLoop.play();
    }

    update() {
        this.group.sort("y", Phaser.Group.SORT_ASCENDING);
    }
}

window.onload = () => {
    var game = new Game();
};