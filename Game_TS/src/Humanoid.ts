class Humanoid extends Phaser.Sprite
{
    private speed: number = 1000;
    private grid: Grid;
    private cursorkeys;




    constructor(game: Phaser.Game, grid: Grid, username : string)
    {
        super(game, 0, 0, "failguy");
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
        this.grid = grid;
        this.anchor.setTo(0.5);

        this.cursorkeys = new Phaser.Key(game, 32);
        this.moveTowards(3, 3);
    }

    public moveTowards(x: number, y: number)
    {
        var tile: Tile = this.grid.getTile(x, y);
        var tween: Phaser.Tween = this.game.add.tween(this.body).to({ x: tile.getX() - this.width / 2, y: tile.getY() - this.height / 2 }, this.game.physics.arcade.distanceToXY(this, x, y) / this.speed * 1000, Phaser.Easing.Linear.None, true); 
    }
}