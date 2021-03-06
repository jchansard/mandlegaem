Game.Screen.TargetScreen = function(skill,template) {
	template = template || {};
	this._skill = skill;
	this._label = template['label'];
	this._keymap = template['keymap'] || Game.Keymap.SkillTargetScreen;
	this._allowAllTiles = template['allowAllTiles'] || false;
	this._maxDistance = template['maxDistance'];
	this.accept = template['accept'];
	this._buttons = template['buttons'] || [];
	if (this._buttons.length === 0) {
		this._buttons[0] = new Game.ScreenButton(Game.ScreenButtons.SelectButton, this);
		if (this._skill.hasProperty('Toggleable')) {
			this._buttons[1] = new Game.ScreenButton(Game.ScreenButtons.SkillToggleButton,this);
		} else { 
			this._buttons[1] =  new Game.ScreenButton(Game.ScreenButtons.EmptyButton, this);	
		}
		this._buttons[2] = new Game.ScreenButton(Game.ScreenButtons.NextTargetButton, this);
		this._buttons[3] = new Game.ScreenButton(Game.ScreenButtons.CancelButton, this);
	} else {
		for (var i = 0; i < this._buttons.length; i++) {
			if (this._buttons[i]) {
				this._buttons[i] = new Game.ScreenButton(this._buttons[i], this);
			}		
		}
	}
};
Game.Screen.TargetScreen.prototype.getCursor = function() {
	return this._cursor;
};
Game.Screen.TargetScreen.prototype.getSkill = function() {
	return this._skill;
};
Game.Screen.TargetScreen.prototype.getButtons = Game.Screen.gameScreen.getButtons;

Game.Screen.TargetScreen.prototype.init = function(player, x, y, offsets) {
	this._player = player;
	this._offsets = offsets;
	this._start = {x:x - offsets.x, y:y - offsets.y};
	this._cursor = {x:this._start.x, y:this._start.y};
	this._availableTargets = this._player.getMap().getActorsInRadius(this._skill.getOtherInfo('range'),this._player.getLevel(),this._player.getX(),this._player.getY(),{
					includeCenter: false,
					closestFirst: true,
					visibleOnly: true});
	this._currentTarget = 0;
};

Game.Screen.TargetScreen.prototype.render = function(display) {
	Game.Screen.gameScreen.drawTiles.call(Game.Screen.gameScreen,display);
	Game.Screen.gameScreen.drawButtons.call(this, display,1,37);
	var line = Game.Calc.getLine(this._start.x, this._start.y, this._cursor.x, this._cursor.y);
	for (var i = 1; i < line.length; i++) {
		var coords = this.getMapCoords(line[i].x, line[i].y);
		var bg;
		var map = this._player.getMap(), l = this._player.getLevel();
		if (map.isTileExplored(l, coords.x, coords.y)) {
			bg = map.calcTransparentBGColor(this._player.getLevel(), coords.x, coords.y);
		} else {
			bg = 'black';
		}
		var chr = (i !== line.length - 1) ? '•' : '○';
		Game.display.draw('play',line[i].x, line[i].y, chr,'dodgerblue',bg);
	}
	Game.display.drawText('play',1,36,this._label); //TODO: robustify
};


Game.Screen.TargetScreen.prototype.handleInput = function(type,data) {
	if (type === 'keydown') {
		this._keymap.handleKey(data.keyCode,this);
	}
	Game.display.refreshScreen(); 
};

Game.Screen.TargetScreen.prototype.getMapCoords = function(x,y) {
	return {x: this._offsets.x + x, y: this._offsets.y + y}; 
};

Game.Screen.TargetScreen.prototype.getScreenCoords = function(x,y) {
	return {x: x - this._offsets.x, y: y - this._offsets.y};
};

Game.Screen.TargetScreen.prototype.getNextTarget = function() {
	var target;
	if (this._availableTargets[this._currentTarget]) {
		target = this._availableTargets[this._currentTarget];
	}
	this._currentTarget++;
	if (this._currentTarget >= this._availableTargets.length) {
		this._currentTarget = 0;
	}
	return target;
};

Game.Screen.TargetScreen.prototype.getNextTargetCoords = function() {
	var target = this.getNextTarget();
	if (target) {
		return this.getScreenCoords(target.getX(),target.getY());
	} else {
		return this._cursor;
	}
};

Game.Screen.TargetScreen.prototype.moveCursor = function(dx, dy) {
	var tiles = this._player.getMap().getVisibleTiles();
	var coords = this.getMapCoords(this._cursor.x + dx, this._cursor.y + dy);
	if (this._allowAllTiles || 
		tiles.get(coords.x, coords.y) || 
		(this._maxDistance && Game.Calc.getLine(this._player.getX(), this._player.getY(), coords.x, coords.y).length - 1 <= this._maxDistance)) {
			this._cursor = {
				x: Math.max(0,Math.min(this._cursor.x + dx, Game.display.getScreenWidth('play')-1)),
				y: Math.max(0,Math.min(this._cursor.y + dy, Game.display.getScreenHeight('play')-1)) 
			};		
	}	
};

Game.Screen.TargetScreen.prototype.moveCursorToPoint = function(x, y) {
	this._cursor = {x: x, y: y};
};

Game.Screen.TargetScreen.prototype.acceptSubscreen = function() {      //TODO: make a whole subscreen class
	Game.Screen.gameScreen.setSubscreen(null);
	this.accept();
};

Game.Screen.AimDirectionScreen = function(skill,template) {
	template = template || {};
	this._skill = skill;
	this._label = template['label'];
	this._keymap = template['keymap'] || Game.Keymap.SkillAimDirectionScreen;
	this.accept = template['accept'];
	this._buttons = [];
};

Game.Screen.AimDirectionScreen.prototype.init = function(player) {
	this._player = player;
};

Game.Screen.AimDirectionScreen.prototype.render = function(display) {
	Game.Screen.gameScreen.drawTiles.call(Game.Screen.gameScreen,display);
	Game.Screen.gameScreen.drawButtons.call(this, display,1,37);
	if (this._skill.getCooldownTimer() > 0) {
		this._label = 'Too tired! Wait ' + this._skill.getCooldownTimer() + ' turn(s).';  //TODO: gross
	}
	Game.display.drawText('play',1,36,this._label); //TODO: robustify
};
Game.Screen.AimDirectionScreen.prototype.handleInput = function(type,data) {
	if (type === 'keydown') {
		this._keymap.handleKey(data.keyCode,this);
	}
	Game.display.refreshScreen(); 
};

Game.Screen.AimDirectionScreen.prototype.acceptSubscreen = function(dx,dy) {      //TODO: make a whole subscreen class
	Game.Screen.gameScreen.setSubscreen(null);
	this.accept(dx,dy);
};

