enum TileState {
        NONE,
        WHEAT,
        CUT,
        OBSTACLE
}
class Tile {
    private game: Phaser.Game;
    private xPos: number;
    private yPos: number;
    private spriteSize: number;
    private pickUp: PickUp;
    private trap: Trap;
    public tileSize: number;
    private hasPickUp: boolean = false;
    private hasTrap: boolean = false;
    private currentSprite: Phaser.Sprite;
    private animation: Phaser.Sprite;
    private currentState: TileState;
    private playerTraped: string;
    private anchorPoint: any;

    constructor(_game: Phaser.Game, _x: number, _y: number)
    {
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
    public GetSprite() {
        return this.currentSprite;
    }
    public GetAnimSprite() {
        return this.animation;
    }
    public getAnchor() {
        return this.anchorPoint;
    }
    public setAnchor(value: any) {
        this.anchorPoint = value;
    }

    public setTrap(_trap: Trap, playername: string) {
        if (!this.hasTrap) {
            this.hasTrap = true;
            this.trap = _trap;
            this.playerTraped = playername;
            this.trap.position.set(66,0 );
            console.log(this.trap.x, this.trap.y);
            this.currentSprite.addChild(_trap);
        }
    }
    public setPickup(_pickUp: PickUp) {
        if (!this.hasPickUp)
        {
            //_pickUp.position.set(128, 128);
            this.currentSprite.addChild(_pickUp);
            this.hasPickUp = true;
            this.pickUp = _pickUp;
        }
    }
   
    public checkTile(_player: Player) {
        if (this.hasPickUp)
        {
            this.pickUp.activate(_player);
            this.currentSprite.removeChild(this.pickUp);
            this.pickUp = null;
            this.hasPickUp = false;
        }
        else if (this.hasTrap) {
            if (_player.username != this.playerTraped)
            {
                this.trap.activateTrap(_player);
                this.currentSprite.removeChild(this.trap);
                this.trap = null;
                this.hasTrap = false;
                this.playerTraped = null;
            }
            
        }
    }

    public getTrapStatus()
    {
        return this.hasTrap;
    }

    //public setPickUp(_pickUp: PickUp) {
    //    this.pickUp = _pickUp;
    //    this.hasPickUp = true;
    //}

    //Set whether or not the grass is cut
    public setTile(_newState: TileState) {
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

    private getRandomNumber(_range: number) {
        return Math.floor(Math.random() * _range) + 1;
    }

    // world X coordinates
    public getX() {
        return this.xPos * this.tileSize + (this.tileSize / 2);
    }

    // world Y coordinates
    public getY() {
        return this.yPos * this.tileSize + (this.tileSize / 2);
    }

    public getGridPosX() { return this.xPos; }
    public getGridPosY() { return this.yPos; }

    // is occupied by wheat
    public getState() {
        return this.currentState;
    }
    public playCutAnim() {
        this.animation.visible = true;
        this.animation.play("cut", 24, false, true);
    }
}