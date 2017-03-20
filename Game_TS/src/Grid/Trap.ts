class Trap
{
    public owner: string;
    public trapTime: number;    

    constructor(owner : string, trapTime : number = 0)
    {
        this.owner = owner;
        this.trapTime = trapTime;   
    }

    public activateTrap(target:Player)
    {
        if (this.trapTime != 0)
        {
            target.getTrapped(this.trapTime);
        }
        else
        {
            target.die();
        }
    }
}