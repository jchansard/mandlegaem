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
		scr.getButtons(0).doAction(scr,1);		
	},
	button2: function(scr) {
		scr.getButtons(1).doAction(scr,2);		
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
		scr.acceptSubscreen();
	},
	esc: function(scr) {
		Game.Screen.gameScreen.setSubscreen(undefined);
	},
	button1: function(scr) {
		scr.getButtons()[0].doAction(scr);
	},
	button2: function(scr) {
		scr.getButtons()[1].doAction(scr);
	},
	button3: function(scr) {
		scr.getButtons()[2].doAction(scr);
	},
	button4: function(scr) {
		scr.getButtons()[3].doAction(scr);
	}
});

Game.Keymap.SkillAimDirectionScreen = new Game.Keymap({
	downleft: function(scr) {
		scr.acceptSubscreen(-1,1);
	},
	down: function(scr) {
		scr.acceptSubscreen(0,1);
	},
	downright: function(scr) {
		scr.acceptSubscreen(1,1);
	},
	left: function(scr) {
		scr.acceptSubscreen(-1,0);
	},
	rest: function(scr) {
		scr.acceptSubscreen(0,0);
	},
	right: function(scr) {
		scr.acceptSubscreen(1,0);
	},
	upleft: function(scr) {
		scr.acceptSubscreen(-1,-1);
	},
	up: function(scr) {
		scr.acceptSubscreen(0,-1);
	},
	upright: function(scr) {
		scr.acceptSubscreen(1,-1);
	},
	enter: function(scr) {
		Game.Screen.gameScreen.setSubscreen(undefined);
	},
	esc: function(scr) {
		Game.Screen.gameScreen.setSubscreen(undefined);
	},
	button1: function(scr) {
		if (scr.getButtons()[0]) {
			scr.getButtons()[0].doAction(scr);
		}
	},
	button2: function(scr) {
		if (scr.getButtons()[1]) {
			scr.getButtons()[1].doAction(scr);
		}
	},
	button3: function(scr) {
		if (scr.getButtons()[2]) {
			scr.getButtons()[2].doAction(scr);
		}
	},
	button4: function(scr) {
		if (scr.getButtons()[3]) {
			scr.getButtons()[3].doAction(scr);
		}
	}
});