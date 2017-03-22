class MenuState extends Phaser.State {

    private howToButton: Phaser.Button;
    private joinButton: Phaser.Button;
    private backgroung: Phaser.Sprite;
    create() {
        this.backgroung = this.game.add.sprite(0, 0, 'menuBackground');
        this.backgroung.width = this.game.width;
        this.backgroung.height = this.game.height;
        this.joinButton = this.add.button(this.game.world.centerX-256, 300, 'JoinButton', this.joinButtonDown, this, 0, 1);
        this.howToButton = this.add.button(this.game.world.centerX-256, 500, 'HowToButton', this.howToButtonDown, this, 0, 1);
    }
    private createButtonDown() {
        
    }
    private howToButtonDown() {
    }
    private joinButtonDown() {
        this.game.state.start("GameState", true, false,"sjsjsjsj");
    }
}