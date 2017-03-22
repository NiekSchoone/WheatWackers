var Grid = (function () {
    function Grid(_game, _gridWidth, _gridHeight, callback) {
        this.game = _game;
        this.gridWidth = _gridWidth;
        this.gridHeight = _gridHeight;
        this.spawnAreaSize = 2;
        this.tileSize = 144;
        this.callBack = callback;
        var client = this;
        SOCKET.on("create_grid", function () {
            client.generateGrid();
            var serverData = [];
            for (var x = 0; x < client.gridWidth; x++) {
                serverData[x] = [];
                for (var y = 0; y < client.gridHeight; y++) {
                    serverData[x][y] = client.getTile(x, y).getState();
                }
            }
            SOCKET.emit("grid_created", serverData);
        });
        SOCKET.on("init_grid", function (gridData) {
            client.generateGridFromServer(gridData);
        });
        SOCKET.on("wheat_cutted", function (tilePos) {
            client.getTile(tilePos.x, tilePos.y).setTile(TileState.CUT);
        });
    }
    Grid.prototype.generateGrid = function () {
        this.tiles = [];
        this.midPointX = Math.floor(this.gridWidth / 2);
        this.midPointY = Math.floor(this.gridHeight / 2);
        this.obstacleDensity = 20;
        this.pickupDensity = 20;
        for (var x = 0; x < this.gridWidth; x++) {
            this.tiles[x] = [];
            for (var y = 0; y < this.gridHeight; y++) {
                var newTile = new Tile(this.game, x, y);
                if (x < this.midPointX + this.spawnAreaSize && x > (this.midPointX - this.spawnAreaSize) && y < this.midPointY + this.spawnAreaSize && y > (this.midPointY - this.spawnAreaSize)) {
                    newTile.setTile(TileState.CUT);
                }
                else if (x == 0 || y == 0 || x == (this.gridWidth - 1) || y == (this.gridHeight - 1)) {
                    newTile.setTile(TileState.OBSTACLE);
                    if (x == 0 && y == 0) {
                        newTile.GetSprite().loadTexture("fence_corner_top");
                    }
                    else if (x == (this.gridWidth - 1) && y == 0) {
                        newTile.GetSprite().loadTexture("fence_corner_top");
                        newTile.GetSprite().anchor.set(1 - newTile.getAnchor().x, newTile.getAnchor().y);
                        newTile.GetSprite().scale.setTo(-1, 1);
                    }
                    else if (x == 0 && y == (this.gridHeight - 1)) {
                        newTile.GetSprite().loadTexture("fence_corner_bottom");
                    }
                    else if (x == (this.gridWidth - 1) && y == (this.gridHeight - 1)) {
                        newTile.GetSprite().loadTexture("fence_corner_bottom");
                        newTile.GetSprite().anchor.set(1 - newTile.getAnchor().x, newTile.getAnchor().y);
                        newTile.GetSprite().scale.setTo(-1, 1);
                    }
                    else if (x == 0 && y != 0) {
                        newTile.GetSprite().loadTexture("fence_side");
                    }
                    else if (x == (this.gridWidth - 1) && y != 0) {
                        newTile.GetSprite().loadTexture("fence_side");
                        newTile.GetSprite().anchor.set(1 - newTile.getAnchor().x, newTile.getAnchor().y);
                        newTile.GetSprite().scale.setTo(-1, 1);
                    }
                    else if (x != 0 && y == 0) {
                        newTile.GetSprite().loadTexture("fence_top");
                    }
                    else if (x != 0 && y == (this.gridHeight - 1)) {
                        newTile.GetSprite().loadTexture("fence_bottom");
                    }
                }
                else if (Math.random() * 100 < this.obstacleDensity) {
                    newTile.setTile(TileState.OBSTACLE);
                }
                else if (Math.random() * 100 < this.pickupDensity) {
                    var newPickup = new PickUp(this.game, Math.random() * 4 + 1);
                    newTile.setPickup(newPickup);
                    newTile.setTile(TileState.WHEAT);
                }
                else {
                    newTile.setTile(TileState.WHEAT);
                }
                this.tiles[x][y] = newTile;
            }
        }
        this.callBack(this.tiles);
    };
    Grid.prototype.setPickupAlpha = function (alpha) {
        for (var x = 0; x < this.gridWidth; x++) {
            for (var y = 0; y < this.gridHeight; y++) {
                var tile = this.tiles[x][y];
                if (tile.getPickupStatus && tile.getState() != TileState.CUT) {
                    tile.setpickUpAlpha(alpha);
                }
            }
        }
    };
    Grid.prototype.generateGridFromServer = function (gridData) {
        this.tiles = [];
        for (var x = 0; x < this.gridWidth; x++) {
            this.tiles[x] = [];
            for (var y = 0; y < this.gridHeight; y++) {
                var newTile = new Tile(this.game, x, y);
                newTile.setTile(gridData[x][y]);
                if (x == 0 || y == 0 || x == (this.gridWidth - 1) || y == (this.gridHeight - 1)) {
                    if (x == 0 && y == 0) {
                        newTile.GetSprite().loadTexture("fence_corner_top");
                    }
                    else if (x == (this.gridWidth - 1) && y == 0) {
                        newTile.GetSprite().loadTexture("fence_corner_top");
                        newTile.GetSprite().anchor.set(1 - newTile.getAnchor().x, newTile.getAnchor().y);
                        newTile.GetSprite().scale.setTo(-1, 1);
                    }
                    else if (x == 0 && y == (this.gridHeight - 1)) {
                        newTile.GetSprite().loadTexture("fence_corner_bottom");
                    }
                    else if (x == (this.gridWidth - 1) && y == (this.gridHeight - 1)) {
                        newTile.GetSprite().loadTexture("fence_corner_bottom");
                        newTile.GetSprite().anchor.set(1 - newTile.getAnchor().x, newTile.getAnchor().y);
                        newTile.GetSprite().scale.setTo(-1, 1);
                    }
                    else if (x == 0 && y != 0) {
                        newTile.GetSprite().loadTexture("fence_side");
                    }
                    else if (x == (this.gridWidth - 1) && y != 0) {
                        newTile.GetSprite().loadTexture("fence_side");
                        newTile.GetSprite().anchor.set(1 - newTile.getAnchor().x, newTile.getAnchor().y);
                        newTile.GetSprite().scale.setTo(-1, 1);
                    }
                    else if (x != 0 && y == 0) {
                        newTile.GetSprite().loadTexture("fence_top");
                    }
                    else if (x != 0 && y == (this.gridHeight - 1)) {
                        newTile.GetSprite().loadTexture("fence_bottom");
                    }
                }
                this.tiles[x][y] = newTile;
            }
        }
        this.callBack(this.tiles);
    };
    Grid.prototype.getTileAtPlayer = function (playerX, playerY, directionX, directionY) {
        playerX -= (this.tileSize / 2);
        playerX = playerX / this.tileSize;
        playerX += directionX;
        playerY -= (this.tileSize / 2);
        playerY = playerY / this.tileSize;
        playerY += directionY;
        playerX = Math.round(playerX);
        playerY = Math.round(playerY);
        if ((playerX > this.tiles.length - 1 || playerX < 0) || (playerY > this.tiles[0].length - 1 || playerY < 0)) {
            return null;
        }
        else {
            return this.tiles[playerX][playerY];
        }
    };
    Grid.prototype.getTile = function (_x, _y) {
        return this.tiles[_x][_y];
    };
    Grid.prototype.getAllTiles = function () {
        return this.tiles;
    };
    Grid.prototype.getMidX = function () { return this.midPointX; };
    Grid.prototype.getMidY = function () { return this.midPointY; };
    Grid.prototype.getGridWidth = function () { return this.gridWidth; };
    Grid.prototype.getGridHeight = function () { return this.gridHeight; };
    return Grid;
}());
