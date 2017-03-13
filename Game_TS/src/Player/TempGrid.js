var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TempGrid = (function (_super) {
    __extends(TempGrid, _super);
    function TempGrid(game) {
        _super.call(this, game, 0, 0);
        this.anchor.setTo(0.5);
        this.scale.set(0.25);
        this.createGrid();
    }
    TempGrid.prototype.createGrid = function () {
        this.rows = new Array();
        for (var i = 0; i < 3; i++) {
            var row = new Array();
            for (var k = 0; k < 3; k++) {
                var tile = new TempTile(this.game);
                tile.x = tile.width * k;
                tile.y = tile.height * i;
                this.addChild(tile);
                row.push(tile);
            }
            this.rows.push(row);
        }
    };
    return TempGrid;
})(Phaser.Sprite);
//# sourceMappingURL=TempGrid.js.map