class Grid{
    game: Phaser.Game;
    gridWidth: number;
    gridHeight: number;
    tiles: Tile[][];
    tilewidth: number;
    obstacleDensity: number;
    public tileSize: number;


    constructor(_game: Phaser.Game) {
        this.game = _game;
    }

    public generateGrid(_gridWidth: number, _gridHeight: number, _midHalfSize: number) {
        this.gridWidth = _gridWidth;
        this.gridHeight = _gridHeight;
        this.tiles = [];
        let midSizeX: number = Math.floor(_gridWidth / 2) -1;

        let midSizeY: number = Math.floor(_gridHeight / 2) -1;

        this.obstacleDensity = 20;
        for (let x = 0; x < this.gridWidth; x++){
            this.tiles[x] = [];
            for (let y = 0; y < this.gridHeight; y++) {
                let newTile: Tile = new Tile(this.game, x, y);
                if (x < midSizeX + _midHalfSize && x > (midSizeX - _midHalfSize) && y < midSizeY + _midHalfSize && y > (midSizeY - _midHalfSize)) {
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