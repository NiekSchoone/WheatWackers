class PickUp extends Phaser.Sprite
{
    public pickUpType: string;
    constructor(game: Phaser.Game, type: string)
    {
        super(game, 0, 0, '');
        this.anchor.set(0.5);
                        
        if (type == "treasure")
        {
            this.loadTexture("treasure");
        }
        else if (type == "cow")
        {
            this.loadTexture("cowPickUp");
        }
        else if (type == "mouseTrap")
        {
            this.loadTexture("mousePickUp");
        }
        else if (type == "pitTrap")
        {
            this.loadTexture("pitPickUp");
        }
        else if (type == "sickle")
        {
            this.loadTexture("sicklePickUp");
        }

        this.pickUpType = type;
    } 

    public activate(player:Player)
    {
        if (this.pickUpType == 'treasure')
        {
            player.pickUpTreasure();
        }
        else if (this.pickUpType == "cow")
        {
            player.speed += 500;
        }
        else if (this.pickUpType == "mouseTrap")
        {
            player.hasMouseTrap = true;
        }
        else if (this.pickUpType == "pitTrap")
        {
            player.hasPitTrap = true;
        }
        else if (this.pickUpType == "sickle")
        {
            player.holdingTool = true;                                         
        }

    }
}