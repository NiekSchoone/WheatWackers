var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BootState = (function (_super) {
    __extends(BootState, _super);
    function BootState() {
        _super.apply(this, arguments);
    }
    BootState.prototype.preload = function () {
        this.game.load.image('loading', 'assets/images/ui/loading_image.png');
    };
    BootState.prototype.create = function () {
        this.initStates();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.state.start("Preloader");
    };
    BootState.prototype.initStates = function () {
        this.game.state.add("Preloader", Preloader);
        this.game.state.add("MenuState", MenuState);
        this.game.state.add("GameState", GameState);
    };
    return BootState;
}(Phaser.State));
