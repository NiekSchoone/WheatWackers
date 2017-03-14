class Player extends Phaser.Sprite
{
    public username: string;

    game: Phaser.Game;
    grid: Grid;
    speed: number = 1000;
    cursors: Phaser.CursorKeys;
    moving: boolean = false;

    moveDistance: number;

    constructor(game: Phaser.Game, grid : Grid, username : string)
    {
        super(game, 0, 0, "failguy");

        this.grid = grid;
        this.position.set(grid.getTile(0, 0).getX(), grid.getTile(0, 0).getY());
        this.anchor.setTo(0.5);

        this.moveDistance = this.grid.tilewidth;
        console.log(this.moveDistance);
        this.scale.setTo(1);
        this.game = game;

        this.username = username; 
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);

        this.cursors = game.input.keyboard.createCursorKeys();
        this.cursors.up.onDown.add(this.moveUpwards, this);
        this.cursors.down.onDown.add(this.moveDownwards, this);
        this.cursors.left.onDown.add(this.moveLeft, this);
        this.cursors.right.onDown.add(this.moveRight, this);
    }

    moveUpwards()
    {
        this.moveTowards(this.x, this.y - this.moveDistance);
    }

    moveDownwards()
    {
        this.moveTowards(this.x, this.y + this.moveDistance); 
    }

    moveLeft()
    {
        this.moveTowards(this.x - this.moveDistance, this.y);
    }

    moveRight()
    {
        if (this.grid.getTileAtPlayer(this.x, this.y, 1 ,0 ))
        {
               this.moveTowards(this.x + this.moveDistance, this.y);
        }
        
    }

    moveTowards(_x: number, _y: number)
    {
        this.moving = true;
        var tween: Phaser.Tween = this.game.add.tween(this.body).to({ x: _x - this.width / 2, y: _y - this.height / 2}, this.game.physics.arcade.distanceToXY(this, _x, _y) / this.speed * 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.onComplete, this);
    }

    onComplete()
    {
        this.moving = false;    
    }
}

