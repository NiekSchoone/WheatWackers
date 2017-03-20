class Player extends Phaser.Sprite
{
    public username: string;

    private grid: Grid;
    private speed: number = 5000;
    private cursors: Phaser.CursorKeys;
    private moving: boolean = false;
    private holdingKey: boolean = false;
    private playerScale: number;

    private moveDistance: number;

    private cutting: boolean = false;
    private cutTime: number = 1000;

    private holdingTool: boolean = true;
    private idleAnim;
    private walkAnim;

    public trapped: boolean = true;
    private holdingTreasure: boolean;

    constructor(game: Phaser.Game, grid: Grid, username: string, spawnPoint:any)
    {
        super(game, 0, 0, "idleRun1");

        this.game = game;
        this.grid = grid;
        this.username = username;
        
        this.animations.add("idle", [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71]);
        this.animations.add("walk", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]);
        this.animations.play("idle", 24, true);

        this.position.set(grid.getTile(2, 2).getX(), grid.getTile(2, 2).getY());

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
            this.holdingKey = true;
        }
        else if (this.cursors.down.isDown)
        {
            this.moveDownwards();
            this.holdingKey = true;
        }
        else if (this.cursors.left.isDown)
        {
            this.moveLeft();
            this.holdingKey = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.moveRight();
            this.holdingKey = true;
        }
        else
        {
            this.holdingKey = false;
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
            //this.scale.x = -0.5;
            this.scale.setTo(-0.5, 0.5);
            this.moveTowards(-1, 0);
        }
    }

    moveRight()
    {
        if (this.moving == false)
        {
            //this.scale.x = 0.5;
            this.scale.setTo(0.5, 0.5);
            this.moveTowards(1, 0);
        }
    }

    moveTowards(_x: number, _y: number)
    {
        console.log(this.x + " " + this.y );
        var tile = this.grid.getTileAtPlayer(this.x, this.y, _x, _y);

        if (tile && this.moving == false && this.trapped == false)
        {

            //console.log(tile.getX() + "  " + tile.getY());
            var tileState = tile.getState();

            if (tileState == TileState.CUT || tileState == TileState.NONE)
            {
                this.moving = true;
                var tween: Phaser.Tween = this.game.add.tween(this.body).to({ x: tile.getX() - Math.abs(this.width) / 2, y: tile.getY() - Math.abs(this.height) / 2 }, 500, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.onComplete, this);
                this.animations.play("walk", 24, true);
                //SOCKET.emit("player_move", { player: this.username, x: tile.getGridPosX(), y: tile.getGridPosY() });
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
        if (this.holdingKey == false)
        {
            this.animations.play("idle", 24, true);
        }

        this.moving = false;
    }

    public getTrapped(time: number)
    {
        this.trapped = true;
        this.game.time.events.add(time, this.getUntrapped);
    }

    getUntrapped()
    {
        this.trapped = false;
    }

    die()
    {

    }
}

