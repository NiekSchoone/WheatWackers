class Grid{
    game: Phaser.Game;
    gridWidth: number;
    gridHeight: number;
    Tiles: Tile[][];
    space: Phaser.Key;

    constructor(_game: Phaser.Game) {
        this.game = _game;
    }

    public generateGrid(_gridWidth: number, _gridHeight: number) {
        this.gridWidth = _gridWidth;
        this.gridHeight = _gridHeight;
        this.Tiles = [];

        for (let x = 0; x < this.gridWidth; x++){
            this.Tiles[x] = [];
            for (let y = 0; y < this.gridHeight; y++) {
                let newTile: Tile = new Tile(this.game, x, y);
                //newTile.setTile(true);
                this.Tiles[x][y] = newTile;
            }
        }
    }

    public getTile(_x: number, _y: number) {
        return this.Tiles[_x][_y];
    }
}