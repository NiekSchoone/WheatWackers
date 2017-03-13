class Tile {
    public hasGrass: Boolean = true;
    private game: Phaser.Game;
    private xPos: number;
    private yPos: number;
    private cutGrass: Phaser.Sprite;
    private grass: Phaser.Sprite;
    private tileSize: number;
    constructor(_game: Phaser.Game, _x: number, _y: number)
    {
        this.game = _game;
        this.xPos = _x ;
        this.yPos = _y;
        this.tileSize = this.game.cache.getImage('grass').width;
        
        this.cutGrass = this.game.add.sprite(this.xPos * this.tileSize, this.yPos * this.tileSize, 'cutGrass');
        this.grass = this.game.add.sprite(this.xPos * this.tileSize, this.yPos * this.tileSize, 'grass');
    }
    // world X coordinates
    public getX() {
        return this.xPos * this.tileSize;
    }
    // world Y coordinates
    public getY() {
        return this.yPos * this.tileSize;
    }
    //Set whether or not the grass is cut
    public setTile(_hasGrass: Boolean) {
        if (_hasGrass != this.hasGrass) {
            this.hasGrass = _hasGrass;
            if (this.hasGrass) {
                this.grass = this.game.add.sprite(this.xPos * this.tileSize, this.yPos * this.tileSize, 'grass');
                this.cutGrass.destroy(true);
            }
            else {
                this.cutGrass = this.game.add.sprite(this.xPos * this.tileSize, this.yPos * this.tileSize, 'cutGrass');
                this.grass.destroy(true);
            }
        }
    }
}