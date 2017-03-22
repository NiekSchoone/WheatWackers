declare var SOCKET: Socket;

class Game {

    private game: Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'content', { create: this.create });
    }

    create() {
        this.game.state.add("PreLoader", Preloader, true);
    }
}

window.onload = () => {
    var game = new Game();
};