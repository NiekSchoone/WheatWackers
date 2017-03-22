declare var SOCKET: Socket;

class Game {

    private game: Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'content', { create: this.create });
        this.game.stage = new Phaser.Stage(this.game);

        SOCKET = io.connect();
    }

    create() {
        this.game.state.add("BootState", BootState, true);
    }
}

window.onload = () => {
    var game = new Game();
};