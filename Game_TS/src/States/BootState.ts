class BootState extends Phaser.State {

    preload() {
        this.game.load.image('loading', 'assets/images/ui/loading_image.png');
    }

    create() {
        this.initStates();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.state.start("Preloader");
    }

    initStates() {
        this.game.state.add("Preloader", Preloader);
        this.game.state.add("MenuState", MenuState);
        this.game.state.add("GameState", GameState);
    }
}