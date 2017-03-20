class Humanoid extends Phaser.Sprite
{
    private speed: number = 1000;
    private grid: Grid;
    private cursorkeys;

    public playerId:number;
    public username:string;

    constructor(game: Phaser.Game, grid: Grid, username: string, x: number, y: number)
    {
        super(game, 0, 0, "failguy");

        this.grid = grid;
        this.username = username;

        this.position.set(grid.getTile(x, y).getX(), grid.getTile(x, y).getY());

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
        this.anchor.setTo(0.5);

        this.cursorkeys = new Phaser.Key(game, 32);
    }

    public moveTowards(x: number, y: number)
    {
        var tile: Tile = this.grid.getTile(x, y);
        var tween: Phaser.Tween = this.game.add.tween(this.body).to({ x: tile.getX() - this.width / 2, y: tile.getY() - this.height / 2 }, 500, Phaser.Easing.Linear.None, true); 
    }

    public getCurrentTile() {
        return this.grid.getTile(this.x, this.y);
    }
}