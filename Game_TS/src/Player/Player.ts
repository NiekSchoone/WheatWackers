﻿class Player extends Phaser.Sprite
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

    public playerID: number;
    public spawnPoint: any;

    constructor(game: Phaser.Game, grid: Grid, id:number, username: string, spawnPoint:any)
    {
        super(game, 0, 0, "player_" + id);

        this.game = game;
        this.grid = grid;
        this.playerID = id;
        this.username = username;
        this.spawnPoint = spawnPoint

        this.animations.add("idle", Phaser.ArrayUtils.numberArray(62,101));
        this.animations.add("walk", Phaser.ArrayUtils.numberArray(0, 30));
        this.animations.add("cut", Phaser.ArrayUtils.numberArray(162, 175));
        this.animations.play("idle", 24, true);

        this.position.set(grid.getTile(spawnPoint.x, spawnPoint.y).getX(), grid.getTile(spawnPoint.x, spawnPoint.y).getY());

        this.anchor.setTo(0.5, 0.75);

        this.moveDistance = this.grid.tileSize;

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
            this.scale.setTo(-1, 1);
            this.moveTowards(-1, 0);
        }
    }

    moveRight()
    {
        if (this.moving == false)
        {
            this.scale.setTo(1, 1);
            this.moveTowards(1, 0);
        }
    }

    moveTowards(_x: number, _y: number)
    {
        var tile = this.grid.getTileAtPlayer(this.x, this.y, _x, _y);

        console.log(this.z);
        console.log(tile.GetSprite().z);
        if (tile && this.moving == false)
        {
            var tileState = tile.getState();

            if (tileState == TileState.CUT || tileState == TileState.NONE)
            {
                this.moving = true;
                var tween: Phaser.Tween = this.game.add.tween(this.body).to({ x: tile.getX() - Math.abs(this.width) * 0.5, y: tile.getY() - Math.abs(this.height) * 0.75 }, 500, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.onComplete, this);
                this.animations.play("walk", 24, true);
                SOCKET.emit("player_move", { player: this.username, x: tile.getGridPosX(), y: tile.getGridPosY() });
            }
            else if (tileState == TileState.WHEAT)
            {
                this.moving = false;
                this.animations.play("cut", 24, true);
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
}

