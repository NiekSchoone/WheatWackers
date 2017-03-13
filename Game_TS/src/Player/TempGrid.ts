class TempGrid extends Phaser.Sprite
{

    rows: Array<Array<Phaser.Sprite>>;

    constructor(game: Phaser.Game)
    {
        super(game, 0, 0);
        this.anchor.setTo(0.5);
        this.scale.set(0.25);
        this.createGrid();
    }

    private createGrid()
    {
        this.rows = new Array<Array<Phaser.Sprite>>();

        for (var i = 0; i < 3; i++)
        {
            var row: Array<Phaser.Sprite> = new Array<Phaser.Sprite>();

            for (var k = 0; k < 3; k++)
            {
                var tile = new TempTile(this.game);
               
                tile.x =    tile.width * k;
                tile.y = tile.height * i;

                this.addChild(tile);

                row.push(tile);
            }
            
            this.rows.push(row);
        }
    }
}