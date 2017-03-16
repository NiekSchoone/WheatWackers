class Game {
    constructor() {
        this.game = new Phaser.Game(document.body.clientWidth, document.body.clientHeight, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
        SOCKET = io.connect();
    }
    preload() {
        this.game.load.image('background', 'assets/images/level/background.jpg');
        this.game.load.image('wheat_1', 'assets/images/level/wheat_01.png');
        this.game.load.image('wheat_2', 'assets/images/level/wheat_02.png');
        this.game.load.image('wheat_3', 'assets/images/level/wheat_03.png');
        this.game.load.image('wheat_4', 'assets/images/level/wheat_04.png');
        this.game.load.image('wheat_5', 'assets/images/level/wheat_05.png');
        this.game.load.image('wheat_cut_1', 'assets/images/level/wheat_cut_01.png');
        this.game.load.image('wheat_cut_2', 'assets/images/level/wheat_cut_02.png');
        this.game.load.image('wheat_cut_3', 'assets/images/level/wheat_cut_03.png');
        this.game.load.image('obstacle_1', 'assets/images/level/obstacle_01.png');
        this.game.load.image('obstacle_2', 'assets/images/level/obstacle_02.png');
        this.game.load.image('obstacle_3', 'assets/images/level/obstacle_03.png');
        this.game.load.image('button_join', 'assets/images/ui/button_join.png');
    }
    create() {
        this.background = new Phaser.TileSprite(this.game, 0, 0, 1000, 1000, 'background');
        this.background.texture.width = 864;
        this.background.texture.height = 864;
        this.game.add.existing(this.background);
        this.grid = new Grid(this.game);
        this.grid.generateGrid(8, 12);
        this.joinMenu = new JoinGameMenu(this.game);
        let _client = this;
        SOCKET.on("player_joined", function (data) {
            let newPlayer = new Player(_client.game, _client.grid, data);
            _client.game.add.existing(newPlayer);
            //_client.players.push(newPlayer);
            console.log(newPlayer);
        });
        /*
        this.player = new Player(this.game, this.grid, "username");
        this.game.add.existing(this.player);
        this.players.push(this.player);
        */
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
        this.tiles = [];
        for (let x = 0; x < this.gridWidth; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < this.gridHeight; y++) {
                let newTile = new Tile(this.game, x, y);
                newTile.setTile((Math.floor(Math.random() * 4)));
                this.tiles[x][y] = newTile;
            }
        }
        this.tileSize = this.tiles[0][0].tileSize;
    }
    // get tile at player coordinate +/- directionX and directionY on grid coordinate 
    getTileAtPlayer(playerX, playerY, directionX, directionY) {
        playerX -= (this.tileSize / 2);
        playerX = playerX / this.tileSize;
        playerX += directionX;
        playerY -= (this.tileSize / 2);
        playerY = playerY / this.tileSize;
        playerY += directionY;
        if ((playerX > this.tiles.length - 1 || playerX < 0) || (playerY > this.tiles[0].length - 1 || playerY < 0)) {
            return null;
        }
        else {
            return this.tiles[playerX][playerY];
        }
    }
    // get tile at grid coordinate 
    getTile(_x, _y) {
        return this.tiles[_x][_y];
    }
    getGridWidth() { return this.gridWidth; }
    getGridHeight() { return this.gridHeight; }
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
    //Set whether or not the grass is cut
    setTile(_newState) {
        if (_newState != this.currentState) {
            switch (_newState) {
                case TileState.NONE:
                    this.currentSprite.loadTexture('');
                    break;
                case TileState.WHEAT:
                    this.currentSprite.loadTexture('wheat_' + this.getRandomNumber(5));
                    break;
                case TileState.CUT:
                    this.currentSprite.loadTexture('wheat_cut_' + this.getRandomNumber(3));
                    break;
                case TileState.OBSTACLE:
                    this.currentSprite.loadTexture('obstacle_' + this.getRandomNumber(3));
                    break;
            }
            this.currentState = _newState;
        }
    }
    getRandomNumber(_range) {
        return Math.floor(Math.random() * _range) + 1;
    }
    // world X coordinates
    getX() {
        return this.xPos * this.tileSize + (this.tileSize / 2);
    }
    // world Y coordinates
    getY() {
        return this.yPos * this.tileSize + (this.tileSize / 2);
    }
    // is occupied by wheat
    getState() {
        return this.currentState;
    }
}
class JoinGameMenu {
    constructor(_game) {
        let xPos = (document.body.clientWidth / 2) - (_game.cache.getImage("button_join").width / 2);
        let yPos = document.body.clientHeight / 2;
        this.joinButton = _game.add.button(xPos, yPos, 'button_join', this.joinGame, this);
        this.createUsernameElement();
        document.body.insertBefore(this.userInput, _game.canvas);
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
    constructor(_game, _grid, username) {
        super(_game, 0, 0);
        this.speed = 1000;
        this.moving = false;
        this.game = _game;
        this.grid = _grid;
        this.loadTexture('button_join');
        this.position.set(this.grid.getTile(0, 0).getX(), this.grid.getTile(0, 0).getY());
        this.anchor.setTo(0.5);
        this.moveDistance = this.grid.tileSize;
        this.scale.setTo(1);
        this.username = username;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.enable(this);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.cursors.up.onDown.add(this.moveUpwards, this);
        this.cursors.down.onDown.add(this.moveDownwards, this);
        this.cursors.left.onDown.add(this.moveLeft, this);
        this.cursors.right.onDown.add(this.moveRight, this);
    }
    moveUpwards() {
        var tile = this.grid.getTileAtPlayer(this.x, this.y, 0, -1);
        this.moveTowards(this.x, this.y - this.moveDistance, tile);
    }
    moveDownwards() {
        var tile = this.grid.getTileAtPlayer(this.x, this.y, 0, 1);
        this.moveTowards(this.x, this.y + this.moveDistance, tile);
    }
    moveLeft() {
        var tile = this.grid.getTileAtPlayer(this.x, this.y, -1, 0);
        this.moveTowards(this.x - this.moveDistance, this.y, tile);
    }
    moveRight() {
        var tile = this.grid.getTileAtPlayer(this.x, this.y, 1, 0);
        this.moveTowards(this.x + this.moveDistance, this.y, tile);
    }
    moveTowards(_x, _y, tile) {
        if (tile) {
            var tileState = tile.getState();
            if (tileState == TileState.CUT || tileState == TileState.NONE) {
                this.moving = true;
                var tween = this.game.add.tween(this.body).to({ x: _x - this.width / 2, y: _y - this.height / 2 }, this.game.physics.arcade.distanceToXY(this, _x, _y) / this.speed * 1000, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.onComplete, this);
            }
            else if (true) {
            }
        }
    }
    cutWheat() {
    }
    onComplete() {
        this.moving = false;
    }
}
//# sourceMappingURL=app.js.map