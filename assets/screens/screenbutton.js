Game.ScreenButton = function(properties,scrn) {
	this._screen = scrn;
	this._caption = properties['caption'] || '';	
	this._FGColor = properties['FGColor'] || 'white';
	this._BGColor = properties['BGColor'] || 'darkslateblue';
	this._buttonLength = properties['buttonLength'] || 18;
	this._isToggle = properties['isToggle'] || false;
	if (this._isToggle) {
		this._toggled = false;
		this._toggleCaption = properties['toggleCaption'];
	}
	this.doAction = properties['action'] || function() { return false; };
};

Game.ScreenButton.prototype.getCaption = function() {
	if (typeof this._caption === 'function') {
		return this._caption.apply(this,Array.prototype.slice.call(arguments));
	} else {
		return this._caption;
	}
};
Game.ScreenButton.prototype.getFGColor = function() {
	return this._FGColor;
};
Game.ScreenButton.prototype.getBGColor = function() {
	return this._BGColor;
};
Game.ScreenButton.prototype.getButtonLength = function() {
	return this._buttonLength;
};
Game.ScreenButton.prototype.isToggled = function() {
	if (this._isToggle) {
		return this._toggled;
	} else {
		return false;
	}
};
Game.ScreenButton.prototype.getToggleCaption = function() {
	if (typeof this._toggleCaption === 'function') {
		return this._toggleCaption.apply(this,Array.prototype.slice.call(arguments));
	} else {
		return this._toggleCaption;
	}
};
Game.ScreenButton.prototype.setCaption = function(caption) {
	this._caption = caption;
};
Game.ScreenButton.prototype.setBGColor = function(color) {
	this._BGColor = color;
};
Game.ScreenButton.prototype.setFGColor = function(color) {
	this._FGColor = color;
};
Game.ScreenButton.prototype.draw = function(display,x,y) {
	var paddedCaption = this.getCaption(this);
	if (this._isToggle) {
		if (this._toggled) {
			var paddedCaption = this.getToggleCaption(this);
		}
	} 
	while (paddedCaption.length < this._buttonLength - 4) {
		if (paddedCaption.length % 2) {
			paddedCaption = ' ' + paddedCaption;;
		} else {
			paddedCaption += ' ';
		}
	}
	var c1 = ROT.Color.toHex(ROT.Color.interpolate(ROT.Color.fromString(this._BGColor),[0,0,0],0.5));
	var c2 = ROT.Color.toHex(ROT.Color.interpolate(ROT.Color.fromString(this._BGColor),[0,0,0],0.25));
	display.drawText(x, y, '%c{' + this._FGColor + '}%b{' + c1 + '}[%b{' + c2 + '} %b{' + this._BGColor + '}' + paddedCaption + '%b{' + c2 + '} ' + '%b{' + c1 + '}]');
};

Game.ScreenButton.ButtonUseSkill = function(scr,skill) {
	var offsets = scr.getScreenOffsets();
	var player = scr.getPlayer();
	var targetScreen = scr.getPlayer().getSkills()[skill].getScreen();
	var skill = player.getSkills()[skill];
	if (targetScreen) {
		switch (skill.getAimType()) {
			case 'target':
				targetScreen = new Game.Screen.TargetScreen(skill,targetScreen);
				targetScreen.init(player, player.getX(), player.getY(), offsets);
				Game.ScreenButton.ButtonNextTarget(targetScreen);		//TODO: icky?
				break;
			case 'direction':
				targetScreen = new Game.Screen.AimDirectionScreen(skill,targetScreen);
				targetScreen.init(player);
				break;
		}
	Game.Screen.gameScreen.setSubscreen(targetScreen);
	Game.refreshScreen();
	} else {
		player.tryAction(player.useSkill(skill));
	}
};

Game.ScreenButton.ButtonAccept = function(scr) {
	scr.acceptSubscreen();
};
Game.ScreenButton.ButtonCancel = function() {
	Game.Screen.gameScreen.setSubscreen(undefined);
};
Game.ScreenButton.ButtonNextTarget = function(scr) {
	var coords = scr.getNextTargetCoords();
	scr.moveCursorToPoint(coords.x, coords.y);
};

Game.ScreenButton.ButtonToggle = function() {
	if (this._isToggle === true) {
		if (this._toggled === true) {  	
			this._toggled = false;
		} else {
			this._toggled = true;
		}
	Game.refreshScreen();
	}
};