class Humanoid extends Phaser.Sprite {
    private speed: number = 1000;
    private grid: Grid;
    private cursorkeys;

    private spawnPoint: any;
    public spawnAnimation: Phaser.Sprite;

    public playerID: number;
    public username: string;

    constructor(game: Phaser.Game, grid: Grid, id: number, username: string, x: number, y: number, spawnAnim: Phaser.Sprite) {
        super(game, 0, 0, "player_" + id);

        this.grid = grid;
        this.spawnPoint = { x: x, y: y };
        this.username = username;
        this.playerID = id;

        this.spawnAnimation = spawnAnim;

        this.animations.add("idle", Phaser.ArrayUtils.numberArray(62, 101));
        this.animations.add("walk", Phaser.ArrayUtils.numberArray(0, 30));
        this.animations.play("idle", 24, true);

        this.spawnAnimation.anchor.set(0.5, 0.88);
        this.spawnAnimation.animations.add('spawn', Phaser.ArrayUtils.numberArray(0, 15));
        this.game.add.existing(this.spawnAnimation);
        this.spawnAnimation.animations.play('spawn', 24, false, true);

        this.position.set(grid.getTile(x, y).getX(), grid.getTile(x, y).getY());

        this.anchor.setTo(0.5, 0.75);

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this);

        this.cursorkeys = new Phaser.Key(game, 32);
    }

    public moveTowards(x: number, y: number) {
        var tile: Tile = this.grid.getTile(x, y);

        if (this.x > tile.getX()) {
            this.scale.setTo(-1, 1);
        } else if (this.x < tile.getX()) {
            this.scale.setTo(1, 1);
        }
        this.animations.play("walk", 24, true);
        var tween: Phaser.Tween = this.game.add.tween(this.body).to({ x: tile.getX() - Math.abs(this.width) * 0.5, y: tile.getY() - Math.abs(this.height) * 0.75 }, 500, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.onComplete, this);
    }

    onComplete() {
        this.animations.play("idle", 24, true);
    }
}