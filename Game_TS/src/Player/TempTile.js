var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TempTile = (function (_super) {
    __extends(TempTile, _super);
    function TempTile(game) {
        _super.call(this, game, 0, 0);
        this.game = game;
        this.createImage();
    }
    TempTile.prototype.createImage = function () {
        var image = this.addChild(this.game.make.sprite(0, 0, "grass"));
        this.anchor.set(0.5, 0.5);
        this.resizeFrame(this, this.game.cache.getImage("grass").width, this.game.cache.getImage("grass").height);
    };
    return TempTile;
})(Phaser.Sprite);
//# sourceMappingURL=TempTile.js.map