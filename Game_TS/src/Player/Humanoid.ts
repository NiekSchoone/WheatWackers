class Humanoid extends Phaser.Sprite
{
    speed: number = 1000;
    constructor(game : Phaser.Game)
    {
        super(game, 0, 0, "failguy");
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
    }

    public moveTowards(x: number, y: number)
    {
        var tween: Phaser.Tween = this.game.add.tween(this.body).to({ x: x - this.width / 2, y: y - this.height / 2 }, this.game.physics.arcade.distanceToXY(this, x, y) / this.speed * 1000, Phaser.Easing.Linear.None, true); 
    }
}