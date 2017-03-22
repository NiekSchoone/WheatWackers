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
        this.game.load.image('PickUp_Cow', 'assets/images/PickUp/cow.png');
        this.game.load.image('PickUp_WaterCan', 'assets/images/PickUp/waterCan.png');
        this.game.load.image('PickUp_MouseTrap', 'assets/images/PickUp/mouseTrap.png');
        this.game.load.image('PickUp_Shovel', 'assets/images/PickUp/Shovel.png');
        this.game.load.image('PickUp_tool', 'assets/images/PickUps/pickup_sikkel_001.png');
        this.game.load.image('treasure', 'assets/images/treasure/treasure.png');
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