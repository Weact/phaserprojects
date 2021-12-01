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
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 2000 },
            debug: false
        }
    }
};


// GAME
var game = new Phaser.Game(config);

var myScene;
var myPointer;
var cursors;

var gameTime = 0.0;
var gameTimeCurrent = 0.0;
var deltaTime = 0.0;

var mousePositionText;

// GAME PROGRESSION
var myGameProgression = new GameProgression();

// BACKGROUND
var bg_image;

// ITEMS
var xion_object = new xion();
var xion_autoclicker = new autoclicker();
var xion_generator = new xiongenerator();
var xion_extractor = new xionextractor();

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
var xps_text_base = "/s";

///// Platformer

// Platform
var platforms;

// Player
var player;
var player_speed = 400;
var player_jump_force = 600;
var player_dir = 0;
var player_has_jumped = false;
var player_max_jump = 2;
var player_spawn_position = {player_x: 1280, player_y: 800};

// BLOCKS
var iceblocks;
var iceblock_delay = 3000;
var iceblock_lifetime = 2000;

/// COLLECTABLES

// Gears
var gearText;
var goldenGearText;

var gears;
var golden_gears;
var spawn_range = {x1: 920, x2: 1640, y1: 150, y2: 250};
var spawn_delay = 5000;
var golden_gear_spawn_delay = 60000;
var gear_lifetime = 6000;
var golden_gear_lifetime = 2000;

/// BUTTONS
var buyclicker_button;
var buygenerator_button;
var buyextractor_button;

var buy_buttons = [];

var buttons = {
    buyclicker: {x: 1500, y: 10, TextInfo: { x: 1515, y: 20, ftSize: '20px' } },
    buygenerator: {x: 1500, y: 75, TextInfo: { x: 1515, y: 85, ftSize: '20px' } },
    buyextractor: {x: 1500, y: 140, TextInfo: { x: 1515, y: 150, ftSize: '20px' } }
};

var buyclicker_text;
var buygenerator_text;
var buyextractor_text;

var btn_autobuy_clicker;
var btn_autobuy_generator;
var btn_autobuy_extractor;

var btn_trade_gear_goldengear;

var btn_upgrade_items;
var btn_upgrade_autoclicker;
var btn_upgrade_xiongenerator;
var btn_upgrade_xionextractor;

var items_upgrades_text = {
    upgrade_clicker_text: { cost: { x: 1250, y: 25, text: 'cost:' }, owned: { x: 1250, y: 39, text: 'owned:' } },
    upgrade_generator_text: { cost: { x: 1250, y: 85, text: 'cost:' }, owned: {x: 1250, y: 99, text: 'owned:' } },
    upgrade_extractor_text: { cost: { x: 1250, y: 155, text: 'cost:' }, owned: {x: 1250, y: 169, text: 'owned:' } }
}

var buy_buttons_group = {
    gbtn_autoclicker: [],
    gbtn_generator: [],
    gbtn_extractor: []
}

// METHODS

function preload(){
    myScene = this;
    myPointer = myScene.input.activePointer;

    myScene.load.image('game_background', game_objects_path.game_background);

    myScene.load.image('box_border', game_objects_path.box_border);

    myScene.load.spritesheet('gear', game_objects_path.gear.path, game_objects_path.gear.dim );
    myScene.load.spritesheet('golden_gear', game_objects_path.golden_gear.path, game_objects_path.golden_gear.dim );
    myScene.load.image('xion', game_objects_path.xion);

    myScene.load.image('btn_buyclicker', game_objects_path.btn_buyclicker);
    myScene.load.image('btn_buygenerator', game_objects_path.btn_buygenerator);
    myScene.load.image('btn_buyextractor', game_objects_path.btn_buyextractor);
    myScene.load.image('btn_autobuy', game_objects_path.btn_autobuy);
    myScene.load.image('btn_trade_gear_goldengear', game_objects_path.btn_trade_gear_goldengear);
    myScene.load.image('btn_upgrade_items', game_objects_path.btn_upgrade_items);

    myScene.load.image('platform', game_objects_path.xl_platform);
    myScene.load.image('iceblock', game_objects_path.ice_block);

    myScene.load.spritesheet('MrStonks', game_objects_path.mrstonks.path, game_objects_path.mrstonks.dim);
}

