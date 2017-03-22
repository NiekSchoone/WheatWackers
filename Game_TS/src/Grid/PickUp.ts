enum PickUpType {
    treasure,
    cow,
    wateringCan,
    mouseTrap,
    shovel
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
        }

        this.pickUpType = type;
    }
    
}