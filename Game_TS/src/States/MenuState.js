var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MenuState = (function (_super) {
    __extends(MenuState, _super);
    function MenuState() {
        _super.apply(this, arguments);
    }
    MenuState.prototype.create = function () {
        this.game.physics.arcade.enable(this);
        this.game.camera.flash(0x000000, 1000);
        this.backgroung = this.game.add.sprite(0, 0, 'menuBackground');
        this.backgroung.width = this.game.width;
        this.backgroung.height = this.game.height;
        this.createUsernameElement();
        document.body.insertBefore(this.userInput, this.game.canvas);
        this.buttonSound = this.game.add.sound("button_sound", 1, false);
        this.joinButton = this.add.button(this.game.world.centerX + 100, 250, 'JoinButton', this.joinButtonDown, this, 0, 1);
        this.joinButton.angle = 5;
        this.howToButton = this.add.button(this.game.world.centerX + 100, 450, 'HowToButton', this.howToButtonDown, this, 0, 1);
        this.howToButton.angle = 5;
    };
    MenuState.prototype.createUsernameElement = function () {
        this.userInput = document.createElement('input');
        this.userInput.style.right = "50%";
        this.userInput.style.width = "250px";
        this.userInput.style.position = "fixed";
        this.userInput.style.margin = "10% -125px 0px 0px";
        this.userInput.style.display = "block";
    };
    MenuState.prototype.createButtonDown = function () {
    };
    MenuState.prototype.howToButtonDown = function () {
        this.buttonSound.play();
    };
    MenuState.prototype.joinButtonDown = function () {
        this.buttonSound.play();
        var client = this;
        this.camera.onFadeComplete.add(function () {
            client.game.state.start("GameState", true, false, document.getElementsByTagName("input")[0].value);
            document.body.removeChild(client.userInput);
        });
        this.game.camera.fade(0x000000, 1000);
    };
    return MenuState;
}(Phaser.State));