function create(){
    gameTime = Date.now();
    cursors = myScene.input.keyboard.createCursorKeys();

    platforms = myScene.physics.add.staticGroup();
    gears = myScene.physics.add.group();
    golden_gears = myScene.physics.add.group();
    iceblocks = myScene.physics.add.group();

    myGameProgression.set_items([xion_object, xion_autoclicker, xion_generator, xion_extractor]);

    create_game_background();
    create_xion_clicker();
    create_currencies();
    create_clicker_border();

    create_autoclicker_buttons();
    create_generator_buttons();
    create_extractor_buttons();
    create_trade_buttons();

    instanciate_platforms();
    instanciate_player();

    myScene.time.delayedCall(spawn_delay, instanciate_gears);
    myScene.time.delayedCall(golden_gear_spawn_delay, instanciate_golden_gears);
    myScene.time.delayedCall(iceblock_delay, instanciate_iceblock);

    myScene.physics.add.collider(player, platforms);
    myScene.physics.add.collider(gears, platforms);
    myScene.physics.add.collider(golden_gears, platforms);
    myScene.physics.add.overlap(player, gears, _on_gears_hit, null, myScene);
    myScene.physics.add.overlap(player, golden_gears, _on_golden_gears_hit, null, myScene);
    myScene.physics.add.collider(platforms, iceblocks);
    myScene.physics.add.overlap(player, iceblocks, _on_player_hit_iceblock, null, myScene);

    mousePositionText = myScene.add.text(10, 920, '');
    myScene.input.mouse.disableContextMenu();

    display_buildings_cost_and_own();
    refresh_ui();
    display_xps();
    display_buildings_upgrades_cost_and_own();

    buy_buttons_group.gbtn_autoclicker = [buyclicker_button, buttons.buyclicker, buyclicker_text, btn_autobuy_clicker, btn_upgrade_autoclicker];
    buy_buttons_group.gbtn_generator = [buygenerator_button, buttons.buygenerator, buygenerator_text, btn_autobuy_generator, btn_upgrade_xiongenerator];
    buy_buttons_group.gbtn_extractor = [buyextractor_button, buttons.buyextractor, buyextractor_text, btn_autobuy_extractor, btn_upgrade_xionextractor];

    // autoclicker: [buttons.buyclicker, buyclicker_text, btn_autobuy_clicker, btn_upgrade_autoclicker],
    // generator: [buttons.buygenerator, buygenerator_text, btn_autobuy_generator, btn_upgrade_xiongenerator],
    // extractor: [buttons.buyextractor, buyextractor_text, btn_autobuy_extractor, btn_upgrade_xionextractor]

    display_buttons(true);
}

function display_buttons(value) {
    display_button_group('gbtn_extractor', false);
    // Object.values(buy_buttons_group).forEach(button => {
    //     // console.log("btn : " + Object.keys(buy_buttons_group));
    //     // console.log(Object.keys(buy_buttons_group)[0] == 'gbtn_autoclicker');
    //     // console.log( Object.keys(buy_buttons_group)[0]);

    //     Object.keys(button).forEach(element => {
    //         button[element].visible = value;
    //     });
    // });

    // items_upgrades_text.upgrade_clicker_text.cost.visible = value;
    // items_upgrades_text.upgrade_clicker_text.owned.visible = value;

    // items_upgrades_text.upgrade_generator_text.cost.visible = value;
    // items_upgrades_text.upgrade_generator_text.owned.visible = value;

    // items_upgrades_text.upgrade_extractor_text.cost.visible = value;
    // items_upgrades_text.upgrade_extractor_text.owned.visible = value;
}

function display_button_group(button_group = '', value = false){
    console.log(Object.keys(buy_buttons_group));

    Object.values(buy_buttons_group).forEach(button => {
        //console.log("btn : " + Object.keys(buy_buttons_group));
        //console.log(Object.keys(buy_buttons_group)[0] == 'gbtn_autoclicker');
        //console.log( Object.keys(buy_buttons_group)[0]);

        for (let index = 0; index < Object.keys(buy_buttons_group).length; index++) {
            const e = Object.keys(buy_buttons_group)[index];
            if(e == button_group){
                Object.keys(button).forEach(element => {
                    button[element].visible = value;
                });
            }
        }
    });
}

