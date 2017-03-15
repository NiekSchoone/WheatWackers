
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
        
    }

    update()
    {
        if (this.moving == false)
        {
            if (this.cursors.left.isDown)
            {
                this.moveTowards(this.x - 100, this.y);
            }
            if (this.cursors.right.isDown)
            {
                this.moveTowards(this.x + 100, this.y);
            }
            if (this.cursors.down.isDown)
            {
                this.moveTowards(this.x, this.y + 100);
            }
            if (this.cursors.up.isDown)
            {
                this.moveTowards(this.x, this.y - 100);
            }
        }
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

