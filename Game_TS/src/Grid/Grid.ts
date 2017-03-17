class Grid{
    private game: Phaser.Game;
    private gridWidth: number;
    private gridHeight: number;
    private tiles: Tile[][];
    public tileSize: number;

    constructor(_game: Phaser.Game, _gridWidth: number, _gridHeight: number) {
        this.game = _game;
        this.gridWidth = _gridWidth;
        this.gridHeight = _gridHeight;

        this.tileSize = 144;

        let client = this;
        SOCKET.on("create_grid", function () {
            client.generateGrid();

            let serverData = [];
            for (var x = 0; x < client.gridWidth; x++) {
                serverData[x] = [];
                for (var y = 0; y < client.gridHeight; y++) {
                    serverData[x][y] = client.getTile(x, y).getState() as number;
                }
            }
            SOCKET.emit("grid_created", serverData);
        });
        SOCKET.on("init_grid", function (gridData) {
            client.generateGridFromServer(gridData);
        });
    }

    public generateGrid() {
        this.tiles = [];

        for (let x = 0; x < this.gridWidth; x++){
            this.tiles[x] = [];
            for (let y = 0; y < this.gridHeight; y++) {
                let newTile: Tile = new Tile(this.game, x, y);
                newTile.setTile((Math.floor(Math.random() * 4)) as TileState);
                this.tiles[x][y] = newTile;
            }
        }
        //this.tileSize = this.tiles[0][0].tileSize;
    }

    public generateGridFromServer(gridData: number[][]) {
        this.tiles = [];

        for (let x = 0; x < this.gridWidth; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < this.gridHeight; y++) {
                let newTile: Tile = new Tile(this.game, x, y);
                newTile.setTile(gridData[x][y]);
                this.tiles[x][y] = newTile;
            }
        }
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

    public getAllTiles() {
        return this.tiles;
    }

    public getGridWidth() { return this.gridWidth; }
    public getGridHeight() { return this.gridHeight }
}