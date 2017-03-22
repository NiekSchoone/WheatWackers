class PickUp extends Phaser.Sprite
{
    public pickUpType: string;
    constructor(game: Phaser.Game, type: string)
    {
        super(game, 0, 0, '');

        if (type == "treasure")
        {
            this.loadTexture('treasure');     
        }

        this.pickUpType = type;
    } 
}