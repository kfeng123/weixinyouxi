var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('arrow', 'arrow.png');
}

var plane;
var Target;
var cursors;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#0072bc';

    plane = game.add.sprite(400, 300, 'arrow');
    plane.anchor.setTo(0.5, 0.5);
	
	Target=game.add.sprite(400,500,'arrow');
	Target.anchor.setTo(0.5,0.5);

    //	Enable Arcade Physics for the sprite
    game.physics.enable(plane, Phaser.Physics.ARCADE);

	game.physics.enable(Target,Phaser.Physics.ARCADE);
	
    //	Tell it we don't want physics to manage the rotation
    plane.body.allowRotation = false;
	
	cursors = game.input.keyboard.createCursorKeys();
	game.camera.follow(plane);

}

function update() {

    plane.rotation = game.physics.arcade.moveToObject(plane,Target,60, 1000);
	//Target.y=plane.y+200;
	if(cursors.right.isDown){
		Target.body.velocity.x=300;
	}
	else if(cursors.left.isDown){
		Target.body.velocity.x=-300;
	}
	else{
		Target.body.velocity.x=0;
	}

}

function render() {

    game.debug.spriteInfo(plane, 32, 32);
	game.debug.cameraInfo(game.camera, 32, 200);
}