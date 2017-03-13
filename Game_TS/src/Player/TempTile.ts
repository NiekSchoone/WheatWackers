class TempTile extends Phaser.Sprite
{
    game : Phaser.Game
    constructor(game: Phaser.Game)
    {
        super(game, 0, 0);
        this.game = game;
        this.createImage();
    }

    createImage()
    {
        var image = this.addChild(this.game.make.sprite(0, 0, "grass"));
        this.anchor.set(0.5, 0.5);
        this.resizeFrame(this, this.game.cache.getImage("grass").width, this.game.cache.getImage("grass").height);
    }
}