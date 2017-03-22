enum PickUpType {
    treasure,
    cow,
    wateringCan,
    mouseTrap,
    shovel,
    tool
}
class PickUp extends Phaser.Sprite
{
    public pickUpType: PickUpType;
    constructor(game: Phaser.Game, type: PickUpType)
    {
        super(game, 0, 0, '');

        switch (type) {
            case PickUpType.treasure:
                this.loadTexture('treasure');
                break;
            case PickUpType.cow:
                this.loadTexture('PickUp_Cow');
                break;
            case PickUpType.wateringCan:
                this.loadTexture('PickUp_WaterCan');
                break;
            case PickUpType.shovel:
                this.loadTexture('PickUp_Shovel');
                break;
            case PickUpType.mouseTrap:
                this.loadTexture('PickUp_MouseTrap');
                break;
            case PickUpType.tool:
                this.loadTexture('PickUp_tool');
                break;
        }

        this.pickUpType = type;
        this.anchor.set(0.5);
    } 

    public activate(player:Player)
    {
        switch (this.pickUpType) {
            case PickUpType.treasure:
                player.pickUpTreasure();
                break;
            case PickUpType.cow:
                player.speed += 500;
                break;
            case PickUpType.tool:
                player.holdingTool = true;   
                break;
            case PickUpType.shovel:
                player.hasPitTrap = true;
                break;
            case PickUpType.mouseTrap:
                player.hasMouseTrap = true;
                break;
        }
    }
}