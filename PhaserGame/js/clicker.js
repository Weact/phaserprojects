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

var xion_image;

var xion_collected_text;
var xion_collected_text_base = " XION COLLECTED";
var xion_multiplier_changed_text;

var xion_x_min = 50;
var xion_x_max = 750;

var xion_y_min = 150;
var xion_y_max = 1080 - xion_y_min*1.5;

function preload(){
    myScene = this;
    myPointer = this.input.activePointer;

    this.load.image('game_background', game_objects_path.game_background);

    this.load.image('box_border', game_objects_path.box_border);

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

    xion_image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'xion').setScale(3).setDepth(2).setInteractive();
    let xion_event = xion_image.on('pointerdown', _on_xion_clicked);
    xion_image.setPosition(Phaser.Math.FloatBetween(xion_x_min, xion_x_max), Phaser.Math.FloatBetween(xion_y_min, xion_y_max) );

    let box_border_img = this.add.image(xion_x_min, xion_y_min, 'box_border').setOrigin(0,0);
    box_border_img.setDisplaySize(xion_x_max - xion_x_min, xion_y_max - xion_y_min);
    box_border_img.setDepth(1);

    xion_collected_text = this.add.text(80, 40, game_progression.xion + xion_collected_text_base, { fontSize: '64px', fill: '#FFF'});

    xion_multiplier_changed_text = this.add.text(110, 100, "MULTIPLIER HAS BEEN INCREASED TO " + game_progression.multiplier, {fontSize: "24px", fill:"#FFF"});
    display_text(xion_multiplier_changed_text, false);

    update_xion_collected_text();

    if(game_progression.autoclick_enabled == true){
        autoclick();
    }
}

function update(){
    console.log(game_progression);
}

function update_xion_collected_text(){
    xion_collected_text.setText(game_progression.xion + xion_collected_text_base);
}

function _on_xion_clicked(){
    game_progression.xion += Math.round(xion_object.value * game_progression.multiplier, 0);
    update_xion_collected_text();
    _on_xion_changed(game_progression.xion);
    replace_xion();
}

function _on_xion_changed(value){
    let has_multiplier_changed = false;

    console.log(value);
    console.log(game_progression.upgrade_one_bought);
    console.log(game_progression);

    if (value >= 100 && game_progression.upgrade_one_bought == false){

        game_progression.upgrade_one_bought = true;
        game_progression.multiplier = 2.0;

        xion_multiplier_changed_text.text = "XION MULTIPLIER HAS BEEN INCREASED TO 2";
        display_text(xion_multiplier_changed_text, true);

    }else{
        if(value >= 500 && game_progression.upgrade_two_bought == false){

            game_progression.upgrade_two_bought = true;
            game_progression.multiplier = 3.0;

            xion_multiplier_changed_text.text = "XION MULTIPLIER HAS BEEN INCREASED TO 3";
            display_text(xion_multiplier_changed_text, true);

        }else{
            if(value >= 750 && game_progression.autoclick_enabled == false){

                game_progression.autoclick_enabled = true;
                autoclick();

            }else{
                if(value >= 7000 && game_progression.upgrade_three_bought == false){

                    game_progression.upgrade_three_bought = true;
                    game_progression.multiplier = 4.0;

                    xion_multiplier_changed_text.text = "XION MULTIPLIER HAS BEEN INCREASED TO 4";
                    display_text(xion_multiplier_changed_text, true);

                }else{
                    if(value === 1000000 && game_progression.upgrade_four_bought == false){

                        game_progression.upgrade_four_bought = true;
                        game_progression.multiplier = 5.0;

                        xion_multiplier_changed_text.text = "XION MULTIPLIER HAS BEEN INCREASED TO 5";
                        display_text(xion_multiplier_changed_text, true, true);
                    }
                }
            }
        }
    }
}

function display_text(text, value, auto_hide = false, destroy = false){
    text.visible = value;

    if(value == true && auto_hide == true){
        var t = myScene.time.delayedCall(3000, display_text, [text, false]);
    }

    if(destroy == true){
        text.destroy();
    }
}

function replace_xion(){
    xion_image.setPosition(Phaser.Math.FloatBetween(xion_x_min, xion_x_max), Phaser.Math.FloatBetween(xion_y_min, xion_y_max) );
}

function autoclick(){
    if (game_progression.autoclick_enabled == true){
        _on_xion_clicked();
    }

    myScene.time.delayedCall(game_progression.autoclick_frequency, autoclick);
}