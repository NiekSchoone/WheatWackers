var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PickUpType;
(function (PickUpType) {
    PickUpType[PickUpType["treasure"] = 0] = "treasure";
    PickUpType[PickUpType["cow"] = 1] = "cow";
    PickUpType[PickUpType["wateringCan"] = 2] = "wateringCan";
    PickUpType[PickUpType["mouseTrap"] = 3] = "mouseTrap";
    PickUpType[PickUpType["shovel"] = 4] = "shovel";
    PickUpType[PickUpType["tool"] = 5] = "tool";
})(PickUpType || (PickUpType = {}));
var PickUp = (function (_super) {
    __extends(PickUp, _super);
    function PickUp(game, type) {
        _super.call(this, game, 0, 0, '');
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
    PickUp.prototype.activate = function (player) {
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
    };
    return PickUp;
}(Phaser.Sprite));