function update(time, delta){
    gameTimeCurrent = Date.now();
    if(gameTimeCurrent - gameTime > 0){
        deltaTime = (gameTimeCurrent - gameTime) / 1000
        myGameProgression.add_xion(get_total_earnings() * deltaTime); //v2
    }
    gameTime = gameTimeCurrent;

    player_movements();
    update_pointer();
}

function create_trade_buttons() {
    btn_trade_gear_goldengear = myScene.add.image(350, 75, 'btn_trade_gear_goldengear').setOrigin(0, 0).setScale(1.5, 1.5).setDepth(1000).setInteractive();
    btn_trade_gear_goldengear.setTint(0x00CCFF);
    btn_trade_gear_goldengear.on('pointerdown', (myPointer, objectsClicked) => {
        trade_gear_to_goldengear();
    });

    buyclicker_text = myScene.add.text(buttons.buyclicker.TextInfo.x, buttons.buyclicker.TextInfo.y, '0', { fontSize: buttons.buyclicker.TextInfo.ftSize }).setDepth(1001);
    buygenerator_text = myScene.add.text(buttons.buygenerator.TextInfo.x, buttons.buygenerator.TextInfo.y, '0', { fontSize: buttons.buygenerator.TextInfo.ftSize }).setDepth(1001);
    buyextractor_text = myScene.add.text(buttons.buyextractor.TextInfo.x, buttons.buyextractor.TextInfo.y, '0', { fontSize: buttons.buyextractor.TextInfo.ftSize }).setDepth(1001);
}

function create_autoclicker_buttons() {
    buyclicker_button = myScene.add.image(buttons.buyclicker.x, buttons.buyclicker.y, 'btn_buyclicker').setOrigin(0, 0).setDepth(1000).setInteractive();
    buyclicker_button.setTint(0xAAAAAA);
    buyclicker_button.on('pointerdown', (myPointer, objectsClicked) => {
        myGameProgression.buy_item(xion_autoclicker);
    }
    );

    btn_autobuy_clicker = myScene.add.image(buttons.buyclicker.x - 90, buttons.buyclicker.y + 15, 'btn_autobuy').setOrigin(0, 0).setScale(0.4, 0.4).setDepth(1000).setInteractive();
    btn_autobuy_clicker.setTint(0x00CCFF);
    btn_autobuy_clicker.on('pointerdown', (myPointer, objectsClicked) => {
        activate_autobuy(btn_autobuy_clicker, xion_autoclicker);
    });

    btn_upgrade_autoclicker = myScene.add.image(buttons.buyclicker.x - 160, buttons.buyclicker.y + 4, 'btn_upgrade_items').setOrigin(0, 0).setScale(0.7, 0.7).setDepth(1000).setInteractive();
    btn_upgrade_autoclicker.setTint(0xFF0000);
    btn_upgrade_autoclicker.on('pointerdown', (myPointer, objectsClicked) => {
        upgrade_item_level(xion_autoclicker);
    });

    items_upgrades_text.upgrade_clicker_text.cost = myScene.add.text(items_upgrades_text.upgrade_clicker_text.cost.x, items_upgrades_text.upgrade_clicker_text.cost.y, items_upgrades_text.upgrade_clicker_text.cost.text);
    items_upgrades_text.upgrade_clicker_text.owned = myScene.add.text(items_upgrades_text.upgrade_clicker_text.owned.x, items_upgrades_text.upgrade_clicker_text.owned.y, items_upgrades_text.upgrade_clicker_text.owned.text);
}

