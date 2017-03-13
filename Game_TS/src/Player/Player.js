var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="tempgrid.ts" />
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(game) {
        _super.call(this, game, 0, 0, "failguy");
        this.speed = 1000;
        this.moving = false;
        this.position.set(0, 0);
        this.anchor.setTo(0.5);
        this.scale.setTo(0.5);
        this.game = game;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
        this.cursors = game.input.keyboard.createCursorKeys();
    }
    Player.prototype.update = function () {
        if (this.moving == false) {
            if (this.cursors.left.isDown) {
                this.moveTowards(this.x - 100, this.y);
            }
            if (this.cursors.right.isDown) {
                this.moveTowards(this.x + 100, this.y);
            }
            if (this.cursors.down.isDown) {
                this.moveTowards(this.x, this.y + 100);
            }
            if (this.cursors.up.isDown) {
                this.moveTowards(this.x, this.y - 100);
            }
        }
    };
    //100000 - this.speed * 100
    Player.prototype.moveTowards = function (_x, _y) {
        //console.log("x: " + this.x + " y: " + this.y);
        console.log(this.width);
        this.moving = true;
        var tween = this.game.add.tween(this.body).to({ x: _x - this.width / 2, y: _y - this.height / 2 }, this.game.physics.arcade.distanceToXY(this, _x, _y) / this.speed * 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.onComplete, this);
    };
    Player.prototype.onComplete = function () {
        this.moving = false;
    };
    return Player;
})(Phaser.Sprite);
//# sourceMappingURL=Player.js.map