var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Preloader = (function (_super) {
    __extends(Preloader, _super);
    function Preloader() {
        _super.apply(this, arguments);
    }
    Preloader.prototype.preload = function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.enable(this);
        this.loadingImage = this.game.add.sprite(150, 150, "loading");
        this.loadingImage.anchor.setTo(0.5, 0.5);
        this.game.load.image('menuBackground', 'assets/images/MenuBackground.jpg');
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
        this.game.load.image('PickUp_tool', 'assets/images/PickUp/pickup_sikkel_001.png');
        this.game.load.image('treasure', 'assets/images/treasure/treasure.png');
        this.game.load.image('fence_side', 'assets/images/level/fence_side.png');
        this.game.load.image('fence_bottom', 'assets/images/level/fence_bottom.png');
        this.game.load.image('fence_top', 'assets/images/level/fence_top.png');
        this.game.load.image('fence_corner_top', 'assets/images/level/fence_corner_top.png');
        this.game.load.image('fence_corner_bottom', 'assets/images/level/fence_corner_bottom.png');
        this.game.load.image('button_join', 'assets/images/ui/button_join.png');
        this.game.load.image('ui_bar', 'assets/images/ui/ui_bar.png');
        this.game.load.spritesheet('spawn_anim', 'assets/spritesheets/spawn_anim.png', 500, 800);
        this.game.load.spritesheet('player_0', 'assets/spritesheets/player_1.png', 150, 150);
        this.game.load.spritesheet('player_1', 'assets/spritesheets/player_2.png', 150, 150);
        this.game.load.spritesheet('player_2', 'assets/spritesheets/player_3.png', 150, 150);
        this.game.load.spritesheet('player_3', 'assets/spritesheets/player_4.png', 150, 150);
        this.game.load.spritesheet('wheat_cut_anim', 'assets/spritesheets/wheat_cut_anim.png', 256, 256);
        this.game.load.spritesheet('CreateButton', 'assets/images/ui/buttonCreate.png', 512, 256);
        this.game.load.spritesheet('HowToButton', 'assets/images/ui/buttonHowTo.png', 512, 256);
        this.game.load.spritesheet('JoinButton', 'assets/images/ui/buttonJoin.png', 512, 256);
        this.game.load.audio('music_loop', 'assets/audio/music_loop.mp3');
        this.game.load.audio('button_sound', 'assets/audio/button_sound.mp3');
        this.game.load.audio('spawn_sound', 'assets/audio/spawn_sound.mp3');
        this.game.load.audio('walk_sound', 'assets/audio/walk_sound.mp3');
        this.game.load.audio('cut_sound', 'assets/audio/cut_sound.mp3');
        this.game.load.audio('cow_sound', 'assets/audio/cow_sound.mp3');
    };
    Preloader.prototype.update = function () {
        this.loadingImage.angle += 1;
    };
    Preloader.prototype.create = function () {
        this.initStates();
        var client = this;
        this.camera.onFadeComplete.add(function () {
            client.game.state.start("MenuState");
        });
        this.game.camera.fade(0x000000, 1000);
    };
    Preloader.prototype.initStates = function () {
        this.game.state.add("MenuState", MenuState);
        this.game.state.add("GameState", GameState);
    };
    return Preloader;
}(Phaser.State));
