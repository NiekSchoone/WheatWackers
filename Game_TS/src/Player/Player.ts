class Player extends Phaser.Sprite
{
    game: Phaser.Game
    speed: number = 1000;
    cursors: Phaser.CursorKeys;
    moving: boolean = false;
    constructor(game: Phaser.Game)
    {
        super(game, 0, 0, "failguy");
        this.position.set(0, 0);
        this.anchor.setTo(0.5);
        this.scale.setTo(0.5);
        this.game = game;   
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);

        this.cursors = game.input.keyboard.createCursorKeys();
        this.cursors.up.onDown.add(this.moveUpwards);
        this.cursors.down.onDown.add(this.moveDownwards);
        this.cursors.left.onDown.add(this.moveLeft);
        this.cursors.right.onDown.add(this.moveRight);
    }

    moveUpwards()
    {
        this.moveTowards(this.x, this.y - 100);
    }

    moveDownwards()
    {
        this.moveTowards(this.x, this.y + 100); 
    }

    moveLeft()
    {
        this.moveTowards(this.x - 100, this.y);
    }

    moveRight()
    {
        this.moveTowards(this.x + 100, this.y);
    }

                  //100000 - this.speed * 100
    moveTowards(_x: number, _y: number)
    {
        //console.log("x: " + this.x + " y: " + this.y);
        console.log(this.width);
        this.moving = true;
        var tween : Phaser.Tween = this.game.add.tween(this.body).to({ x: _x - this.width / 2, y: _y - this.height / 2 }, this.game.physics.arcade.distanceToXY(this, _x, _y) / this.speed * 1000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.onComplete, this);
    }

    onComplete()
    {
        this.moving = false;    
    }

}

