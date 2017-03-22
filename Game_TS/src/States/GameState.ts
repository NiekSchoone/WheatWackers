class GameState extends Phaser.State {

    private gamefield: Grid;
    private spawnPonits: Tile[];
    private playerManager: PlayerManager;
    private group: Phaser.Group;
    private playerId: number;
    private userInput: HTMLElement;
    private joinButton: Phaser.Button;
    private playername: string;
    public init(_username: string) {
        alert(_username);
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
        //this.playerManager = new PlayerManager(this.game, this.gamefield, this.group);
        this.createUsernameElement();
        document.body.insertBefore(this.userInput, this.game.canvas);
        this.joinButton = this.add.button(this.game.world.centerX, 500, 'JoinButton', this.startGame, this, 1, 2, 3);
    }
    private createUsernameElement() {
        this.userInput = document.createElement('input');
        this.userInput.style.right = "50%";
        this.userInput.style.width = "250px";
        this.userInput.style.position = "fixed";
        this.userInput.style.margin = "20% -125px 0px 0px";
        this.userInput.style.display = "block";
    }

    private startGame() {
        let username = document.getElementsByTagName("input")[0].value;
        this.playerManager.joinAsPlayer(username);


    }
}