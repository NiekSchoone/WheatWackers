class Grid{
    private game: Phaser.Game;
    private gridWidth: number;
    private gridHeight: number;
    private tiles: Tile[][];
    private obstacleDensity: number;
    private spawnAreaSize: number;
    public tileSize: number;

    private callBack: any;

    private midPointX: number;
    private midPointY: number

    constructor(_game: Phaser.Game, _gridWidth: number, _gridHeight: number, callback: (tiles: Tile[][]) => any) {
        this.game = _game;
        this.gridWidth = _gridWidth;
        this.gridHeight = _gridHeight;

        this.spawnAreaSize = 2;
        this.tileSize = 144;

        this.callBack = callback;
        
        let client = this;
        client.generateGrid();
        //SOCKET.on("create_grid", function () {
            
        //    let serverData = [];
        //    for (var x = 0; x < client.gridWidth; x++) {
        //        serverData[x] = [];
        //        for (var y = 0; y < client.gridHeight; y++) {
        //            serverData[x][y] = client.getTile(x, y).getState() as number;
        //        }
        //    }
        //    SOCKET.emit("grid_created", serverData);
        //});
        //SOCKET.on("init_grid", function (gridData) {
        //    client.generateGridFromServer(gridData);
        //});

        //SOCKET.on("wheat_cutted", function (tilePos) {
        //    client.getTile(tilePos.x, tilePos.y).setTile(TileState.CUT);
        //});
    }

    public generateGrid() {
        this.tiles = [];
        this.midPointX = Math.floor(this.gridWidth / 2);
        this.midPointY = Math.floor(this.gridHeight / 2);


        this.obstacleDensity = 20;
        for (let x = 0; x < this.gridWidth; x++){
            this.tiles[x] = [];
            for (let y = 0; y < this.gridHeight; y++) {
                let newTile: Tile = new Tile(this.game, x, y);
                if (x < this.midPointX + this.spawnAreaSize && x > (this.midPointX - this.spawnAreaSize) && y < this.midPointY + this.spawnAreaSize && y > (this.midPointY - this.spawnAreaSize)) {
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
        this.callBack(this.tiles);
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
        this.callBack(this.tiles);
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
    public getMidX() { return this.midPointX; }
    public getMidY() { return this.midPointY; }
    public getGridWidth() { return this.gridWidth; }
    public getGridHeight() { return this.gridHeight }
}