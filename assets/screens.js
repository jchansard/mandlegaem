Game.Screen = {};

Game.Screen.startScreen = {
	enter: function() { 
    	return;
    },
    render: function(display) {
    	
        // TODO: make this purdy
        display.drawText(55,15, "%c{blue}mandlerlike");
        display.drawText(55,16, "%c{lightblue}press enter");
    },
    handleInput: function(type, data) {
        // go to main game screen if enter is pressed
        if (type === 'keydown') {
            if (data.keyCode === ROT.VK_RETURN) {
                Game.changeScreen(Game.Screen.gameScreen);
            }
        }
    }
};

Game.Screen.gameScreen = {
	_player: null,
	_subscreen: null,
	_keymap: Game.Keymap.PlayScreen,	
	enter: function() {
		this._player = new Game.Entity(Game.PlayerActor);
		var numLevels = 1;
		var width = 400;
		var height = Game.getScreenHeight();
		var map = new Game.Map.Forest(numLevels,width,height,this._player); 
		map.getEngine().start();
	},
	render: function(display) {
		if (this._subscreen) {
			this._subscreen.render(display);
			return;
		}
		var map = this._player.getMap();
		var actions = this._player.getNumActions() || 3;
		var icons = '';
		this.drawTiles(display,map);
		for (var i = 0; i < 3; i++) {
			if (actions > i) {
				icons += '%c{#77F}▐▌';
			}
			else {
				icons += '%c{#009}▐▌';
			}
		}
		display.drawText(1,36,'actions:' + icons);
		for (var i = 1; i <= 12; i++) {
			if (this._player.getNumShots() >= i) {
				display.draw(23 + (i*2),36,'▀','yellow','red');
			} else {
				break;
			}
		}
		display.drawText(16,36,'bullets: ');// + this._player.getNumShots());
		//display.drawText(1,37,'player x: ' + this._player.getX() + '; player y: ' + this._player.getY());
		var skills = this._player.getSkills();  //TODO: get button key
		this.drawButtons(display, 'Z: ' + skills[1].getName(),'','','');
	},
	handleInput: function(type, data) {	
		if (this._subscreen) {
            this._subscreen.handleInput(type,data);
            return;
        }
		if (type === 'keydown') {
			this._keymap.handleKey(data.keyCode,this);
		}    
	},
    drawTiles: function(display) {
    	//get stuff to make it easier to work with
    	var player = this._player;
    	var map = player.getMap();
    	var l = player.getLevel();
    	var tiles = map.getTiles();
    	var entities = map.getEntities();
    	var screenWidth = Game.getScreenWidth();
    	var screenHeight = Game.getScreenHeight();
    	
		map.resetVisibleTiles();
        // add all visible tiles to hashmap
        map.getFOV(player.getLevel()).compute(player.getX(), player.getY(), player.getSightRadius(), map.computePlayerFOV.bind(map));
    	//get the leftmost x coordinate to draw in order to center the player since our map is wider than the screen 
    	var leftmostX = this.getScreenOffsets().x;
    	
    	//draw them tiles
    	for (var x = leftmostX; x < screenWidth + leftmostX; x++) {
    		for (var y = 0; y < Math.min(map.getHeight(),screenHeight); y++) {
    			var glyph = tiles[l][x][y];
    			var fg,bg,character;
    			if (map.isTileExplored(l,x,y)) {
	    			if (map.getVisibleTiles().get(x,y)) {
	    				if (entities.get(l,x,y)) {
		    				glyph = map.getEntity(l,x,y);
	    				}
	    			fg = glyph.getFGColor();
		    		bg = glyph.getBGColor();
					if (bg === 'none') {
						bg = tiles[l][x][y].getBGColor();
					}
		    		character = glyph.getChar();
	    			} else {
	    				fg = ROT.Color.toHex(ROT.Color.interpolate(ROT.Color.fromString(glyph.getFGColor()),[0,0,0],0.5));
	    				bg = ROT.Color.toHex(ROT.Color.interpolate(ROT.Color.fromString(glyph.getBGColor()),[0,0,0],0.8));
	    				character = glyph.getChar();
	    			}
	    			display.draw(x-leftmostX, y, character, fg, bg);
    			}
    		}
    	}
    },
	drawButtons: function(display,button1,button2,button3,button4) {
		//TODO: center button function?
		for (var i = 0; i < 4; i++) {
			var caption = arguments[i+1];
			while (caption.length < 12) {
				if (caption.length % 2) {
					caption = ' ' + caption;;
				} else {
					caption += ' ';
				}
			}
			if (arguments[i+1] !== '') {
				display.drawText(1 + (i*15), 37, '%c{white}%b{DeepSkyBlue}[%b{DodgerBlue}' + caption + '%b{DeepSkyBlue}]');
			}
		}
	},
    getScreenOffsets: function() {
    	var map = this._player.getMap();
    	//but make sure that we don't display offscreen tiles if the player is close to the left border
    	var leftmostX = Math.max(0,this._player.getX() - (Game.getScreenWidth()/2));
    	//and make sure that we don't display offscreen tiles if the player is close to the right border
    	leftmostX = Math.min(leftmostX, map.getWidth() - Game.getScreenWidth());
    	var topmostY = Math.max(0,this._player.getY() - (Game.getScreenHeight()/2));
    	topmostY = Math.min(topmostY, map.getHeight() - Game.getScreenHeight());
    	return {x: leftmostX, y:topmostY};
    },
    getPlayer: function() {
    	return this._player;
    },
    setSubscreen: function(subscreen) {
    	this._subscreen = subscreen;
    }
};