function create_generator_buttons() {
    buygenerator_button = myScene.add.image(buttons.buygenerator.x, buttons.buygenerator.y, 'btn_buygenerator').setOrigin(0, 0).setDepth(1000).setInteractive();
    buygenerator_button.setTint(0xAAAAAA);
    buygenerator_button.on('pointerdown', (myPointer, objectsClicked) => {
        myGameProgression.buy_item(xion_generator);
    });

    btn_autobuy_generator = myScene.add.image(buttons.buygenerator.x - 90, buttons.buygenerator.y + 15, 'btn_autobuy').setOrigin(0, 0).setScale(0.4, 0.4).setDepth(1000).setInteractive();
    btn_autobuy_generator.setTint(0x00CCFF);
    btn_autobuy_generator.on('pointerdown', (myPointer, objectsClicked) => {
        activate_autobuy(btn_autobuy_generator, xion_generator);
    });

    btn_upgrade_xiongenerator = myScene.add.image(buttons.buygenerator.x - 160, buttons.buygenerator.y + 4, 'btn_upgrade_items').setOrigin(0, 0).setScale(0.7, 0.7).setDepth(1000).setInteractive();
    btn_upgrade_xiongenerator.setTint(0xFF0000);
    btn_upgrade_xiongenerator.on('pointerdown', (myPointer, objectsClicked) => {
        upgrade_item_level(xion_generator);
    });

    items_upgrades_text.upgrade_generator_text.cost = myScene.add.text(items_upgrades_text.upgrade_generator_text.cost.x, items_upgrades_text.upgrade_generator_text.cost.y, items_upgrades_text.upgrade_generator_text.cost.text);
    items_upgrades_text.upgrade_generator_text.owned = myScene.add.text(items_upgrades_text.upgrade_generator_text.owned.x, items_upgrades_text.upgrade_generator_text.owned.y, items_upgrades_text.upgrade_generator_text.owned.text);
}

function create_extractor_buttons() {
    btn_autobuy_extractor = myScene.add.image(buttons.buyextractor.x - 90, buttons.buyextractor.y + 15, 'btn_autobuy').setOrigin(0, 0).setScale(0.4, 0.4).setDepth(1000).setInteractive();
    btn_autobuy_extractor.setTint(0x00CCFF);
    btn_autobuy_extractor.on('pointerdown', (myPointer, objectsClicked) => {
        activate_autobuy(btn_autobuy_extractor, xion_extractor);
    });

    buyextractor_button = myScene.add.image(buttons.buyextractor.x, buttons.buyextractor.y, 'btn_buyextractor').setOrigin(0, 0).setDepth(1000).setInteractive();
    buyextractor_button.setTint(0xAAAAAA);
    buyextractor_button.on('pointerdown', (myPointer, objectsClicked) => {
        myGameProgression.buy_item(xion_extractor);
    });

    btn_upgrade_xionextractor = myScene.add.image(buttons.buyextractor.x - 160, buttons.buyextractor.y + 4, 'btn_upgrade_items').setOrigin(0, 0).setScale(0.7, 0.7).setDepth(1000).setInteractive();
    btn_upgrade_xionextractor.setTint(0xFF0000);
    btn_upgrade_xionextractor.on('pointerdown', (myPointer, objectsClicked) => {
        upgrade_item_level(xion_extractor);
    });

    items_upgrades_text.upgrade_extractor_text.cost = myScene.add.text(items_upgrades_text.upgrade_extractor_text.cost.x, items_upgrades_text.upgrade_extractor_text.cost.y, items_upgrades_text.upgrade_extractor_text.cost.text);
    items_upgrades_text.upgrade_extractor_text.owned = myScene.add.text(items_upgrades_text.upgrade_extractor_text.owned.x, items_upgrades_text.upgrade_extractor_text.owned.y, items_upgrades_text.upgrade_extractor_text.owned.text);
}

function upgrade_item_level(item){
    if(item.get_multiplier() < 51){
        if(item.get_multiplier() == 50){
            myGameProgression.upgrade_item(item, true);
        }else{
            myGameProgression.upgrade_item(item);
        }
    }
}

function create_clicker_border() {
    let box_border_img = myScene.add.image(xion_x_min, xion_y_min, 'box_border').setOrigin(0, 0);
    box_border_img.setDisplaySize(xion_x_max - xion_x_min, xion_y_max - xion_y_min);
    box_border_img.setDepth(1);
}

function create_currencies() {
    myScene.add.image(35, 25, 'xion').setDepth(1000).setScale(1.2, 1.2);
    xion_collected_text = myScene.add.text(65, 0, myGameProgression.get_xion(), { fontSize: '50px', fill: '#FFF' });
    xps_text = myScene.add.text(80, 40, xps + xps_text_base, { fontSize: "20px", fill: "#FFF" });

    myScene.add.image(350, 25, 'gear').setDepth(1000).setScale(1.4, 1.4);
    gearText = myScene.add.text(385, 0, myGameProgression.get_gear(), { fontSize: '50px', fill: '#FFF' });

    myScene.add.image(500, 25, 'golden_gear').setDepth(1000).setScale(1.4, 1.4);
    goldenGearText = myScene.add.text(535, 0, myGameProgression.get_golden_gear(), { fontSize: '50px', fill: '#FFF' });
}

