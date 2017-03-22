class Preloader extends Phaser.State {

    preload() {
        this.game.load.image('background', 'assets/images/level/background.jpg');
        this.game.load.image('wheat_1', 'assets/images/level/wheat_01.png');
        this.game.load.image('wheat_2', 'assets/images/level/wheat_02.png');
        this.game.load.image('wheat_3', 'assets/images/level/wheat_03.png');
        this.game.load.image('wheat_4', 'assets/images/level/wheat_04.png');
        this.game.load.image('wheat_5', 'assets/images/level/wheat_05.png');
        this.game.load.image('wheat_cut_1', 'assets/images/level/wheat_cut_01.png');
        this.game.load.image('wheat_cut_2', 'assets/images/level/wheat_cut_02.png');
        this.game.load.image('wheat_cut_3', 'assets/images/level/wheat_cut_03.png');
        this.game.load.image('obstacle_1', 'assets/images/level/obstacle_01.png');
        this.game.load.image('obstacle_2', 'assets/images/level/obstacle_02.png');
        this.game.load.image('obstacle_3', 'assets/images/level/obstacle_03.png');
        this.game.load.image('button_join', 'assets/images/ui/button_join.png');
        this.game.load.image('menuBackground', 'assets/images/MenuBackground.jpg');
        this.game.load.spritesheet('CreateButton', 'assets/images/UI/buttonCreate.png', 512, 256);
        this.game.load.spritesheet('HowToButton', 'assets/images/UI/buttonHowTo.png', 512, 256);
        this.game.load.spritesheet('JoinButton', 'assets/images/UI/buttonJoin.png', 512, 256);
    }
    create()
    {
        this.initStates();

        this.game.state.start("MenuState")
    }
    initStates() {
        this.game.state.add("MenuState", MenuState);
        this.game.state.add("GameState", GameState);
    }
}