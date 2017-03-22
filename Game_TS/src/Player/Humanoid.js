var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Humanoid = (function (_super) {
    __extends(Humanoid, _super);
    function Humanoid(game, grid, id, username, x, y, spawnAnim) {
        _super.call(this, game, 0, 0, "player_" + id);
        this.speed = 1000;
        this.grid = grid;
        this.spawnPoint = { x: x, y: y };
        this.username = username;
        this.playerID = id;
        this.spawnAnimation = spawnAnim;
        this.spawnSound = this.game.add.audio('spawn_sound', 1, false);
        this.animations.add("idle", Phaser.ArrayUtils.numberArray(62, 101));
        this.animations.add("walk", Phaser.ArrayUtils.numberArray(0, 30));
        this.animations.play("idle", 24, true);
        this.position.set(grid.getTile(x, y).getX(), grid.getTile(x, y).getY());
        this.anchor.setTo(0.5, 0.75);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
        this.cursorkeys = new Phaser.Key(game, 32);
        this.spawnAnimation.anchor.set(0.5, 0.88);
        this.spawnAnimation.animations.add('spawn', Phaser.ArrayUtils.numberArray(0, 15));
        this.game.add.existing(this.spawnAnimation);
        this.spawnAnimation.animations.play('spawn', 24, false, true);
        this.spawnSound.play();
    }
    Humanoid.prototype.moveTowards = function (x, y) {
        var tile = this.grid.getTile(x, y);
        if (tile.getState() == TileState.WHEAT) {
            this.alpha = 0;
        }
        else {
            this.alpha = 1;
        }
        if (this.x > tile.getX()) {
            this.scale.setTo(-1, 1);
        }
        else if (this.x < tile.getX()) {
            this.scale.setTo(1, 1);
        }
        this.animations.play("walk", 24, true);
        var tween = this.game.add.tween(this.body).to({ x: tile.getX() - Math.abs(this.width) * 0.5, y: tile.getY() - Math.abs(this.height) * 0.75 }, 500, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.onComplete, this);
    };
    Humanoid.prototype.onComplete = function () {
        this.animations.play("idle", 24, true);
    };
    return Humanoid;
}(Phaser.Sprite));