function create_xion_clicker(){
    xion_image = myScene.add.image(myScene.cameras.main.width / 2, myScene.cameras.main.height / 2, 'xion').setScale(3).setDepth(2).setInteractive();
    xion_image.on('pointerdown', _on_xion_clicked);
    xion_image.setPosition(Phaser.Math.FloatBetween(xion_x_min, xion_x_max), Phaser.Math.FloatBetween(xion_y_min, xion_y_max));
}

function create_game_background() {
    bg_image = myScene.add.image(0, 0, 'game_background').setOrigin(0, 0);
    let bg_scaleX = myScene.cameras.main.width / bg_image.width;
    let bg_scaleY = myScene.cameras.main.height / bg_image.height;
    let bg_scale = Math.max(bg_scaleX, bg_scaleY);
    bg_image.setScale(bg_scale).setScrollFactor(0);
}

function update_pointer(){ // TO BE REMOVED
    mousePositionText.setText( ['x: ' + myPointer.worldX,'y: ' + myPointer.worldY ] );
}

function _on_xion_clicked(_pointer = undefined, _pointer_x = undefined, _pointer_y = undefined, _propagation = undefined, by_autoclicker = false){
    give_xion(xion_object);

    if(by_autoclicker == false){
        replace_xion();
    }
}

function give_xion( item ){
    myGameProgression.add_xion(item.xion_amount * item.multiplier * item.player_owned);
}

function _on_xion_changed(){
    let buyable_items = myGameProgression.check_for_items();
    refresh_buy_buttons();
}
function _on_gear_changed(){
    if(myGameProgression.get_gear() >= 10){
        btn_trade_gear_goldengear.setTint(0xFFFFFF);
    }else{
        btn_trade_gear_goldengear.setTint(0x00CCFF);
    }

    update_clicker_upgrade_button();
    update_generator_upgrade_button();
    update_extractor_upgrade_button();
}
function _on_golden_gear_changed(){
    update_clicker_upgrade_button();
    update_generator_upgrade_button();
    update_extractor_upgrade_button();
}
function update_extractor_upgrade_button() {
    if (myGameProgression.get_gear() >= xion_extractor.get_upgrade_cost() && xion_extractor.get_multiplier() <= 49) {
        btn_upgrade_xionextractor.setTint(0xFFFFFF);
    } else {
        if (xion_extractor.get_multiplier() < 50) {
            btn_upgrade_xionextractor.setTint(0xFF0000);
        } else {
            if (myGameProgression.get_golden_gear() >= xion_extractor.get_ultimate_upgrade_cost() && xion_extractor.get_multiplier() == 50) {
                btn_upgrade_xionextractor.setTint(0xFFFF00);
            }
            if (myGameProgression.get_golden_gear() < xion_extractor.get_ultimate_upgrade_cost()) {
                btn_upgrade_xionextractor.setTint(0xFFCC00);
            }
        }
    }
}

function update_generator_upgrade_button() {
    if (myGameProgression.get_gear() >= xion_generator.get_upgrade_cost() && xion_generator.get_multiplier() <= 49) {
        btn_upgrade_xiongenerator.setTint(0xFFFFFF);
    } else {
        if (xion_generator.get_multiplier() < 50) {
            btn_upgrade_xiongenerator.setTint(0xFF0000);
        } else {
            if (myGameProgression.get_golden_gear() >= xion_generator.get_ultimate_upgrade_cost() && xion_generator.get_multiplier() == 50) {
                btn_upgrade_xiongenerator.setTint(0xFFFF00);
            }
            if (myGameProgression.get_golden_gear() < xion_generator.get_ultimate_upgrade_cost()) {
                btn_upgrade_xiongenerator.setTint(0xFFCC00);
            }
        }
    }
}

