class GameState extends Phaser.State {

    private gamefield: Grid;
    private spawnPonits: Tile[];
    private playerManager: PlayerManager;
    private group: Phaser.Group;
    private playerId: number;

    private joinButton: Phaser.Button;
    private playername: string;
    public init(_username: string) {

        this.playername = _username;
    }
    public create() {
        this.group = new Phaser.Group(this.game);

        let client = this;
        this.gamefield = new Grid(this.game, 20, 20, function (tiles: Tile[][]) {
            for (var x = 0; x < tiles.length; x++) {
                let tile = tiles[x];
                for (var y = 0; y < tile.length; y++) {
                    client.group.add(tile[y]);
                }
            }
        });

        this.playerManager = new PlayerManager(this.game, this.gamefield, this.group);
        
        this.playerManager.joinAsPlayer(this.playername);
    }
}