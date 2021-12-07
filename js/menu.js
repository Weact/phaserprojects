class menu extends Phaser.Scene{
    start_button;
    exit_button;
    myScene;

    constructor(){
        super("menu");
    }

    init(data) {}
    preload() {
        this.load.image('btn_startgame', game_objects_path.btn_startgame);
        this.load.image('btn_exitgame', game_objects_path.btn_exitgame);
    }
    create(data) {
        myScene = this;
        start_button = myScene.add.image(500, 500, 'btn_startgame').setScale(1, 1).setOrigin(0,0).setDepth(1000).setInteractive();
        start_button.on('pointerdown', (myPointer, objectsClicked) => {
            startgame();
        })
    }
    update(time, delta) {}
    startgame(){
        myScene.scene.start('key');
    }
}