function update_clicker_upgrade_button() {
    if (myGameProgression.get_gear() >= xion_autoclicker.get_upgrade_cost() && xion_autoclicker.get_multiplier() <= 49) {
        console.log(xion_autoclicker.get_multiplier());
        btn_upgrade_autoclicker.setTint(0xFFFFFF);
    } else {
        if (xion_autoclicker.get_multiplier() < 50) {
            btn_upgrade_autoclicker.setTint(0xFF0000);
        } else {
            if (myGameProgression.get_golden_gear() >= xion_autoclicker.get_ultimate_upgrade_cost() && xion_autoclicker.get_multiplier() == 50) {
                btn_upgrade_autoclicker.setTint(0xFFFF00);
            }
            if (myGameProgression.get_golden_gear() < xion_autoclicker.get_ultimate_upgrade_cost()) {
                btn_upgrade_autoclicker.setTint(0xFFCC00);
            }
        }
    }
}

function trade_gear_to_goldengear(){
    if (myGameProgression.get_gear() >= 10) {
        myGameProgression.remove_gear(10);
        myGameProgression.add_golden_gear(1);
    }
}

function display_text(text, value, auto_hide = false, destroy = false){ // CURRENTLY NEVER USED ; KEEP IT FOR THE FUTURE IF AIMING TO INCLUDE TEMPORARY MESSAGES ON SCREEN
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

function display_xion(){
    xion_collected_text.text = Math.round(myGameProgression.get_xion(), 0);
}
function display_gear(){
    gearText.text = Math.round(myGameProgression.get_gear(), 0);
}
function display_golden_gear(){
    goldenGearText.text = Math.round(myGameProgression.get_golden_gear(), 0);
}
function display_currencies(){
    display_xion();
    display_gear();
    display_golden_gear();
}

function refresh_buy_buttons(){
    buy_buttons = [buyclicker_button, buygenerator_button, buyextractor_button];
    let current_xion = myGameProgression.get_xion();
    var items = myGameProgression.get_items();

    let buyableTint = 0xFFFFFF;
    let unbuyableTint = 0xAAAAAA;

    for (let i = 0; i < items.length; i++) {
        const current_btn = buy_buttons[i-1];
        const current_item = items[i];
        

        if(current_item.get_name() != "xion"){
            if (current_xion >= current_item.get_price()) {
                current_btn.setTint(buyableTint);
            } else {
                current_btn.setTint(unbuyableTint);
            }
        }
    }

    if(myGameProgression.is_item_max_level(xion_autoclicker)){
        btn_upgrade_autoclicker.setTint(0x000000);
    }
    if(myGameProgression.is_item_max_level(xion_generator)){
        btn_upgrade_xiongenerator.setTint(0x000000);
    }
    if(myGameProgression.is_item_max_level(xion_extractor)){
        btn_upgrade_xionextractor.setTint(0x000000);
    }
}

function refresh_ui(){
    display_currencies();
    myScene.time.delayedCall(24, refresh_ui);
}

function display_xps(){

    xps_text.text = xps + xps_text_base;
    myScene.time.delayedCall(1000, display_xps);
}

function display_buildings_cost_and_own(){
    var btn_buyitems_text = [buyclicker_text, buygenerator_text, buyextractor_text];
    var items = myGameProgression.get_items();

    for (let i = 0; i < items.length; i++) {
        const current_btn_text = btn_buyitems_text[i-1];
        const current_item = items[i];
        

        if(current_item.get_name() != "xion"){
            current_btn_text.setText(
                [
                    'cost: ' + Math.round(current_item.get_price(), 0),
                    'owned: ' + Math.round(current_item.get_player_owned(),0)
                ]
            );
        }
    }
}

function display_buildings_upgrades_cost_and_own(){
    items_upgrades_text.upgrade_clicker_text.cost.setText( 'cost:' + xion_autoclicker.get_upgrade_cost() + 'g');
    items_upgrades_text.upgrade_clicker_text.owned.setText( 'owned:' + xion_autoclicker.get_multiplier());

    items_upgrades_text.upgrade_generator_text.cost.setText( 'cost:' + xion_generator.get_upgrade_cost() + 'g' );
    items_upgrades_text.upgrade_generator_text.owned.setText( 'owned:' + + xion_generator.get_multiplier());

    items_upgrades_text.upgrade_extractor_text.cost.setText( 'cost:' + xion_extractor.get_upgrade_cost() + 'g' );
    items_upgrades_text.upgrade_extractor_text.owned.setText( 'owned:' + + xion_extractor.get_multiplier());
}

function activate_autobuy(autobuy_button, autobuy_item){
    autobuy_item.set_autobuy( !autobuy_item.get_autobuy() );

    if(autobuy_item.get_autobuy() == true){
        autobuy_button.setTint(0x00FF00);
    }else{
        autobuy_button.setTint(0x00CCFF);
    }
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

function instanciate_platforms(){
    let w_offset = -200;
    let h_offset = 250;
    platforms.create(1126 + w_offset, 700 + h_offset, 'platform');
    platforms.create(1198 + w_offset, 700 + h_offset, 'platform');
    platforms.create(1270 + w_offset, 700 + h_offset, 'platform');
    platforms.create(1342 + w_offset, 700 + h_offset, 'platform');
    platforms.create(1414 + w_offset, 700 + h_offset, 'platform');
    platforms.create(1486 + w_offset, 700 + h_offset, 'platform');
    platforms.create(1558 + w_offset, 700 + h_offset, 'platform');
    platforms.create(1630 + w_offset, 700 + h_offset, 'platform');
    platforms.create(1702 + w_offset, 700 + h_offset, 'platform');
    platforms.create(1774 + w_offset, 700 + h_offset, 'platform');
    platforms.create(1846 + w_offset, 700 + h_offset, 'platform');

    platforms.create(1080 + w_offset, 677 + h_offset, 'platform').setSize(1, 1000).setAngle(90);
    platforms.create(1080 + w_offset, 605 + h_offset, 'platform').setSize(1, 1).setAngle(90);
    platforms.create(1080 + w_offset, 533 + h_offset, 'platform').setSize(1, 1).setAngle(90);
    platforms.create(1080 + w_offset, 461 + h_offset, 'platform').setSize(1, 1).setAngle(90);
    platforms.create(1080 + w_offset, 389 + h_offset, 'platform').setSize(1, 1).setAngle(90);
    platforms.create(1080 + w_offset, 317 + h_offset, 'platform').setSize(1, 1).setAngle(90);
    platforms.create(1080 + w_offset, 245 + h_offset, 'platform').setSize(1, 1).setAngle(90);
    platforms.create(1080 + w_offset, 173 + h_offset, 'platform').setSize(1, 1).setAngle(90);
    platforms.create(1080 + w_offset, 101 + h_offset, 'platform').setSize(1, 1).setAngle(90);
    platforms.create(1080 + w_offset, 29 + h_offset, 'platform').setSize(1, 1).setAngle(90);

    platforms.create(1893 + w_offset, 677 + h_offset, 'platform').setSize(1, 1000).setAngle(90);
    platforms.create(1893 + w_offset, 605 + h_offset, 'platform').setSize(1, 1).setAngle(90);
    platforms.create(1893 + w_offset, 533 + h_offset, 'platform').setSize(1, 1).setAngle(90);
    platforms.create(1893 + w_offset, 461 + h_offset, 'platform').setSize(1, 1).setAngle(90);
    platforms.create(1893 + w_offset, 389 + h_offset, 'platform').setSize(1, 1).setAngle(90);
    platforms.create(1893 + w_offset, 317 + h_offset, 'platform').setSize(1, 1).setAngle(90);
    platforms.create(1893 + w_offset, 245 + h_offset, 'platform').setSize(1, 1).setAngle(90);
    platforms.create(1893 + w_offset, 173 + h_offset, 'platform').setSize(1, 1).setAngle(90);
    platforms.create(1893 + w_offset, 101 + h_offset, 'platform').setSize(1, 1).setAngle(90);
    platforms.create(1893 + w_offset, 29 + h_offset, 'platform').setSize(1, 1).setAngle(90);
}

function instanciate_player(gamePhysics){
    player = myScene.physics.add.sprite(player_spawn_position.player_x, player_spawn_position.player_y, 'MrStonks').setScale(1.5, 1.5);
    player.setCollideWorldBounds(true);

    myScene.anims.create({
        key: 'left',
        frames: myScene.anims.generateFrameNumbers('MrStonks', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    myScene.anims.create({
        key: 'turnleft',
        frames: [ { key: 'MrStonks', frame: 3 } ],
        frameRate: 20
    })

    myScene.anims.create({
        key: 'turnright',
        frames: [ { key: 'MrStonks', frame: 4 } ],
        frameRate: 20
    });

    myScene.anims.create({
        key: 'right',
        frames: myScene.anims.generateFrameNumbers('MrStonks', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });
}

function player_movements(){
    if (player.body.touching.down){
        player_max_jump = 2;
        player_has_jumped = false
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-player_speed);

        player.anims.play('left', true);

        player_dir = 1;
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(player_speed);

        player.anims.play('right', true);

        player_dir = 0;
    }
    else
    {
        player.setVelocityX(0);
        
        if(player_dir == 0){
            player.anims.play('turnright');
        }else{
            player.anims.play('turnleft');
        }
        
    }

    if (!player_has_jumped && (cursors.up.isDown && (player.body.touching.down || player_max_jump > 0) ) )
    {
        player_has_jumped = true;
        player_max_jump--;
        player.setVelocityY(-player_jump_force);
    }
    if(cursors.up.isUp){
        player_has_jumped = false;
    }
}

function instanciate_iceblock(){
    var x = Phaser.Math.Between(spawn_range.x1, spawn_range.x2);
    var y = Phaser.Math.Between(spawn_range.y1, spawn_range.y2);

    var new_iceblock = iceblocks.create(x, y, 'iceblock').setScale(1.5, 1.5);
    new_iceblock.setCollideWorldBounds(true);
    new_iceblock.setVelocity(0, 30);

    myScene.time.delayedCall(iceblock_delay, instanciate_iceblock);
    myScene.time.delayedCall(iceblock_lifetime, destroy_iceblock, [new_iceblock]);
}

function destroy_iceblock(iceblock){
    iceblock.destroy();
}

function _on_player_hit_iceblock(player, iceblock){
    iceblock.destroy();

    myGameProgression.remove_gear( myGameProgression.get_gear() * myGameProgression.get_gear_lost_rate() ); // removes 15% of current gear
    myGameProgression.remove_golden_gear( myGameProgression.get_golden_gear() * myGameProgression.get_golden_gear_lost_rate() ); // removes 5% of current golden gear
    myGameProgression.remove_xion( myGameProgression.get_xion() * myGameProgression.get_xion_lost_rate() ); // removes 30% of current xion

    player.setTint(0xFF0000);
    myScene.time.delayedCall(500, recolor_player);
}

function recolor_player(){
    player.setTint(0xFFFFFF);
}

function instanciate_gears(){
    var x = Phaser.Math.Between(spawn_range.x1, spawn_range.x2);
    var y = Phaser.Math.Between(spawn_range.y1, spawn_range.y2);

    var new_gear = gears.create(x, y, 'gear').setScale(1.5, 1.5);
    new_gear.setBounce(0.85);
    new_gear.setCollideWorldBounds(true);
    new_gear.setVelocity(0, 50);

    myScene.anims.create({
        key: 'gearsRotation',
        frames: myScene.anims.generateFrameNumbers('gear', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: 9999
    });

    new_gear.anims.play('gearsRotation');

    myScene.time.delayedCall(gear_lifetime, destroy_new_gear_if_lifetime, [new_gear])
    myScene.time.delayedCall(spawn_delay, instanciate_gears)
}

function instanciate_golden_gears(){
    var x = Phaser.Math.Between(spawn_range.x1, spawn_range.x2);
    var y = Phaser.Math.Between(spawn_range.y1, spawn_range.y2);

    var new_golden_gear = golden_gears.create(x, y, 'golden_gear').setScale(1.5, 1.5);
    new_golden_gear.setBounce(0.85);
    new_golden_gear.setCollideWorldBounds(true);
    new_golden_gear.setVelocity(0, 50);

    myScene.anims.create({
        key: 'goldenGearRotation',
        frames: myScene.anims.generateFrameNumbers('golden_gear', { start : 0, end : 6 }),
        frameRate: 10,
        repeat: 9999
    });

    new_golden_gear.anims.play('goldenGearRotation');

    myScene.time.delayedCall(golden_gear_lifetime, destroy_new_gear_if_lifetime, [new_golden_gear])
    myScene.time.delayedCall(golden_gear_spawn_delay, instanciate_golden_gears)
}

function destroy_new_gear_if_lifetime(gear){
    gear.destroy();
}

function _on_gears_hit(player, gear_hit){
    myGameProgression.add_gear(1);
    gear_hit.destroy();
}

function _on_golden_gears_hit(player, golden_gear_hit){
    myGameProgression.add_golden_gear(1);
    golden_gear_hit.destroy();
}