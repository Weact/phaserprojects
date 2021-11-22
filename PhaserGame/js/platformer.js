var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 2000 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var player_speed = 400;
var player_jump_force = 600;
var player_max_jump = 2;
var player_has_jumped = false;
var player_dir = 0; // 0 = RIGHT 1 = LEFT
var platforms;
var cursors;

var stars;
var stars_n = 11;
var stars_a = stars_n + 1;
var star_score_value = 1;

var bombs;
var bombs_n = 1;

var score_text;
var score = 0;
var score_multiplier = 1;

var gameOver = false;

var scene;
var game = new Phaser.Game(config);

function preload ()
{
    scene = this;
    this.load.image('sky', 'assets/platformer/sky.png');
    this.load.image('ground', 'assets/platformer/platform.png');
    this.load.image('star', 'assets/platformer/star.png');
    this.load.image('bomb', 'assets/platformer/bomb.png');
    this.load.spritesheet('MrStonks', 'assets/platformer/MrStonksSheet.png', {frameWidth: 64, frameHeight: 48} );
}

function create ()
{
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    
    populate_stars();

    bombs = this.physics.add.group();

    score_text = this.add.text(16, 16, 'score: ' + score, { fontSize: '32px', fill: '#000'});

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'MrStonks');
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('MrStonks', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turnleft',
        frames: [ { key: 'MrStonks', frame: 3 } ],
        frameRate: 20
    })

    this.anims.create({
        key: 'turnright',
        frames: [ { key: 'MrStonks', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('MrStonks', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(bombs, platforms);
    this.physics.add.overlap(player, bombs, playerHitBomb, null, this);
    
}

function update ()
{
    player_movements();
}

function player_movements()
{
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

function collectStar(player, star){
    if (!gameOver){
        star.disableBody(true, true);
        score = score + (star_score_value * score_multiplier);
        update_score_text();
        score_multiplier = score_multiplier + 0.1;

        if (stars.countActive(true) === 0){
            populate_stars();
            
            for (let i = 0; i < bombs_n; i++) {
                populate_bombs();
            }
            bombs_n++;
        }
    }
}

function update_score_text(){
    if(!gameOver){
        score_text.setText("Score: " + Math.round(score, 0));
    }
}

function populate_stars(){
    stars = scene.physics.add.group({
        key: 'star',
        repeat: stars_n,
        setXY: {x: 12, y: 0, stepX: 70},
    });

    stars.children.iterate(function(child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    if(stars != undefined && platforms != undefined && player != undefined && scene != undefined){
        scene.physics.add.collider(stars, platforms);
        scene.physics.add.overlap(player, stars, collectStar, null, scene);
    }
}

function playerHitBomb(player, bomb){
    this.physics.pause();
    player.setTint(0xFF0000);
    player.anims.play('turnleft');
    gameOver = true;
}

function populate_bombs(){
    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(0.9999);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-100, 100), 90);

    if(platforms != undefined){
        scene.physics.add.collider(bombs, bombs);
    }
}