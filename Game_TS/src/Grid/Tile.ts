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

    public tileSize: number;

    private currentSprite: Phaser.Sprite;
    private currentState: TileState;

    constructor(_game: Phaser.Game, _x: number, _y: number)
    {
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
    public getX() {
        return this.xPos * this.tileSize +(this.tileSize/2);
    }
    // world Y coordinates
    public getY() {
        return this.yPos * this.tileSize +(this.tileSize / 2);
    }
    // is occupied by wheat
    public GetState() {
        return this.currentState;
    }
    //Set whether or not the grass is cut
    public setTile(newState: TileState) {
        if (newState != this.currentState) {
            switch (newState) {
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
            this.currentState = newState;
        }
    }
    private getRandomNumber(range: number) {
        return Math.floor(Math.random() * range) + 1;
    }
}