Game.Screen.TargetScreen = function(skill,template) {
	template = template || {};
	this._skill = skill;
	this._label = template['label'];
	this._keymap = template['keymap'] || Game.Keymap.SkillTargetScreen;
	this._allowAllTiles = template['allowAllTiles'] || false;
	this.buttonCaption1 = template['buttonCaption1'] || '';
	this.buttonCaption2 = template['buttonCaption2'] || '';
	this.buttonCaption3 = template['buttonCaption3'] || '';
	this.buttonCaption4 = template['buttonCaption4'] || '';
	this.accept = template['accept'];
	this.buttonFunc1 = template['buttonFunc1'];
	this.buttonFunc2 = template['buttonFunc2'];
	this.buttonFunc3 = template['buttonFunc3'];
	this.buttonFunc4 = template['buttonFunc4'];
};

Game.Screen.TargetScreen.prototype.init = function(player, x, y, offsets) {
	this._player = player;
	this._offsets = offsets;
	this._start = {x:x - offsets.x, y:y - offsets.y};
	this._cursor = {x:this._start.x, y:this._start.y};
	this._availableTargets = this._player.getMap().getEntitiesInRadius(this._skill.getOtherInfo('range'),this._player.getLevel(),this._player.getX(),this._player.getY(),{
					includeCenter: false,
					closestFirst: true,
					visibleOnly: true});
	this._currentTarget = 0;
};

Game.Screen.TargetScreen.prototype.render = function(display) {
	Game.Screen.gameScreen.drawTiles.call(Game.Screen.gameScreen,display);
	Game.Screen.gameScreen.drawButtons.call(this, display, this.buttonCaption1, this.buttonCaption2, this.buttonCaption3, this.buttonCaption4);
	var line = Game.Calc.getLine(this._start.x, this._start.y, this._cursor.x, this._cursor.y);
	for (var i = 1; i < line.length; i++) {
		var coords = this.getMapCoords(line[i].x, line[i].y);
		var bg = this._player.getMap().calcTransparentBGColor(
			this._player.getLevel(), coords.x, coords.y);
		var chr = (i !== line.length - 1) ? '•' : '○';
		display.draw(line[i].x, line[i].y, chr,'goldenrod',bg);
	}
	display.drawText(1,36,this._label); //TODO: robustify
};

Game.Screen.TargetScreen.prototype.handleInput = function(type,data) {
	if (type === 'keydown') {
		this._keymap.handleKey(data.keyCode,this);
	}
	Game.refreshScreen(); 
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
	this._cursor = this.getScreenCoords(target.getX(),target.getY());
};

Game.Screen.TargetScreen.prototype.moveCursor = function(dx, dy) {
	var tiles = this._player.getMap().getVisibleTiles();
	var coords = this.getMapCoords(this._cursor.x + dx, this._cursor.y + dy);
	if (this._allowAllTiles || tiles.get(coords.x, coords.y)) {
		this._cursor = {
			x: Math.max(0,Math.min(this._cursor.x + dx, Game.getScreenWidth())),
			y: Math.max(0,Math.min(this._cursor.y + dy, Game.getScreenWidth())) 
		};		
	}	
};

Game.Screen.TargetScreen.prototype.acceptTarget = function() {
	Game.Screen.gameScreen.setSubscreen(null);
	this.accept();
};

Game.Screen.SkillTargetScreen = new Game.Screen.TargetScreen({
	label: 'Select a target.',
	accept: function() {
		var coords = this.getMapCoords(this._cursor.x, this._cursor.y);
		var entity = this._player.getMap().getEntities().get(this._player.getLevel(), coords.x, coords.y);
		if (entity) {
			entity.kill();
		}
	},
	keymap: Game.Keymap.SkillTargetScreen
});
