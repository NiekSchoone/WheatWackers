class Grid{
    game: Phaser.Game;
    gridWidth: number;
    gridHeight: number;
    Tiles: Tile[][];
    space: Phaser.Key;
    tilewidth: number;
    constructor(_game: Phaser.Game) {
        this.game = _game;
    }

    public generateGrid(_gridWidth: number, _gridHeight: number) {
        this.gridWidth = _gridWidth;
        this.gridHeight = _gridHeight;
        this.Tiles = [];

        for (let y = 0; y < this.gridWidth; y++){
            this.Tiles[y] = [];
            for (let x = 0; x < this.gridHeight; x++) {
                let newTile: Tile = new Tile(this.game, x, y);
                newTile.setTile((Math.floor(Math.random() * 4)) as TileState);
                this.Tiles[y][x] = newTile;
            }
        }
        this.tilewidth = this.Tiles[0][0].tileSize;
    }
    // get tile at grid coordinate 
    public getTile(_x: number, _y: number) {
        return this.Tiles[_x][_y];
    }
    // get tile at player coordinate +/- directionX and directionY on grid coordinate 
    public getTileAtPlayer(playerX: number, playerY: number, directionX: number, directionY: number): Tile{
        playerX /= this.tilewidth + directionX;
        playerY /= this.tilewidth + directionY;
        if ((playerX > this.Tiles.length - 1 || playerX < 0) || (playerY > this.Tiles[0].length - 1 || playerY < 0)) {
            return null;
        }
        else
        {
            return this.Tiles[playerX][playerY];
        }
        
    }
}