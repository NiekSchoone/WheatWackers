var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(game, grid, id, username, spawnPoint, spawnAnim) {
        _super.call(this, game, 0, 0, "player_" + id);
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
    Player.prototype.update = function () {
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
    };
    Player.prototype.moveUpwards = function () {
        if (this.moving == false) {
            this.moveTowards(0, -1);
        }
    };
    Player.prototype.moveDownwards = function () {
        if (this.moving == false) {
            this.moveTowards(0, 1);
        }
    };
    Player.prototype.moveLeft = function () {
        if (this.moving == false) {
            this.scale.setTo(-1, 1);
            this.moveTowards(-1, 0);
        }
    };
    Player.prototype.moveRight = function () {
        if (this.moving == false) {
            this.scale.setTo(1, 1);
            this.moveTowards(1, 0);
        }
    };
    Player.prototype.moveTowards = function (_x, _y) {
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
    };
    Player.prototype.cutWheat = function (tile) {
        if (this.cutting == true) {
            tile.setTile(TileState.CUT);
            tile.playCutAnim();
            this.onComplete();
            this.cutting = false;
            SOCKET.emit("wheat_cut", { x: tile.getGridPosX(), y: tile.getGridPosY() });
        }
    };
    Player.prototype.onComplete = function () {
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
    };
    Player.prototype.getTrapped = function (time) {
        this.trapped = true;
        this.game.time.events.add(time, this.getUntrapped, this);
    };
    Player.prototype.pickUpTreasure = function () {
        this.hasTreasure = true;
    };
    Player.prototype.getUntrapped = function () {
        this.trapped = false;
    };
    Player.prototype.respawn = function () {
        this.position.set(this.grid.getTile(this.spawnPoint.x, this.spawnPoint.y).getX(), this.grid.getTile(this.spawnPoint.x, this.spawnPoint.y).getY());
        this.spawnAnimation.animations.play('spawn', 24, false, true);
    };
    Player.prototype.placeTrapOne = function () {
        if (this.moving == false && this.hasMouseTrap == true) {
            var tile = this.grid.getTileAtPlayer(this.x, this.y, 0, 0);
            if (tile.getTrapStatus() == false) {
                var newTrap = new Trap(this.game, 10000);
                tile.setTrap(newTrap, this.username);
                this.hasMouseTrap = false;
            }
        }
    };
    Player.prototype.placeTrapTwo = function () {
        if (this.moving == false && this.hasPitTrap == true) {
            var tile = this.grid.getTileAtPlayer(this.x, this.y, 0, 0);
            if (tile.getTrapStatus() == false) {
                var newTrap = new Trap(this.game);
                tile.setTrap(newTrap, this.username);
                this.hasPitTrap = false;
            }
        }
    };
    Player.prototype.equipTool = function () {
        if (this.holdingTool == true) {
            this.holdingTool = false;
            this.grid.getTileAtPlayer(this.x, this.y, 0, 0).setPickup(new PickUp(this.game, PickUpType.tool));
        }
    };
    return Player;
}(Phaser.Sprite));
