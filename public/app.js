class Game {
    constructor() {
        this.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
        /*SOCKET.on("player_joined", function (data) {
            console.log(data + " has joined");
        });*/
    }
    preload() {
        this.game.load.image('background', 'Images/background.png');
        this.game.load.image('wheat_1', 'Images/wheat_01.png');
        this.game.load.image('wheat_2', 'Images/wheat_02.png');
        this.game.load.image('wheat_3', 'Images/wheat_03.png');
        this.game.load.image('wheat_4', 'Images/wheat_04.png');
        this.game.load.image('wheat_5', 'Images/wheat_05.png');
        this.game.load.image('wheat_cut', 'Images/wheat_cut.png');
        this.game.load.image('button_join', 'Images/button_join.png');
    }
    create() {
        this.background = new Phaser.TileSprite(this.game, 0, 0, 864, 864, 'background');
        this.game.add.existing(this.background);
        this.grid = new Grid(this.game);
        this.grid.generateGrid(6, 6);
        this.player = new Player(this.game);
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
                newTile.setTile(1);
                this.Tiles[x][y] = newTile;
            }
        }
    }
    getTile(_x, _y) {
        return this.Tiles[_x][_y];
    }
}
var TileState;
(function (TileState) {
    TileState[TileState["NONE"] = 0] = "NONE";
    TileState[TileState["WHEAT"] = 1] = "WHEAT";
    TileState[TileState["CUT"] = 2] = "CUT";
    TileState[TileState["OBSTACLE"] = 3] = "OBSTACLE";
})(TileState || (TileState = {}));
class Tile {
    constructor(_game, _x, _y) {
        this.game = _game;
        this.xPos = _x;
        this.yPos = _y;
        this.tileSize = 144;
        this.spriteSize = 256;
        let spriteOffsetX = (this.spriteSize - this.tileSize) / 2;
        let spriteOffsetY = this.spriteSize - this.tileSize;
        this.currentSprite = new Phaser.Sprite(this.game, (this.xPos * this.tileSize) - spriteOffsetX, (this.yPos * this.tileSize) - spriteOffsetY);
        this.currentState = TileState.NONE;
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
    GetState() {
        return this.currentState;
    }
    //Set whether or not the grass is cut
    setTile(newState) {
        if (newState != this.currentState) {
            switch (newState) {
                case TileState.NONE:
                    this.currentSprite.loadTexture('');
                    break;
                case TileState.WHEAT:
                    this.currentSprite.loadTexture('wheat_1');
                    break;
                case TileState.CUT:
                    this.currentSprite.loadTexture('wheat_cut');
                    break;
                case TileState.OBSTACLE:
                    this.currentSprite.loadTexture('obstacle');
                    break;
            }
            this.currentState = newState;
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
class Player extends Phaser.Sprite {
    constructor(game) {
        super(game, 0, 0, "failguy");
        this.speed = 1000;
        this.moving = false;
        this.position.set(0, 0);
        this.anchor.setTo(0.5);
        this.scale.setTo(0.5);
        this.game = game;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
        this.cursors = game.input.keyboard.createCursorKeys();
    }
    update() {
        if (this.moving == false) {
            if (this.cursors.left.isDown) {
                this.moveTowards(this.x - 100, this.y);
            }
            if (this.cursors.right.isDown) {
                this.moveTowards(this.x + 100, this.y);
            }
            if (this.cursors.down.isDown) {
                this.moveTowards(this.x, this.y + 100);
            }
            if (this.cursors.up.isDown) {
                this.moveTowards(this.x, this.y - 100);
            }
        }
    }
    //100000 - this.speed * 100
    moveTowards(_x, _y) {
        //console.log("x: " + this.x + " y: " + this.y);
        console.log(this.width);
        this.moving = true;
        var tween = this.game.add.tween(this.body).to({ x: _x - this.width / 2, y: _y - this.height / 2 }, this.game.physics.arcade.distanceToXY(this, _x, _y) / this.speed * 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.onComplete, this);
    }
    onComplete() {
        this.moving = false;
    }
}
//# sourceMappingURL=app.js.map