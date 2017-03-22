class Player extends Phaser.Sprite
{
    public username: string;

    private grid: Grid;
    public speed: number = 5000;
    private cursors: Phaser.CursorKeys;
    private moving: boolean = false;
    private holdingKey: boolean = false;
    private playerScale: number;

    private moveDistance: number;

    private cutting: boolean = false;
    private cutTime: number = 1000;

    public holdingTool: boolean = true;
    private toolKey;

    public spawnAnimation: Phaser.Sprite;

    public playerID: number;
    public spawnPoint: any;

    public trapped: boolean = false;
    private holdingTreasure: boolean;

    private targetTile: Tile;

    public hasTreasure: boolean = false;
    public hasMouseTrap: boolean = true;
    public hasPitTrap: boolean = true;

    private trapKey1: any;
    private trapKey2: any;



    constructor(game: Phaser.Game, grid: Grid, id: number, username: string, spawnPoint: any)
    {
        super(game, 0, 0, "player_" + id);

        this.game = game;
        this.grid = grid;
        this.playerID = id;
        this.username = username;
        this.spawnPoint = spawnPoint

        //this.spawnAnimation = spawnAnim;

        this.animations.add("idle", Phaser.ArrayUtils.numberArray(62, 101));
        this.animations.add("walk", Phaser.ArrayUtils.numberArray(0, 30));
        this.animations.add("cut", Phaser.ArrayUtils.numberArray(162, 175));

        this.animations.add("treasureWalk", Phaser.ArrayUtils.numberArray(31, 36));
        this.animations.add("treasureIdle", Phaser.ArrayUtils.numberArray(102, 161));

        this.animations.add("emptyWalk", Phaser.ArrayUtils.numberArray(176, 206));
        this.animations.add("emptyIdle", Phaser.ArrayUtils.numberArray(207, 245));
        this.animations.play("idle", 24, true);

        //this.spawnAnimation.anchor.set(0.5, 0.88);
        //this.spawnAnimation.animations.add('spawn', Phaser.ArrayUtils.numberArray(0, 15));
        //this.game.add.existing(this.spawnAnimation);
        //this.spawnAnimation.animations.play('spawn', 24, false, true);

        this.position.set(grid.getTile(2, 2).getX(), grid.getTile(2, 2).getY());

        this.anchor.setTo(0.5, 0.75);

        this.moveDistance = this.grid.tileSize;

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
        this.cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(this);
        game.camera.focusOnXY(this.x, this.y);

        game.world.setBounds(0, 0, this.grid.getGridWidth() * 144, this.grid.getGridHeight() * 144);

        this.toolKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.trapKey1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        this.trapKey2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);

        this.toolKey.onDown.add(this.equipTool, this);
        this.trapKey1.onDown.add(this.placeTrapOne, this);
        this.trapKey2.onDown.add(this.placeTrapTwo, this);

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


        if (tile && this.moving == false && this.trapped == false && this.cutting == false)
        {
            var tileState = tile.getState();
            this.targetTile = tile;
            if (tileState == TileState.CUT || tileState == TileState.NONE || (tileState == TileState.WHEAT && this.holdingTool == false))
            {
                this.moving = true;
                if (this.hasTreasure == false && this.holdingTool == true)
                {
                    this.animations.play("walk", 24, true);
                }
                else if (this.hasTreasure == true)
                {                                      
                    this.animations.play("treasureWalk", 24, true);
                }
                else
                {
                    this.animations.play("emptyWalk", 24, true);
                }               
                var tween: Phaser.Tween = this.game.add.tween(this.body).to({ x: tile.getX() - Math.abs(this.width) * 0.5, y: tile.getY() - Math.abs(this.height) * 0.75 }, 500, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.onComplete, this);
                
                //SOCKET.emit("player_move", { player: this.username, x: tile.getGridPosX(), y: tile.getGridPosY() });
            }
            else if (tileState == TileState.WHEAT && this.holdingTool == true)
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
            tile.playCutAnim();
            //this.onComplete();
            this.cutting = false;
            //SOCKET.emit("wheat_cut", { x: tile.getGridPosX(), y: tile.getGridPosY() });
        }
    }

    onComplete()
    {
        if (this.holdingKey == false)
        {
            if (this.hasTreasure == false && this.holdingTool == true)
            {
                this.animations.play("idle", 24, true);
            }
            else if (this.hasTreasure == true)
            {
                this.animations.play("treasureIdle", 24, true);
            }
            else
            {
                this.animations.play("emptyIdle", 24, true);
            }
            
        }

        this.moving = false;

        this.targetTile.checkTile(this);
    }

    public getTrapped(time: number)
    {
        this.trapped = true;
        this.game.time.events.add(time, this.getUntrapped, this);
    }

    public pickUpTreasure()
    {
        this.hasTreasure = true;
    }

    getUntrapped()
    {
        this.trapped = false;
    }

    public respawn()
    {
        this.position.set(this.grid.getTile(this.spawnPoint.x, this.spawnPoint.y).getX(), this.grid.getTile(this.spawnPoint.x, this.spawnPoint.y).getY());
        this.spawnAnimation.animations.play('spawn', 24, false, true);
    }

    placeTrapOne()
    {
        if (this.moving == false && this.hasMouseTrap == true)
        {
            var tile: Tile = this.grid.getTileAtPlayer(this.x, this.y, 0, 0);

            if (tile.getTrapStatus() == false)
            {
                var newTrap: Trap = new Trap(this.game, 10000);
                tile.setTrap(newTrap, this.username);
                this.hasMouseTrap = false;
            }
        }
    }

    placeTrapTwo()
    {
        if (this.moving == false && this.hasPitTrap == true)
        {
            var tile: Tile = this.grid.getTileAtPlayer(this.x, this.y, 0, 0);

            if (tile.getTrapStatus() == false)
            {
                var newTrap: Trap = new Trap(this.game);
                tile.setTrap(newTrap, this.username);
                this.hasPitTrap = false;
            }
        }
    }

    equipTool()
    {
        if (this.holdingTool == true)
        {
            this.holdingTool = false;
            this.grid.getTileAtPlayer(this.x, this.y, 0, 0).setPickup(new PickUp(this.game, "sickle"));
        }
    }

}