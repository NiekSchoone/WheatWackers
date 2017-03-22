var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Trap = (function (_super) {
    __extends(Trap, _super);
    function Trap(game, trapTime) {
        if (trapTime === void 0) { trapTime = 0; }
        _super.call(this, game, 0, 0, "");
        this.trapTime = trapTime;
        this.anchor.set(0.5);
        if (trapTime == 0) {
            this.loadTexture("pitTrap");
        }
        else {
            this.loadTexture("mouseTrap");
        }
    }
    Trap.prototype.activateTrap = function (target) {
        if (this.trapTime != 0) {
            target.getTrapped(this.trapTime);
        }
        else {
            target.respawn();
        }
    };
    return Trap;
}(Phaser.Sprite));
