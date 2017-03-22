class MenuState extends Phaser.State {

    private howToButton: Phaser.Button;
    private joinButton: Phaser.Button;
    private backgroung: Phaser.Sprite;
    private userInput: HTMLElement;
    create() {
        this.backgroung = this.game.add.sprite(0, 0, 'menuBackground');
        this.backgroung.width = this.game.width;
        this.backgroung.height = this.game.height;
        
        //this.createUsernameElement();
        //document.body.insertBefore(this.userInput, this.game.canvas);
   
        this.joinButton = this.add.button(this.game.world.centerX + 100, 250, 'JoinButton', this.joinButtonDown, this, 0, 1);
        this.joinButton.angle = 5;
        this.howToButton = this.add.button(this.game.world.centerX + 100, 450, 'HowToButton', this.howToButtonDown, this, 0, 1);
        this.howToButton.angle = 5;
    }
    private createUsernameElement() {
        this.userInput = document.createElement('input');
        this.userInput.style.right = "50%";
        this.userInput.style.width = "250px";
        this.userInput.style.position = "fixed";
        this.userInput.style.margin = "20% -125px 0px 0px";
        this.userInput.style.display = "block";
    }
    private createButtonDown() {
        
    }
    private howToButtonDown() {
    }
    private joinButtonDown() {
        this.game.state.start("GameState", true, false, "hi");
    }
}