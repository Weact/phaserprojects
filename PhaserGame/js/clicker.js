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


// GAME
var game = new Phaser.Game(config);

var myScene;
var myPointer;

var gameTime = 0.0;
var gameTimeCurrent = 0.0;
var deltaTime = 0.0;

// GAME PROGRESSION
var myGameProgression = new GameProgression();

// ITEMS
var xion_object = new xion();
var xion_autoclicker = new autoclicker();
var xion_generator = new xiongenerator();

// XION
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

// XION PER SECOND TEXT

var xps_text;
var xps_text_base = " XION PER SECOND";

// METHODS

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
    gameTime = Date.now();

    //game_progression.items = [xion_object, xion_autoclicker, xion_generator]; //v1
    myGameProgression.set_items([xion_object, xion_autoclicker, xion_generator]); //v2

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

    //xion_collected_text = this.add.text(40, 0, game_progression.xion + xion_collected_text_base, { fontSize: '64px', fill: '#FFF'}); //v1
    xion_collected_text = this.add.text(40, 0, myGameProgression.get_xion() + xion_collected_text_base, { fontSize: '64px', fill: '#FFF'}); //v2

    //xion_multiplier_changed_text = this.add.text(50, 120, "MULTIPLIER HAS BEEN INCREASED TO " + game_progression.multiplier, {fontSize: "24px", fill:"#FFF"}); v1
    //display_text(xion_multiplier_changed_text, false);v1

    xps_text = this.add.text(50, 60, xps + xps_text_base, {fontSize: "24px", fill:"#FFF"} ) ;

    display_xion();
    display_xps();

    // v1
    // if(game_progression.items[1].player_owned > 0){
    //     autoclick();
    // }

    // v2 : irrelevant ?
    // if(myGameProgression.items[1].player_owned > 0){
    //     autoclick();
    // }
}

function update(){
    // const element = Object.values(game_progression)[Object.keys(game_progression).length - 1][0].player_owned;
    // console.log(element);

    gameTimeCurrent = Date.now();
    if(gameTimeCurrent - gameTime > 0){
        deltaTime = (gameTimeCurrent - gameTime) / 1000
        //game_progression.xion += get_total_earnings() * deltaTime; //320 = total building quantity value //v1
        myGameProgression.add_xion(get_total_earnings() * deltaTime); //v2
    }
    gameTime = gameTimeCurrent;
}

function _on_xion_clicked(_pointer = undefined, _pointer_x = undefined, _pointer_y = undefined, _propagation = undefined, by_autoclicker = false){
    give_xion(xion_object);
    
    if(by_autoclicker == false){
        replace_xion();
    }
}

function give_xion( item ){
    //game_progression.xion += item.xion_amount * item.multiplier * item.player_owned; //v1
    myGameProgression.add_xion(item.xion_amount * item.multiplier * item.player_owned); //v2
}

function _on_xion_changed(){
    //let value = game_progression.xion; //v1

    display_xion();
    myGameProgression.check_for_items();
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

//function autoclick(){
    // (game_progression.autoclick_enabled == true){
    //    _on_xion_clicked(undefined, undefined, undefined, undefined, true);
    //}

   // myScene.time.delayedCall(game_progression.autoclick_frequency, autoclick, [undefined, undefined, undefined, undefined, true]);
//}

function display_xion(){
    xion_collected_text.text = Math.round(myGameProgression.get_xion(), 0) + xion_collected_text_base;
}

function display_xps(){
    xps_text.text = xps + xps_text_base;
    console.log("XION PER SECONDS FROM BUILDING : " + xps);
    myScene.time.delayedCall(1000, display_xps);
}

function get_total_earnings(){
    let total_earnings = 0;
    let target_item;

    for (let item = 0; item < myGameProgression.get_items().length; item++) {
        target_item = myGameProgression.get_items()[item];

        if(target_item.name != "xion"){
            const item_earning = target_item.xion_amount * target_item.multiplier * target_item.player_owned;
            total_earnings += item_earning;
        }
    }

    xps = total_earnings;
    return xps;
}