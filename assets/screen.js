Game.Screen = {}; //TODO: make this a constructor

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
	_buttons: [],
	enter: function() {
		this._player = new Game.Entity(Game.PlayerActor);
		this.initButtons();
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
		display.drawText(16,36,'bullets: ');
		var skills = this._player.getSkills();  //TODO: get button key
		this.drawButtons(display, 1, 37);
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
	initButtons: function() {
		var skills = this._player.getSkills();
		var keys = ['Z','X','C','V'];				//TODO: don't hardcode
		for (var i = 1; i < skills.length; i++) { 	//TODO: passives??
			this._buttons.push(new Game.ScreenButton({
				caption: skills[i].getName() + '(' + keys[i-1] + ')',
				FGColor: 'white',
				BGColor: 'darkslateblue',
				buttonLength: 18,
				action: Game.ScreenButton.ButtonUseSkill
			}));
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
	drawButtons: function(display, x, y) {
		var buttons;
		if (this._subscreen && this._subscreen.getButtons() !== undefined) {
			buttons = this._subscreen.getButtons();
		} else {
			buttons = this._buttons;
		}
		var prevX = 0;
		for (var i = 0; i < buttons.length; i++) {			
			if (buttons[i] !== undefined) {
				prevX += (i > 0) ? buttons[i-1].getButtonLength() : 0;
				buttons[i].draw(display, x + prevX , y);
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
    getButtons: function(i) {
    	if (typeof i === 'number') {
    		return this._buttons[i];
    	} else {	
    		return this._buttons; 
    	}
    },
    setSubscreen: function(subscreen) {
    	this._subscreen = subscreen;
    }
};