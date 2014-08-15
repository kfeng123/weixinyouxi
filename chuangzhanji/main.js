var MYgame={
	game:null,
	States:{},
	
};


 MYgame.States.Preloader={
	loadedcomplete:false
	,
	preload:function(){
		MYgame.States.Preloader.text=MYgame.game.add.text(32,32,'ww',{fill:'#ffffff'});
		
	},
	create:function(){
		MYgame.game.load.image('background','starfield.png');
		MYgame.game.load.spritesheet('button','button_sprite_sheet.png',193,71);
		MYgame.game.load.image('arrow','arrow.png');
		MYgame.game.load.image('enemy','enemy.png');
		MYgame.game.load.image('platform','platform.png');
		MYgame.game.load.spritesheet('kaboom','explosion.png',64,64,23);
	    MYgame.game.load.onLoadStart.add(MYgame.States.Preloader.onloadstart,this);
		MYgame.game.load.onFileComplete.add(MYgame.States.Preloader.onfilecomplete,this);
		MYgame.game.load.onLoadComplete.add(MYgame.States.Preloader.onloadcomplete,this);
		MYgame.game.load.start();
	
	},
	update:function(){
		if(MYgame.States.Preloader.loadedcomplete){
			MYgame.game.state.start('Menu');
		}
	},
	onloadstart:function(){
		MYgame.States.Preloader.text.setText("Loading ...");
	},
	onfilecomplete:function(progress,cacheKey,success,totalLoaded,totalFiles){
		MYgame.States.Preloader.text.setText("completes"+progress+"% - "+totalLoaded+" / "+totalFiles);
	},
	onloadcomplete:function(){
		MYgame.States.Preloader.text.setText("completed");
		MYgame.States.Preloader.loadedcomplete=true;
	}
	
}; 

MYgame.States.Menu={
	preload:function(){
	
	},
	create:function(){
		MYgame.States.Menu.button=MYgame.game.add.button(100,100,'button',MYgame.States.Menu.startgame,this,0,0,0);
		
	},
	upload:function(){
	
	},
	startgame:function(){
		MYgame.game.state.start('Game');
	}
}

