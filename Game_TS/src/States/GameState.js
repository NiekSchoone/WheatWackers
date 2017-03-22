var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameState = (function (_super) {
    __extends(GameState, _super);
    function GameState() {
        _super.apply(this, arguments);
    }
    GameState.prototype.init = function (_username) {
        this.playername = _username;
    };
    GameState.prototype.create = function () {
        var client = this;
        this.game.stage.disableVisibilityChange = true;
        var gridSizeX = 23;
        var gridSizeY = 23;
        this.game.physics.arcade.enable(this);
        this.game.camera.flash(0x000000, 1000);
        this.game.camera.focusOnXY((gridSizeX * 144) / 2, (gridSizeX * 144) / 2);
        this.background = new Phaser.TileSprite(this.game, 0, 0, gridSizeX * 144, gridSizeY * 144, 'background');
        this.background.texture.width = 864;
        this.background.texture.height = 864;
        this.game.add.existing(this.background);
        this.group = new Phaser.Group(this.game);
        this.gamefield = new Grid(this.game, gridSizeX, gridSizeY, function (tiles) {
            for (var i = 0; i < tiles.length; i++) {
                var tile = tiles[i];
                for (var j = 0; j < tile.length; j++) {
                    client.group.add(tile[j].GetSprite());
                    client.group.add(tile[j].GetAnimSprite());
                }
            }
        });
        this.playerManager = new PlayerManager(this.game, this.gamefield, this.group, this.playername);
        this.musicLoop = this.game.add.audio('music_loop', 0.05, true);
        this.musicLoop.play();
    };
    GameState.prototype.update = function () {
        this.group.sort("y", Phaser.Group.SORT_ASCENDING);
    };
    return GameState;
}(Phaser.State));
