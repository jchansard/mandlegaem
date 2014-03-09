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
	test: function(scr) {
		console.log(scr);
	}
});