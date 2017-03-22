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

    public spawnAnimation: Phaser.Sprite;

    public playerID: number;
    public spawnPoint: any;

    public trapped: boolean = false;
    private holdingTreasure: boolean;

    private targetTile: Tile;

    constructor(game: Phaser.Game, grid: Grid, id: number, username: string, spawnPoint: any, spawnAnim: Phaser.Sprite) {
        super(game, 0, 0, "player_" + id);

        this.game = game;
        this.grid = grid;
        this.playerID = id;
        this.username = username;
        this.spawnPoint = spawnPoint

        this.spawnAnimation = spawnAnim;

        this.animations.add("idle", Phaser.ArrayUtils.numberArray(62, 101));
        this.animations.add("walk", Phaser.ArrayUtils.numberArray(0, 30));
        this.animations.add("cut", Phaser.ArrayUtils.numberArray(162, 175));
        this.animations.play("idle", 24, true);

        this.spawnAnimation.anchor.set(0.5, 0.88);
        this.spawnAnimation.animations.add('spawn', Phaser.ArrayUtils.numberArray(0, 15));
        this.game.add.existing(this.spawnAnimation);
        this.spawnAnimation.animations.play('spawn', 24, false, true);

        this.position.set(grid.getTile(spawnPoint.x, spawnPoint.y).getX(), grid.getTile(spawnPoint.x, spawnPoint.y).getY());

        this.anchor.setTo(0.5, 0.75);

        this.moveDistance = this.grid.tileSize;

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);
        this.cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(this);
        game.camera.focusOnXY(this.x, this.y);

        game.world.setBounds(0, 0, this.grid.getGridWidth() * 144, this.grid.getGridHeight() * 144);
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

    moveLeft() {
        if (this.moving == false) {
            this.scale.setTo(-1, 1);
            this.moveTowards(-1, 0);
        }
    }

    moveRight() {
        if (this.moving == false) {
            this.scale.setTo(1, 1);
            this.moveTowards(1, 0);
        }
    }

    moveTowards(_x: number, _y: number) {
        var tile = this.grid.getTileAtPlayer(this.x, this.y, _x, _y);

        if (tile && this.moving == false && this.trapped == false && this.cutting == false) {
            var tileState = tile.getState();

            if (tileState == TileState.CUT || tileState == TileState.NONE) {
                this.moving = true;
                this.animations.play("walk", 24, true);
                var tween: Phaser.Tween = this.game.add.tween(this.body).to({ x: tile.getX() - Math.abs(this.width) * 0.5, y: tile.getY() - Math.abs(this.height) * 0.75 }, 500, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.onComplete, this);
                SOCKET.emit("player_move", { player: this.username, x: tile.getGridPosX(), y: tile.getGridPosY() });
            }
            else if (tileState == TileState.WHEAT) {
                this.moving = false;
                this.animations.play("cut", 24, true);
                this.cutting = true;
                this.game.time.events.add(this.cutTime, this.cutWheat, this, tile);
            }
        }
    }

    cutWheat(tile: Tile) {
        if (this.cutting == true) {
            tile.setTile(TileState.CUT);
            tile.playCutAnim();
            this.onComplete();
            this.cutting = false;
            SOCKET.emit("wheat_cut", { x: tile.getGridPosX(), y: tile.getGridPosY() });
        }
    }

    onComplete() {
        if (this.holdingKey == false) {
            this.animations.play("idle", 24, true);
        }

        this.moving = false;
        
        this.targetTile.checkTile(this);
    }

    public getTrapped(time: number)
    {
        this.trapped = true;
        this.game.time.events.add(time, this.getUntrapped, this);
        alert("Trapped");
    }

    getUntrapped()
    {
        this.trapped = false;
        alert("Released");
    }

    public respawn()
    {
        this.position.set(this.grid.getTile(this.spawnPoint.x, this.spawnPoint.y).getX(), this.grid.getTile(this.spawnPoint.x, this.spawnPoint.y).getY());
        this.spawnAnimation.animations.play('spawn', 24, false, true);
    }

    placeTrap()
    {
        if (this.moving == false)
        {
            var tile: Tile = this.grid.getTileAtPlayer(this.x, this.y, 0, 0);

            if (tile.getTrapStatus() == false)
            {
                var newTrap: Trap = new Trap(this.game, 10000);
                tile.setTrap(newTrap, "FFF");
            }
        }
    }
}