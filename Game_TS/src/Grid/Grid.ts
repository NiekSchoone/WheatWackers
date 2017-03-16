class Grid{
    private game: Phaser.Game;
    private gridWidth: number;
    private gridHeight: number;
    private tiles: Tile[][];
    public tileSize: number;

    constructor(_game: Phaser.Game) {
        this.game = _game;
    }

    public generateGrid(_gridWidth: number, _gridHeight: number) {
        this.gridWidth = _gridWidth;
        this.gridHeight = _gridHeight;
        this.tiles = [];

        for (let x = 0; x < this.gridWidth; x++){
            this.tiles[x] = [];
            for (let y = 0; y < this.gridHeight; y++) {
                let newTile: Tile = new Tile(this.game, x, y);
                newTile.setTile((Math.floor(Math.random() * 4)) as TileState);
                this.tiles[x][y] = newTile;
            }
        }
        this.tileSize = this.tiles[0][0].tileSize;
    }

    // get tile at player coordinate +/- directionX and directionY on grid coordinate 
    public getTileAtPlayer(playerX: number, playerY: number, directionX: number, directionY: number): Tile {
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
    public getTile(_x: number, _y: number) {
        return this.tiles[_x][_y];
    }

    public getGridWidth() { return this.gridWidth; }
    public getGridHeight() { return this.gridHeight }
}