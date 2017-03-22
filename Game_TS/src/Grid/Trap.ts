class Trap extends Phaser.Sprite    
{
    public owner: string;
    public trapTime: number;    

    constructor(game: Phaser.Game, trapTime : number = 0)
    {
        super(game,0,0,"");
        this.trapTime = trapTime;
        this.anchor.set(0.5);

        if (trapTime == 0)
        {
            this.loadTexture("pitTrap");
        }
        else
        {
            this.loadTexture("mouseTrap");
        }
    }

    public activateTrap(target:Player)
    {
        if (this.trapTime != 0)
        {
            target.getTrapped(this.trapTime);
        }
        else
        {
            target.respawn();
        }
    }
}