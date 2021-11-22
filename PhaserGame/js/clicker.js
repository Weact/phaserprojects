var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 968,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

var game = new Phaser.Game(config);

var myScene;
var myPointer;

var xion_object = new xion(1);

var xion_collected_text;
var xion_collected_text_base = " XION COLLECTED";

function preload(){
    myScene = this;
    myPointer = this.input.activePointer;

    this.load.image('game_background', game_objects_path.game_background);

    this.load.spritesheet('gear', game_objects_path.gear.path, game_objects_path.gear.dim );
    this.load.spritesheet('golden_gear', game_objects_path.golden_gear.path, game_objects_path.golden_gear.dim );
    this.load.image('xion', game_objects_path.xion);

}

function create(){
    let bg_image = this.add.image(0, 0, 'game_background').setOrigin(0, 0);
    let bg_scaleX = this.cameras.main.width / bg_image.width
    let bg_scaleY = this.cameras.main.height / bg_image.height
    let bg_scale = Math.max(bg_scaleX, bg_scaleY)
    bg_image.setScale(bg_scale).setScrollFactor(0)

    let xion_image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'xion').setScale(5).setInteractive();
    let xion_event = xion_image.on('pointerdown', _on_xion_clicked);

    xion_collected_text = this.add.text(16, 16, game_progression.xion + xion_collected_text_base, { fontSize: '64px', fill: '#FFF'});
    update_xion_collected_text();
}

function update(){
    
}

function update_xion_collected_text(){
    xion_collected_text.setText(game_progression.xion + xion_collected_text_base);
}

function _on_xion_clicked(){
    game_progression.xion += Math.round(xion_object.value * game_progression.multiplier, 0);
    update_xion_collected_text();
    _on_xion_changed(game_progression.xion);
}
function _on_xion_changed(value){
    if (value === 10){
        game_progression.multiplier = 2.0;
    }else{
        if(value === 500){
            game_progression.multiplier = 3.0;
        }else{
            if(value === 7000){
                game_progression.multiplier = 4.0;
            }else{
                if(value === 1000000){
                    game_progression.multiplier = 5.0;
                }
            }
        }
    }
}