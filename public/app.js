class Game {
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
class BootState extends Phaser.State {
    preload() {
        this.game.load.image('loading', 'assets/images/ui/loading_image.png');
    }
    create() {
        this.initStates();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.state.start("Preloader");
    }
    initStates() {
        this.game.state.add("Preloader", Preloader);
        this.game.state.add("MenuState", MenuState);
        this.game.state.add("GameState", GameState);
    }
}
class GameState extends Phaser.State {
    init(_username) {
        this.playername = _username;
    }
    create() {
        let client = this;
        this.game.stage.disableVisibilityChange = true;
        let gridSizeX = 23;
        let gridSizeY = 23;
        this.game.physics.arcade.enable(this);
        this.game.camera.flash(0x000000, 1000);
        this.game.camera.focusOnXY((gridSizeX * 144) / 2, (gridSizeX * 144) / 2);
        this.background = new Phaser.TileSprite(this.game, 0, 0, gridSizeX * 144, gridSizeY * 144, 'background');
        this.background.texture.width = 864;
        this.background.texture.height = 864;
        this.game.add.existing(this.background);
        this.group = new Phaser.Group(this.game);
        this.gamefield = new Grid(this.game, gridSizeX, gridSizeY, function (tiles) {
            for (let i = 0; i < tiles.length; i++) {
                let tile = tiles[i];
                for (let j = 0; j < tile.length; j++) {
                    client.group.add(tile[j].GetSprite());
                    client.group.add(tile[j].GetAnimSprite());
                }
            }
        });
        this.playerManager = new PlayerManager(this.game, this.gamefield, this.group, this.playername);
        this.musicLoop = this.game.add.audio('music_loop', 0.05, true);
        this.musicLoop.play();
    }
    update() {
        this.group.sort("y", Phaser.Group.SORT_ASCENDING);
    }
}
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
        this.midPointX = Math.floor(this.gridWidth / 2);
        this.midPointY = Math.floor(this.gridHeight / 2);
        this.obstacleDensity = 20;
        this.pickupDensity = 20;
        for (let x = 0; x < this.gridWidth; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < this.gridHeight; y++) {
                let newTile = new Tile(this.game, x, y);
                if (x < this.midPointX + this.spawnAreaSize && x > (this.midPointX - this.spawnAreaSize) && y < this.midPointY + this.spawnAreaSize && y > (this.midPointY - this.spawnAreaSize)) {
                    newTile.setTile(TileState.CUT);
                }
                else if (x == 0 || y == 0 || x == (this.gridWidth - 1) || y == (this.gridHeight - 1)) {
                    newTile.setTile(TileState.OBSTACLE);
                    if (x == 0 && y == 0) {
                        newTile.GetSprite().loadTexture("fence_corner_top");
                    }
                    else if (x == (this.gridWidth - 1) && y == 0) {
                        newTile.GetSprite().loadTexture("fence_corner_top");
                        newTile.GetSprite().anchor.set(1 - newTile.getAnchor().x, newTile.getAnchor().y);
                        newTile.GetSprite().scale.setTo(-1, 1);
                    }
                    else if (x == 0 && y == (this.gridHeight - 1)) {
                        newTile.GetSprite().loadTexture("fence_corner_bottom");
                    }
                    else if (x == (this.gridWidth - 1) && y == (this.gridHeight - 1)) {
                        newTile.GetSprite().loadTexture("fence_corner_bottom");
                        newTile.GetSprite().anchor.set(1 - newTile.getAnchor().x, newTile.getAnchor().y);
                        newTile.GetSprite().scale.setTo(-1, 1);
                    }
                    else if (x == 0 && y != 0) {
                        newTile.GetSprite().loadTexture("fence_side");
                    }
                    else if (x == (this.gridWidth - 1) && y != 0) {
                        newTile.GetSprite().loadTexture("fence_side");
                        newTile.GetSprite().anchor.set(1 - newTile.getAnchor().x, newTile.getAnchor().y);
                        newTile.GetSprite().scale.setTo(-1, 1);
                    }
                    else if (x != 0 && y == 0) {
                        newTile.GetSprite().loadTexture("fence_top");
                    }
                    else if (x != 0 && y == (this.gridHeight - 1)) {
                        newTile.GetSprite().loadTexture("fence_bottom");
                    }
                }
                else if (Math.random() * 100 < this.obstacleDensity) {
                    newTile.setTile(TileState.OBSTACLE);
                }
                else if (Math.random() * 100 < this.pickupDensity) {
                    let newPickup = new PickUp(this.game, Math.random() * 4 + 1);
                    newTile.setPickup(newPickup);
                    newTile.setTile(TileState.WHEAT);
                }
                else {
                    newTile.setTile(TileState.WHEAT);
                }
                this.tiles[x][y] = newTile;
            }
        }
        this.callBack(this.tiles);
    }
    setPickupAlpha(alpha) {
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                let tile = this.tiles[x][y];
                if (tile.getPickupStatus && tile.getState() != TileState.CUT) {
                    tile.setpickUpAlpha(alpha);
                }
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
                if (x == 0 || y == 0 || x == (this.gridWidth - 1) || y == (this.gridHeight - 1)) {
                    if (x == 0 && y == 0) {
                        newTile.GetSprite().loadTexture("fence_corner_top");
                    }
                    else if (x == (this.gridWidth - 1) && y == 0) {
                        newTile.GetSprite().loadTexture("fence_corner_top");
                        newTile.GetSprite().anchor.set(1 - newTile.getAnchor().x, newTile.getAnchor().y);
                        newTile.GetSprite().scale.setTo(-1, 1);
                    }
                    else if (x == 0 && y == (this.gridHeight - 1)) {
                        newTile.GetSprite().loadTexture("fence_corner_bottom");
                    }
                    else if (x == (this.gridWidth - 1) && y == (this.gridHeight - 1)) {
                        newTile.GetSprite().loadTexture("fence_corner_bottom");
                        newTile.GetSprite().anchor.set(1 - newTile.getAnchor().x, newTile.getAnchor().y);
                        newTile.GetSprite().scale.setTo(-1, 1);
                    }
                    else if (x == 0 && y != 0) {
                        newTile.GetSprite().loadTexture("fence_side");
                    }
                    else if (x == (this.gridWidth - 1) && y != 0) {
                        newTile.GetSprite().loadTexture("fence_side");
                        newTile.GetSprite().anchor.set(1 - newTile.getAnchor().x, newTile.getAnchor().y);
                        newTile.GetSprite().scale.setTo(-1, 1);
                    }
                    else if (x != 0 && y == 0) {
                        newTile.GetSprite().loadTexture("fence_top");
                    }
                    else if (x != 0 && y == (this.gridHeight - 1)) {
                        newTile.GetSprite().loadTexture("fence_bottom");
                    }
                }
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
        playerX = Math.round(playerX);
        playerY = Math.round(playerY);
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
    getMidX() { return this.midPointX; }
    getMidY() { return this.midPointY; }
    getGridWidth() { return this.gridWidth; }
    getGridHeight() { return this.gridHeight; }
}
var PickUpType;
(function (PickUpType) {
    PickUpType[PickUpType["treasure"] = 0] = "treasure";
    PickUpType[PickUpType["cow"] = 1] = "cow";
    PickUpType[PickUpType["wateringCan"] = 2] = "wateringCan";
    PickUpType[PickUpType["mouseTrap"] = 3] = "mouseTrap";
    PickUpType[PickUpType["shovel"] = 4] = "shovel";
    PickUpType[PickUpType["tool"] = 5] = "tool";
})(PickUpType || (PickUpType = {}));
class PickUp extends Phaser.Sprite {
    constructor(game, type) {
        super(game, 0, 0, '');
        switch (type) {
            case PickUpType.treasure:
                this.loadTexture('treasure');
                break;
            case PickUpType.cow:
                this.loadTexture('PickUp_Cow');
                break;
            case PickUpType.wateringCan:
                this.loadTexture('PickUp_WaterCan');
                break;
            case PickUpType.shovel:
                this.loadTexture('PickUp_Shovel');
                break;
            case PickUpType.mouseTrap:
                this.loadTexture('PickUp_MouseTrap');
                break;
        }
        this.pickUpType = type;
        this.anchor.set(0.5);
    }
    activate(player) {
        switch (this.pickUpType) {
            case PickUpType.treasure:
                player.pickUpTreasure();
                break;
            case PickUpType.cow:
                player.speed += 500;
                break;
            case PickUpType.tool:
                player.holdingTool = true;
                break;
            case PickUpType.shovel:
                player.hasPitTrap = true;
                break;
            case PickUpType.mouseTrap:
                player.hasMouseTrap = true;
                break;
        }
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
        this.hasTrap = false;
        this.game = _game;
        this.xPos = _x;
        this.yPos = _y;
        this.tileSize = 144;
        this.spriteSize = 256;
        let anchorPointX = ((this.spriteSize - this.tileSize) / 2) / this.spriteSize;
        let anchorPointY = (this.spriteSize - this.tileSize) / this.spriteSize;
        this.anchorPoint = { x: anchorPointX, y: anchorPointY };
        this.currentSprite = new Phaser.Sprite(this.game, (this.xPos * this.tileSize), (this.yPos * this.tileSize));
        this.currentSprite.anchor.set(this.anchorPoint.x, this.anchorPoint.y);
        this.currentState = TileState.NONE;
        this.animation = new Phaser.Sprite(this.game, (this.xPos * this.tileSize), (this.yPos * this.tileSize), "wheat_cut_anim");
        this.animation.animations.add("cut", Phaser.ArrayUtils.numberArray(0, 14));
        this.animation.anchor.set(this.anchorPoint.x, this.anchorPoint.y);
        this.animation.visible = false;
        this.game.add.existing(this.currentSprite);
        this.game.add.existing(this.animation);
    }
    GetSprite() {
        return this.currentSprite;
    }
    GetAnimSprite() {
        return this.animation;
    }
    getAnchor() {
        return this.anchorPoint;
    }
    setAnchor(value) {
        this.anchorPoint = value;
    }
    setTrap(_trap, playername) {
        if (!this.hasTrap) {
            this.hasTrap = true;
            this.trap = _trap;
            this.playerTraped = playername;
            this.trap.position.set(66, 0);
            console.log(this.trap.x, this.trap.y);
            this.currentSprite.addChild(_trap);
        }
    }
    setPickup(_pickUp) {
        if (!this.hasPickUp) {
            //_pickUp.position.set(128, 128);
            this.currentSprite.addChild(_pickUp);
            this.hasPickUp = true;
            this.pickUp = _pickUp;
        }
    }
    checkTile(_player) {
        if (this.hasPickUp) {
            this.pickUp.activate(_player);
            this.currentSprite.removeChild(this.pickUp);
            this.pickUp = null;
            this.hasPickUp = false;
        }
        else if (this.hasTrap) {
            if (_player.username != this.playerTraped) {
                this.trap.activateTrap(_player);
                this.currentSprite.removeChild(this.trap);
                this.trap = null;
                this.hasTrap = false;
                this.playerTraped = null;
            }
        }
    }
    getPickupStatus() {
        return this.hasPickUp;
    }
    getTrapStatus() {
        return this.hasTrap;
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
                    if (this.hasPickUp) {
                        this.setpickUpAlpha(1);
                    }
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
    setpickUpAlpha(alpha) {
        if (this.hasPickUp) {
            this.pickUp.alpha = alpha;
        }
    }
    playCutAnim() {
        this.animation.visible = true;
        this.animation.play("cut", 24, false, true);
    }
}
class Trap extends Phaser.Sprite {
    constructor(game, trapTime = 0) {
        super(game, 0, 0, "");
        this.trapTime = trapTime;
        this.anchor.set(0.5);
        if (trapTime == 0) {
            this.loadTexture("pitTrap");
        }
        else {
            this.loadTexture("mouseTrap");
        }
    }
    activateTrap(target) {
        if (this.trapTime != 0) {
            target.getTrapped(this.trapTime);
        }
        else {
            target.respawn();
        }
    }
}
class Humanoid extends Phaser.Sprite {
    constructor(game, grid, id, username, x, y, spawnAnim) {
        super(game, 0, 0, "player_" + id);
        this.speed = 1000;
        this.grid = grid;
        this.spawnPoint = { x: x, y: y };
        this.username = username;
        this.playerID = id;
        this.spawnAnimation = spawnAnim;
        this.spawnSound = this.game.add.audio('spawn_sound', 1, false);
        this.animations.add("idle", Phaser.ArrayUtils.numberArray(62, 101));
        this.animations.add("walk", Phaser.ArrayUtils.numberArray(0, 30));
        this.animations.play("idle", 24, true);
        this.position.set(grid.getTile(x, y).getX(), grid.getTile(x, y).getY());
        this.anchor.setTo(0.5, 0.75);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
        this.cursorkeys = new Phaser.Key(game, 32);
        this.spawnAnimation.anchor.set(0.5, 0.88);
        this.spawnAnimation.animations.add('spawn', Phaser.ArrayUtils.numberArray(0, 15));
        this.game.add.existing(this.spawnAnimation);
        this.spawnAnimation.animations.play('spawn', 24, false, true);
        this.spawnSound.play();
    }
    moveTowards(x, y) {
        var tile = this.grid.getTile(x, y);
        if (tile.getState() == TileState.WHEAT) {
            this.alpha = 0;
        }
        else {
            this.alpha = 1;
        }
        if (this.x > tile.getX()) {
            this.scale.setTo(-1, 1);
        }
        else if (this.x < tile.getX()) {
            this.scale.setTo(1, 1);
        }
        this.animations.play("walk", 24, true);
        var tween = this.game.add.tween(this.body).to({ x: tile.getX() - Math.abs(this.width) * 0.5, y: tile.getY() - Math.abs(this.height) * 0.75 }, 500, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.onComplete, this);
    }
    onComplete() {
        this.animations.play("idle", 24, true);
    }
}
class Player extends Phaser.Sprite {
    constructor(game, grid, id, username, spawnPoint, spawnAnim) {
        super(game, 0, 0, "player_" + id);
        this.speed = 5000;
        this.moving = false;
        this.holdingKey = false;
        this.cutting = false;
        this.cutTime = 1000;
        this.holdingTool = true;
        this.trapped = false;
        this.hasTreasure = false;
        this.hasMouseTrap = true;
        this.hasPitTrap = true;
        this.game = game;
        this.grid = grid;
        this.playerID = id;
        this.username = username;
        this.spawnPoint = spawnPoint;
        this.spawnAnimation = spawnAnim;
        this.spawnSound = this.game.add.audio('spawn_sound', 1, false);
        this.walkSound = this.game.add.audio('walk_sound', 1);
        this.cutSound = this.game.add.audio('cut_sound', 1, true);
        this.animations.add("idle", Phaser.ArrayUtils.numberArray(62, 101));
        this.animations.add("walk", Phaser.ArrayUtils.numberArray(0, 30));
        this.animations.add("cut", Phaser.ArrayUtils.numberArray(162, 175));
        this.animations.add("treasureWalk", Phaser.ArrayUtils.numberArray(31, 36));
        this.animations.add("treasureIdle", Phaser.ArrayUtils.numberArray(102, 161));
        this.animations.add("emptyWalk", Phaser.ArrayUtils.numberArray(176, 206));
        this.animations.add("emptyIdle", Phaser.ArrayUtils.numberArray(207, 245));
        this.animations.play("idle", 24, true);
        this.position.set(grid.getTile(spawnPoint.x, spawnPoint.y).getX(), grid.getTile(spawnPoint.x, spawnPoint.y).getY());
        this.anchor.setTo(0.5, 0.75);
        this.moveDistance = this.grid.tileSize;
        this.game.physics.arcade.enable(this);
        this.cursors = game.input.keyboard.createCursorKeys();
        this.game.camera.follow(this);
        this.game.camera.focusOnXY(this.x, this.y);
        this.game.world.setBounds(0, 0, this.grid.getGridWidth() * 144, this.grid.getGridHeight() * 144);
        this.spawnAnimation.anchor.set(0.5, 0.88);
        this.spawnAnimation.animations.add('spawn', Phaser.ArrayUtils.numberArray(0, 15));
        this.game.add.existing(this.spawnAnimation);
        this.spawnAnimation.animations.play('spawn', 24, false, true);
        this.spawnSound.play();
        this.toolKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.trapKey1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        this.trapKey2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        this.toolKey.onDown.add(this.equipTool, this);
        this.trapKey1.onDown.add(this.placeTrapOne, this);
        this.trapKey2.onDown.add(this.placeTrapTwo, this);
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
        if (tile && this.moving == false && this.trapped == false && this.cutting == false) {
            var tileState = tile.getState();
            this.targetTile = tile;
            if (tileState == TileState.CUT || tileState == TileState.NONE || (tileState == TileState.WHEAT && this.holdingTool == false)) {
                this.moving = true;
                this.animations.play("walk", 24, true);
                this.walkSound.play();
                if (tileState == TileState.WHEAT) {
                    this.grid.setPickupAlpha(.5);
                    this.alpha = .5;
                }
                else {
                    this.grid.setPickupAlpha(0);
                    this.alpha = 1;
                }
                if (this.hasTreasure == false && this.holdingTool == true) {
                    this.animations.play("walk", 24, true);
                }
                else if (this.hasTreasure == true) {
                    this.animations.play("treasureWalk", 24, true);
                }
                else {
                    this.animations.play("emptyWalk", 24, true);
                }
                var tween = this.game.add.tween(this.body).to({ x: tile.getX() - Math.abs(this.width) * 0.5, y: tile.getY() - Math.abs(this.height) * 0.75 }, 500, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.onComplete, this);
                SOCKET.emit("player_move", { player: this.username, x: tile.getGridPosX(), y: tile.getGridPosY() });
            }
            else if (tileState == TileState.WHEAT && this.holdingTool == true) {
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
            tile.playCutAnim();
            this.onComplete();
            this.cutting = false;
            SOCKET.emit("wheat_cut", { x: tile.getGridPosX(), y: tile.getGridPosY() });
        }
    }
    onComplete() {
        if (this.holdingKey == false) {
            if (!this.hasTreasure && this.holdingTool) {
                this.animations.play("idle", 24, true);
            }
            else if (this.hasTreasure) {
                if (this.grid.getTileAtPlayer(this.x, this.y, 0, 0).getGridPosX == this.grid.getMidX && this.grid.getTileAtPlayer(this.x, this.y, 0, 0).getGridPosY == this.grid.getMidY) {
                }
                else {
                    this.animations.play("treasureIdle", 24, true);
                }
            }
            else {
                this.animations.play("emptyIdle", 24, true);
            }
        }
        this.moving = false;
        this.targetTile.checkTile(this);
    }
    getTrapped(time) {
        this.trapped = true;
        this.game.time.events.add(time, this.getUntrapped, this);
    }
    pickUpTreasure() {
        this.hasTreasure = true;
    }
    getUntrapped() {
        this.trapped = false;
    }
    respawn() {
        this.position.set(this.grid.getTile(this.spawnPoint.x, this.spawnPoint.y).getX(), this.grid.getTile(this.spawnPoint.x, this.spawnPoint.y).getY());
        this.spawnAnimation.animations.play('spawn', 24, false, true);
    }
    placeTrapOne() {
        if (this.moving == false && this.hasMouseTrap == true) {
            var tile = this.grid.getTileAtPlayer(this.x, this.y, 0, 0);
            if (tile.getTrapStatus() == false) {
                var newTrap = new Trap(this.game, 10000);
                tile.setTrap(newTrap, this.username);
                this.hasMouseTrap = false;
            }
        }
    }
    placeTrapTwo() {
        if (this.moving == false && this.hasPitTrap == true) {
            var tile = this.grid.getTileAtPlayer(this.x, this.y, 0, 0);
            if (tile.getTrapStatus() == false) {
                var newTrap = new Trap(this.game);
                tile.setTrap(newTrap, this.username);
                this.hasPitTrap = false;
            }
        }
    }
    equipTool() {
        if (this.holdingTool == true) {
            this.holdingTool = false;
            this.grid.getTileAtPlayer(this.x, this.y, 0, 0).setPickup(new PickUp(this.game, PickUpType.tool));
        }
    }
}
class PlayerManager {
    constructor(_game, _grid, _group, username) {
        this.game = _game;
        this.grid = _grid;
        this.playerName = username;
        this.opponents = [];
        this.players = [null, null, null, null];
        this.spawnPoints = [{ x: 11, y: 10 }, { x: 10, y: 11 }, { x: 11, y: 12 }, { x: 12, y: 11 }];
        this.createEvents();
        this.group = _group;
        SOCKET.emit("joining");
    }
    joinAsPlayer() {
        let playerNumber = this.getOpenPlayerSlot();
        let spawnPoint = this.spawnPoints[playerNumber];
        SOCKET.emit("joined", { playerID: playerNumber, username: this.playerName, spawnPoint: spawnPoint });
    }
    createPlayer(playerData) {
        let spawnAnimation = new Phaser.Sprite(this.game, this.grid.getTile(playerData.spawnPoint.x, playerData.spawnPoint.y).getX(), this.grid.getTile(playerData.spawnPoint.x, playerData.spawnPoint.y).getY(), 'spawn_anim');
        this.player = new Player(this.game, this.grid, playerData.playerID, playerData.username, playerData.spawnPoint, spawnAnimation);
        this.players[playerData.playerID] = this.player;
        this.game.add.existing(this.player);
        this.group.add(this.player.spawnAnimation);
        this.updateGroup();
    }
    createOpponent(playerData) {
        let spawnAnimation = new Phaser.Sprite(this.game, this.grid.getTile(playerData.x, playerData.y).getX(), this.grid.getTile(playerData.x, playerData.y).getY(), 'spawn_anim');
        let newOpponent = new Humanoid(this.game, this.grid, playerData.playerID, playerData.username, playerData.x, playerData.y, spawnAnimation);
        this.players[playerData.playerID] = newOpponent;
        this.opponents.push(newOpponent);
        this.game.add.existing(newOpponent);
        this.group.add(newOpponent.spawnAnimation);
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
    createEvents() {
        let client = this;
        SOCKET.on("join_game", client.joinAsPlayer.bind(this));
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
class MenuState extends Phaser.State {
    create() {
        this.game.physics.arcade.enable(this);
        this.game.camera.flash(0x000000, 1000);
        this.backgroung = this.game.add.sprite(0, 0, 'menuBackground');
        this.backgroung.width = this.game.width;
        this.backgroung.height = this.game.height;
        this.createUsernameElement();
        document.body.insertBefore(this.userInput, this.game.canvas);
        this.buttonSound = this.game.add.sound("button_sound", 1, false);
        this.joinButton = this.add.button(this.game.world.centerX + 100, 250, 'JoinButton', this.joinButtonDown, this, 0, 1);
        this.joinButton.angle = 5;
        this.howToButton = this.add.button(this.game.world.centerX + 100, 450, 'HowToButton', this.howToButtonDown, this, 0, 1);
        this.howToButton.angle = 5;
    }
    createUsernameElement() {
        this.userInput = document.createElement('input');
        this.userInput.style.right = "50%";
        this.userInput.style.width = "250px";
        this.userInput.style.position = "fixed";
        this.userInput.style.margin = "10% -125px 0px 0px";
        this.userInput.style.display = "block";
    }
    createButtonDown() {
    }
    howToButtonDown() {
        this.buttonSound.play();
    }
    joinButtonDown() {
        this.buttonSound.play();
        let client = this;
        this.camera.onFadeComplete.add(function () {
            client.game.state.start("GameState", true, false, document.getElementsByTagName("input")[0].value);
            document.body.removeChild(client.userInput);
        });
        this.game.camera.fade(0x000000, 1000);
    }
}
class Preloader extends Phaser.State {
    preload() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.enable(this);
        this.loadingImage = this.game.add.sprite(150, 150, "loading");
        this.loadingImage.anchor.setTo(0.5, 0.5);
        //Image loading
        this.game.load.image('menuBackground', 'assets/images/MenuBackground.jpg');
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
        this.game.load.image('PickUp_Cow', 'assets/images/PickUp/cow.png');
        this.game.load.image('PickUp_WaterCan', 'assets/images/PickUp/waterCan.png');
        this.game.load.image('PickUp_MouseTrap', 'assets/images/PickUp/mouseTrap.png');
        this.game.load.image('PickUp_Shovel', 'assets/images/PickUp/Shovel.png');
        this.game.load.image('treasure', 'assets/images/treasure/treasure.png');
        this.game.load.image('fence_side', 'assets/images/level/fence_side.png');
        this.game.load.image('fence_bottom', 'assets/images/level/fence_bottom.png');
        this.game.load.image('fence_top', 'assets/images/level/fence_top.png');
        this.game.load.image('fence_corner_top', 'assets/images/level/fence_corner_top.png');
        this.game.load.image('fence_corner_bottom', 'assets/images/level/fence_corner_bottom.png');
        this.game.load.image('button_join', 'assets/images/ui/button_join.png');
        this.game.load.image('ui_bar', 'assets/images/ui/ui_bar.png');
        //Spritesheet loading
        this.game.load.spritesheet('spawn_anim', 'assets/spritesheets/spawn_anim.png', 500, 800);
        this.game.load.spritesheet('player_0', 'assets/spritesheets/player_1.png', 150, 150);
        this.game.load.spritesheet('player_1', 'assets/spritesheets/player_2.png', 150, 150);
        this.game.load.spritesheet('player_2', 'assets/spritesheets/player_3.png', 150, 150);
        this.game.load.spritesheet('player_3', 'assets/spritesheets/player_4.png', 150, 150);
        this.game.load.spritesheet('wheat_cut_anim', 'assets/spritesheets/wheat_cut_anim.png', 256, 256);
        this.game.load.spritesheet('CreateButton', 'assets/images/ui/buttonCreate.png', 512, 256);
        this.game.load.spritesheet('HowToButton', 'assets/images/ui/buttonHowTo.png', 512, 256);
        this.game.load.spritesheet('JoinButton', 'assets/images/ui/buttonJoin.png', 512, 256);
        //Audio loading
        this.game.load.audio('music_loop', 'assets/audio/music_loop.mp3');
        this.game.load.audio('button_sound', 'assets/audio/button_sound.mp3');
        this.game.load.audio('spawn_sound', 'assets/audio/spawn_sound.mp3');
        this.game.load.audio('walk_sound', 'assets/audio/walk_sound.mp3');
        this.game.load.audio('cut_sound', 'assets/audio/cut_sound.mp3');
        this.game.load.audio('cow_sound', 'assets/audio/cow_sound.mp3');
    }
    update() {
        this.loadingImage.angle += 1;
    }
    create() {
        this.initStates();
        let client = this;
        this.camera.onFadeComplete.add(function () {
            client.game.state.start("MenuState");
        });
        this.game.camera.fade(0x000000, 1000);
    }
    initStates() {
        this.game.state.add("MenuState", MenuState);
        this.game.state.add("GameState", GameState);
    }
}
//# sourceMappingURL=app.js.map