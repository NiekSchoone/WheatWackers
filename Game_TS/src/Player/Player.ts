class Player extends Phaser.Sprite
{
    public username: string;

    game: Phaser.Game;
    grid: Grid;
    speed: number = 1000;
    cursors: Phaser.CursorKeys;
    moving: boolean = false;

    moveDistance: number;
    cutTime: number = 1000;

    constructor(game: Phaser.Game, grid: Grid, username: string)
    {
        super(game, 0, 0, "failguy");
        console.log(TileState[1]);
        this.grid = grid;
        this.position.set(grid.getTile(0, 0).getX(), grid.getTile(0, 0).getY());
        this.anchor.setTo(0.5);

        this.moveDistance = this.grid.tilewidth;
        this.scale.setTo(1);
        this.game = game;

        this.username = username;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
        this.cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(this, Phaser.Camera.FOLLOW_LOCKON);
        game.world.setBounds(0, 0, 1920, 1080);
        game.camera.setSize(960, 540);
        game.camera.x = game.width / 2;
        game.camera.height = game.height / 2;
        
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
            var tileState = tile.GetState();

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

