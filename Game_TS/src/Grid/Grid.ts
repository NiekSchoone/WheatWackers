class Grid{
    game: Phaser.Game;
    gridWidth: number;
    gridHeight: number;
    Tiles: Tile[][];
    space: Phaser.Key;
    tilewidth: number;
    tileGrope: Phaser.Group;
    obstacleDensity: number;
    constructor(_game: Phaser.Game) {
        this.game = _game;
    }

    public generateGrid(_gridWidth: number, _gridHeight: number, _midHalfSize: number) {
        this.gridWidth = _gridWidth;
        this.gridHeight = _gridHeight;
        this.Tiles = [];
        this.tileGrope = this.game.add.group();
        let midSizeX: number = Math.floor(_gridWidth / 2) -1;

        let midSizeY: number = Math.floor(_gridHeight / 2) -1;

        this.obstacleDensity = 20;
        for (let x = 0; x < this.gridWidth; x++){
            this.Tiles[x] = [];
            for (let y = 0; y < this.gridHeight; y++) {
                let newTile: Tile = new Tile(this.game, x, y);
                this.tileGrope.add(newTile.GetSprite);
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
                this.Tiles[x][y] = newTile;
                this.tileGrope.sort('y', Phaser.Group.SORT_ASCENDING)
            }
        }
        this.tilewidth = this.Tiles[0][0].tileSize;
    }
    // get tile at grid coordinate 
    public getTile(_x: number, _y: number) {
        return this.Tiles[_x][_y];
    }
    // get tile at player coordinate +/- directionX and directionY on grid coordinate 
    public getTileAtPlayer(playerX: number, playerY: number, directionX: number, directionY: number): Tile
    {
        playerX -= (this.tilewidth / 2);
        playerX = playerX / this.tilewidth;
        playerX += directionX;
        playerY -= (this.tilewidth / 2);
        playerY = playerY / this.tilewidth;
        playerY += directionY;

        if ((playerX > this.Tiles.length - 1 || playerX < 0) || (playerY > this.Tiles[0].length - 1 || playerY < 0))
        {
            return null;
        }
        else
        {
            return this.Tiles[playerX][playerY];
        }


    }
}