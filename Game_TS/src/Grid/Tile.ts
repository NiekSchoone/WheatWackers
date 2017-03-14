class Tile {
    private hasWheat: Boolean = true;
    private game: Phaser.Game;
    private xPos: number;
    private yPos: number;
    public tileSize: number;
    private currentSprite: Phaser.Sprite;

    constructor(_game: Phaser.Game, _x: number, _y: number)
    {
        this.game = _game;
        this.xPos = _x;
        this.yPos = _y;
        this.tileSize = this.game.cache.getImage('wheat').width;

        this.currentSprite = new Phaser.Sprite(this.game, this.xPos * this.tileSize, this.yPos * this.tileSize);
        this.currentSprite.loadTexture('wheat');

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
    public HasWheat() {
        return this.hasWheat;
    }
    //Set whether or not the grass is cut
    public setTile(_hasWheat: Boolean) {
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