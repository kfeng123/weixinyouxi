var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('arrow', 'arrow.png');
	game.load.image('pipe','platform.png');
}

var plane;
var Target;
var cursors;
var pipe;
var h;

function create() {
	game.world.setBounds(0, 0, 800, 100000);
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#0072bc';

    plane = game.add.sprite(200, 300, 'arrow');
	plane.scale.setTo(0.7,0.7);
    plane.anchor.setTo(0.5, 0.5);
	
	Target=game.add.sprite(1500,1000,'arrow');
	Target.anchor.setTo(0.5,0.5);

    //	Enable Arcade Physics for the sprite
    game.physics.enable(plane, Phaser.Physics.ARCADE);
	plane.body.collideWorldBounds = true;
	game.physics.enable(Target,Phaser.Physics.ARCADE);
	
    //	Tell it we don't want physics to manage the rotation
    plane.body.allowRotation = false;
	
	cursors = game.input.keyboard.createCursorKeys();
	game.camera.follow(plane);
	
	pipe=game.add.group();
	pipe.enableBody=true;
	pipe.physicsBodyType = Phaser.Physics.ARCADE;
	h=plane.y;
	for (var i=0;i<10;i++){
		h+=Math.random()*100+200;
		var temp;
		temp=pipe.create(i%2*400,h,'pipe');
		temp.body.immovable=true;
		
	}
	
}



function update() {
	game.physics.arcade.overlap(plane,pipe,gameover,null,this);
	game.physics.arcade.collide(plane, pipe);
    plane.rotation = game.physics.arcade.moveToObject(plane,Target,60, 5000);
	
	Target.y=plane.y+700;
	
	if(cursors.right.isDown){
		Target.body.velocity.x=1500;
	}
	else if(cursors.left.isDown){
		Target.body.velocity.x=-1500;
	}
	else{
		Target.body.velocity.x=0;
	}
	pipe.forEach(function(obj){
		if(obj.y<plane.y-500){
			h+=Math.random()*100+200;
			obj.y=h;
		}
	});
	
}

function gameover(){
	plane.kill();
	stateText=game.add.text(game.camera.x+game.camera.width/2,game.camera.y+game.camera.height/2,'game over', { font: '84px Arial', fill: '#fff' });
	stateText.anchor.setTo(0.5, 0.5);
}

function render() {

    game.debug.spriteInfo(plane, 32, 32);
	game.debug.cameraInfo(game.camera, 32, 200);
}