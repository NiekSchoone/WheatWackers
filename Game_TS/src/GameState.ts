class GameState{
    private game: Phaser.Game;

    private gamefield: Grid;
    private spawnPonits: Tile[];
    private players: Humanoid[];
    public gameState() {
        //this.gamefield = new Grid(this.game, 35, 35);
        //if first player
        
        this.gamefield.generateGrid()
        // else get grid from server;
        //this.gamefield.generateGridFromServer();
    }
    private joinGame() {
        //send
    }
    private newPlayer() {
    }
    private newGame() {
        this.gamefield.generateGrid();
        for (let i = 0; i < this.players.length; i++) {
        }
    }

}