MYgame.States.Game={
	preload:function(){},
	createjuese:function(x,y,mingzi,speed){
		//x,y坐标;mingzi图片的名字
		var juese;
		juese=this.game.add.sprite(x,y,mingzi);
		this.game.physics.enable(juese,Phaser.Physics.ARCADE);
		juese.scale.setTo(0.5,0.5);
		juese.anchor.setTo(0.5,0.5);
		
		juese.body.collideWorldBounds = true;
		juese.speed=speed;
		this.game.physics.arcade.velocityFromRotation(juese.rotation,juese.speed,juese.body.velocity);
		juese.weiba=this.game.add.group();
		return juese;
	},
	create:function(){
		
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.background=this.game.add.tileSprite(0,0,800,600,'background');
		this.game.world.setBounds(-1000,-1000,2000,2000);
		this.arrow=this.createjuese(100,100,'arrow',200);
		this.arrow.weibaimg='arrow';
		//this.arrow=this.game.add.sprite(100,100,'arrow');
		//this.arrow.scale.setTo(0.5,0.5);
		//this.arrow.anchor.setTo(0.5,0.5);
		//this.game.physics.startSystem(Phaser.Physics.ARCADE);
		//this.game.physics.enable(this.arrow,Phaser.Physics.ARCADE);
		//this.arrow.body.collideWorldBounds = true;
		//敌人
		this.enemy=this.game.add.group();
		for(var i=0;i<13;i++){
			var ll=this.createjuese(this.game.rnd.integerInRange(-1000,1000),this.game.rnd.integerInRange(-1000,1000),'enemy',150);
			ll.weibaimg='enemy';
			this.enemy.add(ll);
		}
		
		//被杀动画
		this.killanimation=this.game.add.group();
		for(var i=0;i<20;i++){
			var ll=this.killanimation.create(0,0,'kaboom',[0],false);
			ll.anchor.setTo(0.5,0.5);
			ll.animations.add('kaboom');
		}
		
		
		//键盘监听
		this.cursors=this.game.input.keyboard.createCursorKeys();
		
		//速度
		//this.speed=200;
		//this.game.physics.arcade.velocityFromRotation(this.arrow.rotation,this.speed,this.arrow.body.velocity);
		
		//摄像机
		this.game.camera.follow(this.arrow);
		this.background.fixedToCamera=true;
		
		this.score=0;
		var style = { font: "40px Arial", fill: "white", align: "center" };
		this.scoretext=this.game.add.text(32,32,MYgame.States.Game.score+'',style);
		this.scoretext.fixedToCamera=true;
		
	},
	updatejuese:function(juese){
		if(!juese.alive)return;
		
		MYgame.game.physics.arcade.velocityFromRotation(juese.rotation,juese.speed,juese.body.velocity);
		//尾巴
		var hh=juese.weiba.create(juese.x,juese.y,juese.weibaimg);
		//下面两行和第3行的顺序不能调换，我也不知道为什么，调换了之后，有一个尾巴的碰撞体积不会缩小到0.1，调试累死我了！！！破引擎！！
		hh.scale.setTo(0.1,0.1);
		hh.anchor.setTo(0.5,0.5);
		MYgame.game.physics.enable(hh,Phaser.Physics.ARCADE);
		hh.body.immovable=true;
		
		hh.wr={};
		hh.wr.counter=0;
		var shuzu=[];
		juese.weiba.forEach(
			function(obj){
				obj.wr.counter++;
				if(obj.wr.counter>=100){
				//juese.weiba.remove(obj,false);
				shuzu.push(obj);
				}
			}
		);
		for(var i=0;i<shuzu.length;i++){
			juese.weiba.remove(shuzu[i],true);
		}
	},
	update:function(){
		MYgame.States.Gameover.score=this.score;
		this.scoretext.setText(this.score+'');
		
		
		if(this.cursors.left.isDown){this.arrow.angle-=3;}
		if(this.cursors.right.isDown){this.arrow.angle+=3;}
		
		this.updatejuese(this.arrow);
		
		 var ww=this.enemy.getFirstDead();
		if(ww){
			ww.reset(this.game.rnd.integerInRange(-1000,1000),this.game.rnd.integerInRange(-1000,1000));
		} 
		this.enemy.forEach(this.AI);
		this.enemy.forEach(this.updatejuese);
		//背景
		this.background.tilePosition.x=-this.game.camera.x;
		this.background.tilePosition.y=-this.game.camera.y;
		MYgame.game.physics.arcade.collide(this.arrow, this.enemy, this.gameover, null, this);
		this.enemy.forEach(this.enemyweibacollide);
		
	},
	enemyweibacollide:function(obj){
		MYgame.game.physics.arcade.collide(MYgame.States.Game.arrow,obj.weiba,function(){MYgame.States.Game.gameover();},null,this);
		MYgame.game.physics.arcade.collide(obj,MYgame.States.Game.arrow.weiba,function(){
		//意外的发现，有可能同时与多个尾巴小块碰撞，所以加一个判断
		if(obj.exists){MYgame.States.Game.kill(obj);MYgame.States.Game.score++;}},null,this);
	},
	gameover:function(){
		MYgame.States.Game.kill(MYgame.States.Game.arrow);
		
		setTimeout(function(){MYgame.game.state.start('Gameover')},1000);
	},
	kill:function(juese){
		juese.weiba.forEach(function(hehe){hehe.kill();});
		juese.kill();
		var donghua=MYgame.States.Game.killanimation.getFirstExists(false);
		donghua.reset(juese.x,juese.y);
		donghua.play('kaboom',30,false,true);
	},
	AI:function(obj){
		var a=MYgame.game.physics.arcade.angleBetween(obj,MYgame.States.Game.arrow);
		a=a/Math.PI*180;
		var b=obj.angle;
		var c=a-b;
		c%=360;
		if(c<0)c+=360;
		if(c<=180){obj.angle+=1;}
		else {obj.angle-=1;} 
	},
	render:function(){
		/* for(var i=0;i<this.enemy.length;i++){
			this.game.debug.body(this.enemy.children[i].weiba);
			
			//for(var j=0;j<this.enemy.children[i].weiba.length;j++){
			//	this.game.debug.body(this.enemy.children[i].weiba.children[j]);
			//}
		}
		this.game.debug.body(this.arrow);
		for(var i=0;i<this.arrow.weiba.length;i++)this.game.debug.body(this.arrow.weiba.children[i]);
		//this.enemy.forEach(function(obj){MYgame.game.debug.body(MYgame.States.Game.enemy);}); */
	},
	
	
}
MYgame.States.Gameover={
	preload:function(){},
	create:function(){
		var text = "Game Over";
		var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

		var t = MYgame.game.add.text(MYgame.game.camera.x+MYgame.game.camera.width/2, MYgame.game.camera.y+MYgame.game.camera.height/2, text, style);
		MYgame.game.add.text(MYgame.game.camera.x+MYgame.game.camera.width/2-100, MYgame.game.camera.y+MYgame.game.camera.height/2-100, this.score+'', style);
		
		this.button=MYgame.game.add.button(100,100,'button',MYgame.States.Menu.startgame,this,0,0,0);
	},
	update:function(){},
	render:function(){
		
	}
}






MYgame.game=new Phaser.Game(800,600,Phaser.CANVAS,'game');

MYgame.game.state.add('Preloader',MYgame.States.Preloader);
MYgame.game.state.add('Menu',MYgame.States.Menu);
MYgame.game.state.add('Game',MYgame.States.Game);
MYgame.game.state.add('Gameover',MYgame.States.Gameover);
MYgame.game.state.start('Preloader');