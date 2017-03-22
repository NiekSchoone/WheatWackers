class JoinGameMenu {
    private joinButton: Phaser.Button;
    private userInput: HTMLElement;
    private callback: any;

    constructor(_game: Phaser.Game, callback: (username:string) => any) {
        let xPos = 432 - (_game.cache.getImage("button_join").width / 2);
        let yPos = 500;
        this.joinButton = _game.add.button(xPos, yPos, 'button_join', this.joinGame, this);

        this.createUsernameElement();
        document.body.insertBefore(this.userInput, _game.canvas);

        this.callback = callback;
    }

    private createUsernameElement() {
        this.userInput = document.createElement('input');
        this.userInput.style.right = "50%";
        this.userInput.style.width = "250px";
        this.userInput.style.position = "fixed";
        this.userInput.style.margin = "20% -125px 0px 0px";
        this.userInput.style.display = "block";
    }

    private joinGame(_ip?: string) {
        this.callback(document.getElementsByTagName("input")[0].value);
        this.destroy();
    }

    public destroy() {
        this.joinButton.destroy();
        document.body.removeChild(this.userInput);
        this.userInput = null;
    }
}