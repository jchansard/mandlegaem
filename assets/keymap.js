Game.Keymap = function(template) {
	/*this.downleftcode = ROT.VK_NUMPAD1;//, this.downleft = 'downleft'
	this.downcode = ROT.VK_NUMPAD2;
	this.downrightcode = ROT.VK_NUMPAD3;
	this.leftcode = ROT.VK_NUMPAD4;
	this.restcode = ROT.VK_NUMPAD5;
	this.rightcode = ROT.VK_NUMPAD6;
	this.upleftcode = ROT.VK_NUMPAD7;
	this.upcode = ROT.VK_NUMPAD8;
	this.uprightcode = ROT.VK_NUMPAD9;
	this.uparrowcode = ROT.VK_UP;
	this.rightarrowcode = ROT.VK_RIGHT;
	this.leftarrowcode = ROT.VK_LEFT;
	this.downarrowcode = ROT.VK_DOWN;*/
	this._keys = [];
	this._keys[ROT.VK_NUMPAD1] 	= 'downleft';
	this._keys[ROT.VK_NUMPAD2] 	= 'down';
	this._keys[ROT.VK_NUMPAD3] 	= 'downright';
	this._keys[ROT.VK_NUMPAD4] 	= 'left';
	this._keys[ROT.VK_NUMPAD5] 	= 'rest';
	this._keys[ROT.VK_NUMPAD6] 	= 'right';
	this._keys[ROT.VK_NUMPAD7] 	= 'upleft';
	this._keys[ROT.VK_NUMPAD8] 	= 'up';
	this._keys[ROT.VK_NUMPAD9] 	= 'upright';
	this._keys[ROT.VK_UP] 		= 'up';
	this._keys[ROT.VK_RIGHT] 	= 'right';
	this._keys[ROT.VK_LEFT] 	= 'left';
	this._keys[ROT.VK_DOWN] 	= 'down';
	this._keys[ROT.VK_1]		= 'test';
	this._keys[ROT.VK_RETURN]   = 'enter';
	this._keys[ROT.VK_ESCAPE]   = 'esc';
	this._keys[ROT.VK_Z]		= 'button1';
	this._keys[ROT.VK_X]		= 'button2';
	this._keys[ROT.VK_C]		= 'button3';
	this._keys[ROT.VK_V]		= 'button4';
	
	for (var key in template) {
		this[key] = template[key]; 
	}
};

Game.Keymap.prototype.handleKey = function(key) {
	var func = this._keys[key];
	var args = Array.prototype.slice.call(arguments,1);
	if (this[func] !== undefined) {
		this[func].apply(this,args);
	}
};

Game.Keymap.PlayScreen = new Game.Keymap({
	downleft: function(scr) {
		var player = scr.getPlayer();
		player.tryAction(player.tryMove,-1,1,0);
	},
	down: function(scr) {
		var player = scr.getPlayer();
		player.tryAction(player.tryMove,0,1,0);
	},
	downright: function(scr) {
		var player = scr.getPlayer();
		player.tryAction(player.tryMove,1,1,0);
	},
	left: function(scr) {
		var player = scr.getPlayer();
		player.tryAction(player.tryMove,-1,0,0);
	},
	rest: function(scr) {
		var player = scr.getPlayer();
		player.tryAction(player.tryMove,0,0,0);
	},
	right: function(scr) {
		var player = scr.getPlayer();
		player.tryAction(player.tryMove,1,0,0);
	},
	upleft: function(scr) {
		var player = scr.getPlayer();
		player.tryAction(player.tryMove,-1,-1,0);
	},
	up: function(scr) {
		var player = scr.getPlayer();
		player.tryAction(player.tryMove,0,-1,0);
	},
	upright: function(scr) {
		var player = scr.getPlayer();
		player.tryAction(player.tryMove,1,-1,0);
	},
	button1: function(scr) {
		var offsets = scr.getScreenOffsets();
		var player = scr.getPlayer();
		var targetScreen = scr.getPlayer().getSkills()[1].getScreen();
		if (targetScreen !== undefined) {
			targetScreen = new Game.Screen.TargetScreen(targetScreen);
			targetScreen.init(player, player.getX(), player.getY(), offsets);
			scr.setSubscreen(targetScreen);
			Game.refreshScreen();
		} else {
			player.tryAction(player.useSkill(1));
		}
		/*new Game.Screen.TargetScreen({
				label: 'Select a target.',
				accept: function() {
					var coords = this.getMapCoords(this._cursor.x, this._cursor.y); //TODO: account for level??					
					player.useSkill(1,coords);										//TODO: what if skill1 doesn't require targetting? need to be smarter about this. maybe include the targetscreen in the skill.
				} 
		});
		targetScreen.init(player, player.getX(), player.getY(), offsets);
		scr.setSubscreen(targetScreen);
		Game.refreshScreen();*/
		return;
	}
});

Game.Keymap.SkillTargetScreen = new Game.Keymap({
	downleft: function(scr) {
		scr.moveCursor(-1,1);
	},
	down: function(scr) {
		scr.moveCursor(0,1);
	},
	downright: function(scr) {
		scr.moveCursor(1,1);
	},
	left: function(scr) {
		scr.moveCursor(-1,0);
	},
	rest: function(scr) {
		scr.moveCursor(0,0);
	},
	right: function(scr) {
		scr.moveCursor(1,0);
	},
	upleft: function(scr) {
		scr.moveCursor(-1,-1);
	},
	up: function(scr) {
		scr.moveCursor(0,-1);
	},
	upright: function(scr) {
		scr.moveCursor(1,-1);
	},
	enter: function(scr) {
		scr.acceptTarget();
	},
	esc: function(scr) {
		Game.Screen.gameScreen.setSubscreen(undefined);
	},
	button1: function(scr) {
		scr.buttonFunc1();
	},
	button2: function(scr) {
		scr.buttonFunc2();
	},
	button3: function(scr) {
		scr.buttonFunc3();
	},
	button4: function(scr) {
		scr.buttonFunc4();
	}
});
