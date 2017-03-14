class Game {
    constructor() {
        this.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
        /*SOCKET.on("player_joined", function (data) {
            console.log(data + " has joined");
        });*/
    }
    preload() {
        this.game.load.image('wheat', 'Images/wheat_01.png');
        this.game.load.image('wheat_cut', 'Images/wheat_cut.png');
        this.game.load.image('button_join', 'Images/button_join.png');
    }
    create() {
        this.grid = new Grid(this.game);
        this.grid.generateGrid(12, 12);
        var tileToCut = this.grid.getTile(3, 3).setTile(false);
    }
}
window.onload = () => {
    var game = new Game();
};
class Grid {
    constructor(_game) {
        this.game = _game;
    }
    generateGrid(_gridWidth, _gridHeight) {
        this.gridWidth = _gridWidth;
        this.gridHeight = _gridHeight;
        this.Tiles = [];
        for (let x = 0; x < this.gridWidth; x++) {
            this.Tiles[x] = [];
            for (let y = 0; y < this.gridHeight; y++) {
                let newTile = new Tile(this.game, x, y);
                //newTile.setTile(true);
                this.Tiles[x][y] = newTile;
            }
        }
    }
    getTile(_x, _y) {
        return this.Tiles[_x][_y];
    }
}
class Tile {
    constructor(_game, _x, _y) {
        this.hasWheat = true;
        this.game = _game;
        this.xPos = _x;
        this.yPos = _y;
        this.tileSize = this.game.cache.getImage('wheat').width;
        this.currentSprite = new Phaser.Sprite(this.game, this.xPos * this.tileSize, this.yPos * this.tileSize);
        this.currentSprite.loadTexture('wheat');
        this.game.add.existing(this.currentSprite);
    }
    // world X coordinates
    getX() {
        return this.xPos * this.tileSize;
    }
    // world Y coordinates
    getY() {
        return this.yPos * this.tileSize;
    }
    // is occupied by wheat
    HasWheat() {
        return this.hasWheat;
    }
    //Set whether or not the grass is cut
    setTile(_hasWheat) {
        if (_hasWheat != this.hasWheat) {
            this.hasWheat = _hasWheat;
            if (this.hasWheat) {
                this.currentSprite.loadTexture('wheat');
            }
            else {
                this.currentSprite.loadTexture('wheat_cut');
            }
        }
    }
}
class JoinGameMenu {
    constructor(_game) {
        let xPos = (document.body.clientWidth / 2) - (_game.cache.getImage("button_join").width / 2);
        let yPos = document.body.clientHeight / 2;
        this.joinButton = _game.add.button(xPos, yPos, 'button_join', this.joinGame, this);
        this.createUsernameElement();
        document.body.insertBefore(this.userInput, _game.canvas);
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
    joinGame(_ip) {
        //SOCKET = io.connect(ip);
        SOCKET.emit("player_joining", document.getElementsByTagName("input")[0].value);
        this.destroy();
    }
    destroy() {
        this.joinButton.destroy();
        document.body.removeChild(this.userInput);
        this.userInput = null;
    }
}
//# sourceMappingURL=app.js.map