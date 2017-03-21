class Game {
    constructor() {
        this.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
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
        this.game.load.spritesheet('player_0', 'assets/spritesheets/player_1.png', 150, 150);
        this.game.load.spritesheet('player_1', 'assets/spritesheets/player_2.png', 150, 150);
        this.game.load.spritesheet('player_2', 'assets/spritesheets/player_3.png', 150, 150);
        this.game.load.spritesheet('player_3', 'assets/spritesheets/player_4.png', 150, 150);
    }
    create() {
        this.game.stage.disableVisibilityChange = true;
        this.background = new Phaser.TileSprite(this.game, 0, 0, 3024, 3024, 'background');
        this.background.texture.width = 864;
        this.background.texture.height = 864;
        this.game.add.existing(this.background);
        this.group = new Phaser.Group(this.game);
        let gridSizeX = 21;
        let gridSizeY = 21;
        let client = this;
        this.grid = new Grid(this.game, gridSizeX, gridSizeY, function (tiles) {
            for (let i = 0; i < tiles.length; i++) {
                let tile = tiles[i];
                for (let j = 0; j < tile.length; j++) {
                    client.group.add(tile[j].GetSprite());
                }
            }
        });
        this.playerManager = new PlayerManager(this.game, this.grid, this.group);
    }
    update() {
        this.group.sort("y", Phaser.Group.SORT_ASCENDING);
    }
}
window.onload = () => {
    var game = new Game();
};
class Grid {
    constructor(_game, _gridWidth, _gridHeight, callback) {
        this.game = _game;
        this.gridWidth = _gridWidth;
        this.gridHeight = _gridHeight;
        this.spawnAreaSize = 2;
        this.tileSize = 144;
        this.callBack = callback;
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
        this.callBack(this.tiles);
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
        this.callBack(this.tiles);
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
class PickUp {
    constructor(name) {
        this.pickUpType = name;
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
        this.hasPickUp = false;
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
    getHasPickUp() {
        return this.hasPickUp;
    }
    getPickUp() {
        let p = this.pickUp;
        this.pickUp = null;
        this.hasPickUp = false;
        return p;
    }
    setPickUp(_pickUp) {
        this.pickUp = _pickUp;
        this.hasPickUp = true;
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
    constructor(game, grid, id, username, x, y) {
        super(game, 0, 0, "player_" + id);
        this.speed = 1000;
        this.grid = grid;
        this.spawnPoint = { x: x, y: y };
        this.username = username;
        this.playerID = id;
        this.animations.add("idle", Phaser.ArrayUtils.numberArray(62, 101));
        this.animations.add("walk", Phaser.ArrayUtils.numberArray(0, 30));
        this.animations.play("idle", 24, true);
        this.position.set(grid.getTile(x, y).getX(), grid.getTile(x, y).getY());
        this.anchor.setTo(0.5, 0.75);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
        this.cursorkeys = new Phaser.Key(game, 32);
    }
    moveTowards(x, y) {
        var tile = this.grid.getTile(x, y);
        if (this.x > tile.getX()) {
            this.scale.setTo(-1, 1);
        }
        else if (this.x < tile.getX()) {
            this.scale.setTo(1, 1);
        }
        var tween = this.game.add.tween(this.body).to({ x: tile.getX() - Math.abs(this.width) * 0.5, y: tile.getY() - Math.abs(this.height) * 0.75 }, 500, Phaser.Easing.Linear.None, true);
        this.animations.play("walk", 24, true);
    }
}
class Player extends Phaser.Sprite {
    constructor(game, grid, id, username, spawnPoint) {
        super(game, 0, 0, "player_" + id);
        this.speed = 5000;
        this.moving = false;
        this.holdingKey = false;
        this.cutting = false;
        this.cutTime = 1000;
        this.holdingTool = true;
        this.game = game;
        this.grid = grid;
        this.playerID = id;
        this.username = username;
        this.spawnPoint = spawnPoint;
        this.animations.add("idle", Phaser.ArrayUtils.numberArray(62, 101));
        this.animations.add("walk", Phaser.ArrayUtils.numberArray(0, 30));
        this.animations.add("cut", Phaser.ArrayUtils.numberArray(162, 175));
        this.animations.play("idle", 24, true);
        this.position.set(grid.getTile(spawnPoint.x, spawnPoint.y).getX(), grid.getTile(spawnPoint.x, spawnPoint.y).getY());
        this.anchor.setTo(0.5, 0.75);
        this.moveDistance = this.grid.tileSize;
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
            this.holdingKey = true;
        }
        else if (this.cursors.down.isDown) {
            this.moveDownwards();
            this.holdingKey = true;
        }
        else if (this.cursors.left.isDown) {
            this.moveLeft();
            this.holdingKey = true;
        }
        else if (this.cursors.right.isDown) {
            this.moveRight();
            this.holdingKey = true;
        }
        else {
            this.holdingKey = false;
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
            this.scale.setTo(-1, 1);
            this.moveTowards(-1, 0);
        }
    }
    moveRight() {
        if (this.moving == false) {
            this.scale.setTo(1, 1);
            this.moveTowards(1, 0);
        }
    }
    moveTowards(_x, _y) {
        var tile = this.grid.getTileAtPlayer(this.x, this.y, _x, _y);
        console.log(this.z);
        console.log(tile.GetSprite().z);
        if (tile && this.moving == false) {
            var tileState = tile.getState();
            if (tileState == TileState.CUT || tileState == TileState.NONE) {
                this.moving = true;
                var tween = this.game.add.tween(this.body).to({ x: tile.getX() - Math.abs(this.width) * 0.5, y: tile.getY() - Math.abs(this.height) * 0.75 }, 500, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.onComplete, this);
                this.animations.play("walk", 24, true);
                SOCKET.emit("player_move", { player: this.username, x: tile.getGridPosX(), y: tile.getGridPosY() });
            }
            else if (tileState == TileState.WHEAT) {
                this.moving = false;
                this.animations.play("cut", 24, true);
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
        if (this.holdingKey == false) {
            this.animations.play("idle", 24, true);
        }
        this.moving = false;
    }
}
class PlayerManager {
    constructor(_game, _grid, _group) {
        this.game = _game;
        this.grid = _grid;
        this.opponents = [];
        this.players = [null, null, null, null];
        this.spawnPoints = [{ x: 10, y: 9 }, { x: 9, y: 10 }, { x: 10, y: 11 }, { x: 11, y: 10 }];
        this.createEvents();
        this.group = _group;
        SOCKET.emit("join_ready");
    }
    createPlayer(playerData) {
        this.player = new Player(this.game, this.grid, playerData.playerID, playerData.username, playerData.spawnPoint);
        this.players[playerData.playerID] = this.player;
        this.game.add.existing(this.player);
        this.updateGroup();
    }
    createOpponent(playerData) {
        let newOpponent = new Humanoid(this.game, this.grid, playerData.playerID, playerData.username, playerData.x, playerData.y);
        this.players[playerData.playerID] = newOpponent;
        this.opponents.push(newOpponent);
        this.game.add.existing(newOpponent);
        this.updateGroup();
    }
    removeOpponent(playerData) {
        let opponentToRemove = this.getOpponentByID(playerData.playerID);
        opponentToRemove.destroy();
        this.opponents.splice(this.opponents.indexOf(opponentToRemove), 1);
        this.players[playerData.playerID] = null;
    }
    moveOpponent(moveData) {
        let opponent = this.getOpponentByName(moveData.player);
        opponent.moveTowards(moveData.x, moveData.y);
    }
    createJoinWindow() {
        let client = this;
        let joinWindow = new JoinGameMenu(this.game, function (username) {
            let playerNumber = client.getOpenPlayerSlot();
            let spawnPoint = client.spawnPoints[playerNumber];
            SOCKET.emit("joined", { playerID: playerNumber, username: username, spawnPoint: spawnPoint });
        });
    }
    createEvents() {
        let client = this;
        SOCKET.on("join_game", client.createJoinWindow.bind(this));
        SOCKET.on("init_player", function (playerData) {
            client.createPlayer(playerData);
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
    updateGroup() {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i] != null) {
                this.group.add(this.players[i]);
            }
            else {
                this.group.remove(this.players[i]);
            }
        }
        console.log(this.group);
    }
    getOpponentByName(username) {
        for (let i = 0; i < this.opponents.length; i++) {
            if (this.opponents[i].username == username) {
                return this.opponents[i];
            }
        }
    }
    getOpponentByID(id) {
        for (let i = 0; i < this.opponents.length; i++) {
            if (this.opponents[i].playerID == id) {
                return this.opponents[i];
            }
        }
    }
    getOpenPlayerSlot() {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i] == null) {
                return i;
            }
        }
    }
}
//# sourceMappingURL=app.js.map