class Trap extends Phaser.Sprite    
{
    public owner: string;
    public trapTime: number;    

    constructor(game: Phaser.Game, trapTime : number = 0)
    {
        super(game,0,0,"trap");
        this.trapTime = trapTime;
        this.anchor.set(0.5);
    }

    public activateTrap(target:Player)
    {
        if (this.trapTime != 0)
        {
            target.getTrapped(this.trapTime);
        }
        else
        {
            target.respawn(0, 0);
        }
    }
}