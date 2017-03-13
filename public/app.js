class Game {
    constructor() {
        this.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
        SOCKET = io.connect();
        SOCKET.on("player_joined", function (data) {
            this.joinMenu.destroy();
            console.log(data + " has joined");
        });
    }
    preload() {
        this.game.load.image('wheat', 'Images/Wheat.png');
        this.game.load.image('button_join', 'Images/button_join.png');
    }
    create() {
        this.joinMenu = new JoinGameMenu(this.game);
    }
}
window.onload = () => {
    let game = new Game();
};
class JoinGameMenu {
    constructor(game) {
        let xPos = (document.body.clientWidth / 2) - (game.cache.getImage("button_join").width / 2);
        let yPos = document.body.clientHeight / 2;
        this.joinButton = game.add.button(xPos, yPos, 'button_join', this.joinGame, this);
        this.createUsernameElement();
        document.body.insertBefore(this.userInput, game.canvas);
        SOCKET.on("player_joined", this.joinButton.destroy);
    }
    createUsernameElement() {
        this.userInput = document.createElement('input');
        this.userInput.style.right = "50%";
        this.userInput.style.width = "250px";
        this.userInput.style.position = "fixed";
        this.userInput.style.margin = "20% -125px 0px 0px";
        this.userInput.style.display = "block";
    }
    joinGame(ip) {
        //SOCKET = io.connect(ip);
        SOCKET.emit("player_joining", document.getElementsByTagName("input")[0].value);
        //this.destroy();
    }
    destroy() {
        this.joinButton.destroy();
        document.body.removeChild(this.userInput);
        this.userInput = null;
    }
}
//# sourceMappingURL=app.js.map