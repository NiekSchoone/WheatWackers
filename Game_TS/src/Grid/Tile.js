var TileState;
(function (TileState) {
    TileState[TileState["NONE"] = 0] = "NONE";
    TileState[TileState["WHEAT"] = 1] = "WHEAT";
    TileState[TileState["CUT"] = 2] = "CUT";
    TileState[TileState["OBSTACLE"] = 3] = "OBSTACLE";
})(TileState || (TileState = {}));
var Tile = (function () {
    function Tile(_game, _x, _y) {
        this.hasPickUp = false;
        this.hasTrap = false;
        this.game = _game;
        this.xPos = _x;
        this.yPos = _y;
        this.tileSize = 144;
        this.spriteSize = 256;
        var anchorPointX = ((this.spriteSize - this.tileSize) / 2) / this.spriteSize;
        var anchorPointY = (this.spriteSize - this.tileSize) / this.spriteSize;
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
    Tile.prototype.GetSprite = function () {
        return this.currentSprite;
    };
    Tile.prototype.GetAnimSprite = function () {
        return this.animation;
    };
    Tile.prototype.getAnchor = function () {
        return this.anchorPoint;
    };
    Tile.prototype.setAnchor = function (value) {
        this.anchorPoint = value;
    };
    Tile.prototype.setTrap = function (_trap, playername) {
        if (!this.hasTrap) {
            this.hasTrap = true;
            this.trap = _trap;
            this.playerTraped = playername;
            this.trap.position.set(66, 0);
            console.log(this.trap.x, this.trap.y);
            this.currentSprite.addChild(_trap);
        }
    };
    Tile.prototype.setPickup = function (_pickUp) {
        if (!this.hasPickUp) {
            this.currentSprite.addChild(_pickUp);
            this.hasPickUp = true;
            this.pickUp = _pickUp;
        }
    };
    Tile.prototype.checkTile = function (_player) {
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
    };
    Tile.prototype.getPickupStatus = function () {
        return this.hasPickUp;
    };
    Tile.prototype.getTrapStatus = function () {
        return this.hasTrap;
    };
    Tile.prototype.setTile = function (_newState) {
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
    };
    Tile.prototype.getRandomNumber = function (_range) {
        return Math.floor(Math.random() * _range) + 1;
    };
    Tile.prototype.getX = function () {
        return this.xPos * this.tileSize + (this.tileSize / 2);
    };
    Tile.prototype.getY = function () {
        return this.yPos * this.tileSize + (this.tileSize / 2);
    };
    Tile.prototype.getGridPosX = function () { return this.xPos; };
    Tile.prototype.getGridPosY = function () { return this.yPos; };
    Tile.prototype.getState = function () {
        return this.currentState;
    };
    Tile.prototype.setpickUpAlpha = function (alpha) {
        if (this.hasPickUp) {
            this.pickUp.alpha = alpha;
        }
    };
    Tile.prototype.playCutAnim = function () {
        this.animation.visible = true;
        this.animation.play("cut", 24, false, true);
    };
    return Tile;
}());
