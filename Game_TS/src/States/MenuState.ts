class MenuState extends Phaser.State {

    private howToButton: Phaser.Button;
    private joinButton: Phaser.Button;
    private backgroung: Phaser.Sprite;
    private buttonSound: Phaser.Sound;
    private userInput: HTMLElement;
    create() {
        this.game.physics.arcade.enable(this);
        this.game.camera.flash(0x000000, 1000);

        this.backgroung = this.game.add.sprite(0, 0, 'menuBackground');
        this.backgroung.width = this.game.width;
        this.backgroung.height = this.game.height;
        
        this.createUsernameElement();
        document.body.insertBefore(this.userInput, this.game.canvas);

        this.buttonSound = this.game.add.sound("button_sound", 1, false);

        this.joinButton = this.add.button(this.game.world.centerX - 256, 300, 'JoinButton', this.joinButtonDown, this, 0, 1);
        this.howToButton = this.add.button(this.game.world.centerX-256, 500, 'HowToButton', this.howToButtonDown, this, 0, 1);
    }
    private createUsernameElement() {
        this.userInput = document.createElement('input');
        this.userInput.style.right = "50%";
        this.userInput.style.width = "250px";
        this.userInput.style.position = "fixed";
        this.userInput.style.margin = "10% -125px 0px 0px";
        this.userInput.style.display = "block";
    }
    private createButtonDown() {
        
    }
    private howToButtonDown() {
        this.buttonSound.play();
    }
    private joinButtonDown() {
        this.buttonSound.play();

        let client = this;
        this.camera.onFadeComplete.add(function () {
            client.game.state.start("GameState", true, false, document.getElementsByTagName("input")[0].value);
            document.body.removeChild(client.userInput);
        });
        this.game.camera.fade(0x000000, 1000);
    }
}