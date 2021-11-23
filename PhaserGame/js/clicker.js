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
    },
    fps: {
        target: 360,
        forceSetTimeOut: true
    }
};

var game = new Phaser.Game(config);

var myScene;
var myPointer;

var gameTick = 0;
var gameTickText = "";

var timestamp = Math.round( + new Date() / 1000);

// XION
var xion_object = new xion(1); //obj

var xion_image; //image

// XION TEXT
var xion_collected_text;
var xion_collected_text_base = " XION COLLECTED";
var xion_multiplier_changed_text;

// XION TEXT POSITION
var xion_x_min = 50;
var xion_x_max = 750;

var xion_y_min = 150;
var xion_y_max = 1080 - xion_y_min*1.5;

// XION PER SECOND

var xps = 0;
var xps_highest = 0;

// XION PER SECOND TEXT

var xps_text;
var xps_text_base = " XION PER SECOND";

// HIGHEST XION PER SECOND TEXT

var xps_highest_text;
var xps_highest_text_base = " HIGHEST XION PER SECOND";

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
    compute_xps();

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

    xion_collected_text = this.add.text(40, 0, game_progression.xion + xion_collected_text_base, { fontSize: '64px', fill: '#FFF'});
    xion_multiplier_changed_text = this.add.text(50, 120, "MULTIPLIER HAS BEEN INCREASED TO " + game_progression.multiplier, {fontSize: "24px", fill:"#FFF"});
    display_text(xion_multiplier_changed_text, false);
    update_xion_collected_text();

    xps_text = this.add.text(50, 60, xps + xps_text_base, {fontSize: "24px", fill:"#FFF"} ) ;
    xps_highest_text = this.add.text(50, 80, xps_highest + xps_highest_text_base, {fontSize: "24px", fill:"#FFF"} ) ;

    gameTickText = this.add.text(0, 0, gameTick, {fontSize: "10px"});

    if(game_progression.autoclick_enabled == true){
        autoclick();
    }
}

function update(){
    gameTick++;
    gameTickText.text = gameTick;
}

function update_xion_collected_text(){
    xion_collected_text.setText(game_progression.xion + xion_collected_text_base);
}

function _on_xion_clicked(_pointer = undefined, _pointer_x = undefined, _pointer_y = undefined, _propagation = undefined, by_autoclicker = false){


    game_progression.xion += Math.round(xion_object.value * game_progression.multiplier, 0);
    update_xion_collected_text();
    _on_xion_changed(game_progression.xion);

    if(by_autoclicker == false){
        replace_xion();
    }
}

function _on_xion_changed(value){
    let has_multiplier_changed = false;

    if(value >= 10 && game_progression.autoclick_enabled == false){

        game_progression.autoclick_enabled = true;
        autoclick();

        xion_multiplier_changed_text.text = "AUTOCLICKER HAS BEEN ACTIVATED";
        display_text(xion_multiplier_changed_text, true, true);

    }else{
        if (value >= 100 && game_progression.upgrade_one_bought == false){

            game_progression.upgrade_one_bought = true;
            game_progression.multiplier = 2.0;
    
            xion_multiplier_changed_text.text = "XION MULTIPLIER HAS BEEN INCREASED TO 2";
            display_text(xion_multiplier_changed_text, true, true);
    
        }else{
            if(value >= 500 && game_progression.upgrade_two_bought == false){
    
                game_progression.upgrade_two_bought = true;
                game_progression.multiplier = 3.0;
    
                xion_multiplier_changed_text.text = "XION MULTIPLIER HAS BEEN INCREASED TO 3";
                display_text(xion_multiplier_changed_text, true, true);
    
            }else{
                if(value >= 7000 && game_progression.upgrade_three_bought == false){
    
                    game_progression.upgrade_three_bought = true;
                    game_progression.multiplier = 4.0;
    
                    xion_multiplier_changed_text.text = "XION MULTIPLIER HAS BEEN INCREASED TO 4";
                    display_text(xion_multiplier_changed_text, true, true);
    
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
        _on_xion_clicked(undefined, undefined, undefined, undefined, true);
    }

    myScene.time.delayedCall(game_progression.autoclick_frequency, autoclick, [undefined, undefined, undefined, undefined, true]);
}

function compute_xps(){
    var current_xion = game_progression.xion;

    myScene.time.delayedCall(1000, get_xps, [current_xion]);
}

function get_xps(old_xion_amount = 0){
    var new_current_xion = game_progression.xion

    xps = new_current_xion - old_xion_amount;
    
    if(xps > xps_highest){
        xps_highest = xps;
    }
        
    xps_text.text = xps + xps_text_base;
    xps_highest_text.text = xps_highest + xps_highest_text_base;

    compute_xps();
}