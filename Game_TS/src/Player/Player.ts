class Player extends Phaser.Sprite
{
    public username: string;

    private grid: Grid;
    private speed: number = 5000;
    private cursors: Phaser.CursorKeys;
    private moving: boolean = false;

    private moveDistance: number;

    private cutting: boolean = false;
    private cutTime: number = 1000;
    
    private holdingTool: boolean = true;

    constructor(game: Phaser.Game, grid: Grid, username: string, spawnPoint:any)
    {
        super(game, 0, 0, "failguy");
        this.game = game;
        this.grid = grid;
        this.username = username;

        this.position.set(grid.getTile(spawnPoint.x, spawnPoint.y).getX(), grid.getTile(spawnPoint.x, spawnPoint.y).getY());
        this.anchor.setTo(0.5);

        this.moveDistance = this.grid.tileSize;
        this.scale.setTo(1);

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
        this.cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(this);
        game.camera.focusOnXY(this.x, this.y);
            
        game.world.setBounds(0, 0, 3024, 3024);
    }

    update()
    {
        if (this.cursors.up.isDown)
        {
            this.moveUpwards();
        }
        else if (this.cursors.down.isDown)
        {
            this.moveDownwards();
        }
        else if (this.cursors.left.isDown)
        {
            this.moveLeft();
        }
        else if (this.cursors.right.isDown)
        {
            this.moveRight();
        }

        if (this.cutting == true)
        {
            if (this.moving == true)
            {
                this.cutting = false;                
            }
        }
    }

    moveUpwards()
    {
        if (this.moving == false)
        {
            this.moveTowards(0, -1);
        }
    }

    moveDownwards()
    {
        if (this.moving == false)
        {
            this.moveTowards(0, 1);
        }
    }

    moveLeft()
    {
        if (this.moving == false)
        {
            this.moveTowards(-1, 0);
        }
    }

    moveRight()
    {
        if (this.moving == false)
        {
            this.moveTowards(1, 0);
        }
    }

    moveTowards(_x: number, _y: number)
    {
        var tile = this.grid.getTileAtPlayer(this.x, this.y, _x, _y);

        if (tile && this.moving == false)
        {
            var tileState = tile.getState();

            if (tileState == TileState.CUT || tileState == TileState.NONE)
            {
                this.moving = true;
                var tween: Phaser.Tween = this.game.add.tween(this.body).to({ x: tile.getX() - this.width / 2, y: tile.getY() - this.height / 2 }, 500, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.onComplete, this);
                SOCKET.emit("player_move", { player: this.username, x: tile.getGridPosX(), y: tile.getGridPosY() });
            }
            else if (tileState == TileState.WHEAT)
            {
                this.cutting = true;
                this.game.time.events.add(this.cutTime, this.cutWheat, this, tile);
            }
        }
    }

    cutWheat(tile: Tile)
    {
        if (this.cutting == true)
        {
            tile.setTile(TileState.CUT);
            this.onComplete();
            this.cutting = false;
            SOCKET.emit("wheat_cut", { x: tile.getGridPosX(), y: tile.getGridPosY() });
        }
    }

    onComplete()
    {
        this.moving = false;
    }
}

