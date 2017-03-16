class Player extends Phaser.Sprite
{
    public username: string;

    private grid: Grid;
    private speed: number = 1000;
    private cursors: Phaser.CursorKeys;
    private moving: boolean = false;

    private moveDistance: number;
    private cutTime: number = 1000;

    constructor(game: Phaser.Game, grid: Grid, username: string)
    {
        super(game, 0, 0, "failguy");
        this.game = game;
        this.grid = grid;
        this.username = username;

        this.position.set(grid.getTile(5, 5).getX(), grid.getTile(5, 5).getY());
        this.anchor.setTo(0.5);

        this.moveDistance = this.grid.tileSize;
        this.scale.setTo(1);

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
        this.cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(this, Phaser.Camera.FOLLOW_LOCKON);
        game.world.setBounds(0, 0, 10920, 10080);
        game.camera.setSize(1920, 1080);
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

    }

    moveUpwards()
    {
        if (this.moving == false)
        {
            var tile = this.grid.getTileAtPlayer(this.x, this.y, 0, -1);

            this.moveTowards(this.x, this.y - this.moveDistance, tile);
        }
    }

    moveDownwards()
    {
        if (this.moving == false)
        {
            var tile = this.grid.getTileAtPlayer(this.x, this.y, 0, 1);

            this.moveTowards(this.x, this.y + this.moveDistance, tile);
        }
    }

    moveLeft()
    {
        if (this.moving == false)
        {
            var tile = this.grid.getTileAtPlayer(this.x, this.y, -1, 0);

            this.moveTowards(this.x - this.moveDistance, this.y, tile);
        }
    }

    moveRight()
    {
        if (this.moving == false)
        {
            var tile = this.grid.getTileAtPlayer(this.x, this.y, 1, 0);

            this.moveTowards(this.x + this.moveDistance, this.y, tile);
        }
    }

    moveTowards(_x: number, _y: number, tile: Tile)
    {
        
        if (tile && this.moving == false)
        {
            var tileState = tile.getState();

            if (tileState == TileState.CUT || tileState == TileState.NONE)
            {
                this.moving = true;
                var tween: Phaser.Tween = this.game.add.tween(this.body).to({ x: _x - this.width / 2, y: _y - this.height / 2 }, this.game.physics.arcade.distanceToXY(this, _x, _y) / this.speed * 1000, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.onComplete, this);
            }
            else if (tileState == TileState.WHEAT)
            {
                this.moving = true;
                this.game.time.events.add(this.cutTime, this.cutWheat, this, tile);
            }
        }
    }

    cutWheat(tile: Tile)
    {
        tile.setTile(TileState.CUT);  
        this.onComplete();       
    }

    onComplete()
    {
        this.moving = false;
    }
}

