class GameState extends Phaser.State {

    private gamefield: Grid;
    private spawnPonits: Tile[];
    private playerManager: PlayerManager;
    private group: Phaser.Group;
    private playerId: number;
    private joinButton: Phaser.Button;
    private playername: string;
    private background: Phaser.TileSprite;
    private musicLoop: Phaser.Sound;
    public fading: boolean;

    public init(_username: string) {
        this.playername = _username;
    }

    public create() {
        let client = this;

        this.game.stage.disableVisibilityChange = true;

        let gridSizeX = 23;
        let gridSizeY = 23;

        this.game.physics.arcade.enable(this);
        this.game.camera.flash(0x000000, 1000);
        this.game.camera.focusOnXY((gridSizeX * 144) / 2, (gridSizeX * 144) / 2);

        this.background = new Phaser.TileSprite(this.game, 0, 0, gridSizeX * 144, gridSizeY * 144, 'background');
        this.background.texture.width = 864;
        this.background.texture.height = 864;
        this.game.add.existing(this.background);

        this.group = new Phaser.Group(this.game);

        this.gamefield = new Grid(this.game, gridSizeX, gridSizeY, function (tiles: Tile[][]) {
            for (let i = 0; i < tiles.length; i++) {
                let tile = tiles[i];
                for (let j = 0; j < tile.length; j++) {
                    client.group.add(tile[j].GetSprite());
                    client.group.add(tile[j].GetAnimSprite());
                }
            }
        });
        
        this.playerManager = new PlayerManager(this.game, this.gamefield, this.group, this.playername);

        this.musicLoop = this.game.add.audio('music_loop', 0.05, true);
        this.musicLoop.play();
    }

    public update() {
        this.group.sort("y", Phaser.Group.SORT_ASCENDING);
    }
}