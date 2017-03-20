class Game {
    constructor() {
        this.game = new Phaser.Game(864, 864, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
        this.game.stage = new Phaser.Stage(this.game);
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
        this.game.stage.disableVisibilityChange = true;
        this.background = new Phaser.TileSprite(this.game, 0, 0, 3024, 3024, 'background');
        this.background.texture.width = 864;
        this.background.texture.height = 864;
        this.game.add.existing(this.background);
        let gridSizeX = 21;
        let gridSizeY = 21;
        this.grid = new Grid(this.game, gridSizeX, gridSizeY);
        this.playerManager = new PlayerManager(this.game, this.grid);
    }
}
window.onload = () => {
    var game = new Game();
};
class Grid {
    constructor(_game, _gridWidth, _gridHeight) {
        this.game = _game;
        this.gridWidth = _gridWidth;
        this.gridHeight = _gridHeight;
        this.spawnAreaSize = 2;
        this.tileSize = 144;
        let client = this;
        SOCKET.on("create_grid", function () {
            client.generateGrid();
            let serverData = [];
            for (var x = 0; x < client.gridWidth; x++) {
                serverData[x] = [];
                for (var y = 0; y < client.gridHeight; y++) {
                    serverData[x][y] = client.getTile(x, y).getState();
                }
            }
            SOCKET.emit("grid_created", serverData);
        });
        SOCKET.on("init_grid", function (gridData) {
            client.generateGridFromServer(gridData);
        });
        SOCKET.on("wheat_cutted", function (tilePos) {
            client.getTile(tilePos.x, tilePos.y).setTile(TileState.CUT);
        });
    }
    generateGrid() {
        this.tiles = [];
        let midSizeX = Math.floor(this.gridWidth / 2);
        let midSizeY = Math.floor(this.gridHeight / 2);
        this.obstacleDensity = 20;
        for (let x = 0; x < this.gridWidth; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < this.gridHeight; y++) {
                let newTile = new Tile(this.game, x, y);
                if (x < midSizeX + this.spawnAreaSize && x > (midSizeX - this.spawnAreaSize) && y < midSizeY + this.spawnAreaSize && y > (midSizeY - this.spawnAreaSize)) {
                    newTile.setTile(TileState.CUT);
                    newTile.setZLayer(y * 3);
                }
                else if (Math.random() * 100 < this.obstacleDensity) {
                    newTile.setTile(TileState.OBSTACLE);
                    newTile.setZLayer((y * 3) - 1);
                }
                else {
                    newTile.setTile(TileState.WHEAT);
                    newTile.setZLayer(y * 3);
                }
                this.tiles[x][y] = newTile;
            }
        }
    }
    generateGridFromServer(gridData) {
        this.tiles = [];
        for (let x = 0; x < this.gridWidth; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < this.gridHeight; y++) {
                let newTile = new Tile(this.game, x, y);
                newTile.setTile(gridData[x][y]);
                this.tiles[x][y] = newTile;
            }
        }
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
    getAllTiles() {
        return this.tiles;
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
    setZLayer(layer) {
        this.currentSprite.z = layer;
    }
    GetSprite() {
        return this.currentSprite;
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
    getGridPosX() { return this.xPos; }
    getGridPosY() { return this.yPos; }
    // is occupied by wheat
    getState() {
        return this.currentState;
    }
}
class JoinGameMenu {
    constructor(_game, callback) {
        let xPos = 432 - (_game.cache.getImage("button_join").width / 2);
        let yPos = 500;
        this.joinButton = _game.add.button(xPos, yPos, 'button_join', this.joinGame, this);
        this.createUsernameElement();
        document.body.insertBefore(this.userInput, _game.canvas);
        this.callback = callback;
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
        this.callback(document.getElementsByTagName("input")[0].value);
        this.destroy();
        //return document.getElementsByTagName("input")[0].value;
        //SOCKET.emit("joined", { username: document.getElementsByTagName("input")[0].value });
    }
    destroy() {
        this.joinButton.destroy();
        document.body.removeChild(this.userInput);
        this.userInput = null;
    }
}
class Humanoid extends Phaser.Sprite {
    constructor(game, grid, username, x, y) {
        super(game, 0, 0, "failguy");
        this.speed = 1000;
        this.grid = grid;
        this.username = username;
        this.position.set(grid.getTile(x, y).getX(), grid.getTile(x, y).getY());
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
        this.anchor.setTo(0.5);
        this.cursorkeys = new Phaser.Key(game, 32);
    }
    moveTowards(x, y) {
        var tile = this.grid.getTile(x, y);
        var tween = this.game.add.tween(this.body).to({ x: tile.getX() - this.width / 2, y: tile.getY() - this.height / 2 }, 500, Phaser.Easing.Linear.None, true);
    }
    getCurrentTile() {
        return this.grid.getTile(this.x, this.y);
    }
}
class Player extends Phaser.Sprite {
    constructor(game, grid, username, spawnPoint) {
        super(game, 0, 0, "failguy");
        this.speed = 5000;
        this.moving = false;
        this.cutting = false;
        this.cutTime = 1000;
        this.holdingTool = true;
        this.game = game;
        this.grid = grid;
        this.username = username;
        this.position.set(grid.getTile(spawnPoint.x, spawnPoint.y).getX(), grid.getTile(spawnPoint.x, spawnPoint.y).getY());
        this.anchor.setTo(0.5);
        this.moveDistance = this.grid.tileSize;
        this.scale.setTo(1);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
        this.cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(this);
        game.camera.focusOnXY(this.x, this.y);
        game.world.setBounds(0, 0, 3024, 3024);
    }
    update() {
        if (this.cursors.up.isDown) {
            this.moveUpwards();
        }
        else if (this.cursors.down.isDown) {
            this.moveDownwards();
        }
        else if (this.cursors.left.isDown) {
            this.moveLeft();
        }
        else if (this.cursors.right.isDown) {
            this.moveRight();
        }
        if (this.cutting == true) {
            if (this.moving == true) {
                this.cutting = false;
            }
        }
    }
    moveUpwards() {
        if (this.moving == false) {
            this.moveTowards(0, -1);
        }
    }
    moveDownwards() {
        if (this.moving == false) {
            this.moveTowards(0, 1);
        }
    }
    moveLeft() {
        if (this.moving == false) {
            this.moveTowards(-1, 0);
        }
    }
    moveRight() {
        if (this.moving == false) {
            this.moveTowards(1, 0);
        }
    }
    moveTowards(_x, _y) {
        var tile = this.grid.getTileAtPlayer(this.x, this.y, _x, _y);
        if (tile && this.moving == false) {
            var tileState = tile.getState();
            if (tileState == TileState.CUT || tileState == TileState.NONE) {
                this.moving = true;
                var tween = this.game.add.tween(this.body).to({ x: tile.getX() - this.width / 2, y: tile.getY() - this.height / 2 }, 500, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.onComplete, this);
                SOCKET.emit("player_move", { player: this.username, x: tile.getGridPosX(), y: tile.getGridPosY() });
            }
            else if (tileState == TileState.WHEAT) {
                this.cutting = true;
                this.game.time.events.add(this.cutTime, this.cutWheat, this, tile);
            }
        }
    }
    cutWheat(tile) {
        if (this.cutting == true) {
            tile.setTile(TileState.CUT);
            this.onComplete();
            this.cutting = false;
            SOCKET.emit("wheat_cut", { x: tile.getGridPosX(), y: tile.getGridPosY() });
        }
    }
    onComplete() {
        this.moving = false;
    }
}
class PlayerManager {
    constructor(_game, _grid) {
        this.game = _game;
        this.grid = _grid;
        this.opponents = [];
        this.spawnPoints = [{ x: 10, y: 9 }, { x: 9, y: 10 }, { x: 10, y: 11 }, { x: 11, y: 10 }];
        this.createEvents();
        SOCKET.emit("join_ready");
    }
    createPlayer(_username, _spawnPoint) {
        this.player = new Player(this.game, this.grid, _username, _spawnPoint);
        this.game.add.existing(this.player);
    }
    createOpponent(playerData) {
        let newOpponent = new Humanoid(this.game, this.grid, playerData.username, playerData.x, playerData.y);
        this.opponents.push(newOpponent);
        this.game.add.existing(newOpponent);
        console.log(playerData.username + " joined as a new opponent");
    }
    removeOpponent(_username) {
        let opponentToRemove = this.getOpponentByName(_username);
        this.opponents.splice(this.opponents.indexOf(opponentToRemove), 1);
        opponentToRemove.destroy();
    }
    moveOpponent(moveData) {
        let opponent = this.getOpponentByName(moveData.player);
        opponent.moveTowards(moveData.x, moveData.y);
    }
    createJoinWindow() {
        let client = this;
        let joinWindow = new JoinGameMenu(this.game, function (username) {
            let spawnPoint = client.spawnPoints[client.opponents.length];
            SOCKET.emit("joined", { username: username, x: spawnPoint.x, y: spawnPoint.y });
        });
    }
    createEvents() {
        let client = this;
        SOCKET.on("join_game", client.createJoinWindow.bind(this));
        SOCKET.on("init_player", function (playerData) {
            client.createPlayer(playerData.username, { x: playerData.x, y: playerData.y });
        });
        SOCKET.on("init_opponents", function (opponents) {
            for (let i = 0; i < opponents.length; i++) {
                client.createOpponent(opponents[i]);
            }
        });
        SOCKET.on("player_joined", function (data) {
            client.createOpponent(data);
        });
        SOCKET.on("player_disconnected", function (player) {
            client.removeOpponent(player);
        });
        SOCKET.on("player_moving", function (data) {
            client.moveOpponent(data);
        });
    }
    getOpponentByName(username) {
        for (let i = 0; i < this.opponents.length; i++) {
            if (this.opponents[i].username == username) {
                return this.opponents[i];
            }
        }
    }
    getOpenSpawn() {
    }
}
//# sourceMappingURL=app.js.map