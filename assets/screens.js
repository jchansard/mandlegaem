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
	_directions: {},
	_directionKeys: [],
	enter: function() {
		this._player = new Game.Entity(Game.PlayerActor);
		var numLevels = 1;
		var width = 400;
		var height = Game.getScreenHeight();
		var map = new Game.Map.Forest(numLevels,width,height,this._player); 
		map.getEngine().start();
		//TODO: Make this better
		this._directions = {
			'l': {
				dx: -1,
				dy: 0,
				dl: 0
			},
			'r': {
				dx: 1,
				dy: 0,
				dl: 0
			},
			'u': {
				dx: 0,
				dy: -1,
				dl: 0
			},
			'd': {
				dx: 0,
				dy: 1,
				dl: 0
			}
		};
		this._directionKeys = [];
		for (var i = ROT.VK_LEFT; i <= ROT.VK_DOWN; i++) {
			this._directionKeys[i] = 'lurd'.charAt(i-ROT.VK_LEFT);
		}
	},
	render: function(display) {
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
		display.drawText(1,37,'player x: ' + this._player.getX() + '; player y: ' + this._player.getY());
			//display.draw(x + 10, 37, ' ', 'white', 'black');
			//display.draw(x + 11, 37, ' ', 'white', bg);
			//display.draw(x + 12, 37, ' ', 'white', bg);
			//display.draw(x + 13, 37, ' ', 'white', 'black');
	},
	handleInput: function(type, data) {
		//TODO: make this better?? 
		if (type === 'keydown') {
            // Movement
			if (typeof this._directionKeys[data.keyCode] === 'string') {
				var offsets = this._directions[this._directionKeys[data.keyCode]];
				this._player.tryAction(this._player.tryMove,offsets.dx,offsets.dy,offsets.dl);
				if (this._player.getNumActions() <= 0) { //TODO: this should be better......??????
					this._player.getMap().getEngine().unlock();
				}
			} else if (data.keyCode === ROT.VK_COMMA) {
				console.log(this._player.getMap().getScheduler());
			}
		}
            /*if (data.keyCode === ROT.VK_LEFT) {
                this._player.tryMove(-1, 0);
            } else if (data.keyCode === ROT.VK_RIGHT) {
                this._player.tryMove(1, 0);
            } else if (data.keyCode === ROT.VK_UP) {
                this._player.tryMove(0, -1);
            } else if (data.keyCode === ROT.VK_DOWN) {
                this._player.tryMove(0, 1);
            } else { return; }
        } else { return; }*/ 
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
    	
    	//var visibleTiles = new Game.Hashmap(2);
		map.resetVisibleTiles();
        // add all visible tiles to hashmap
        map.getFOV(player.getLevel()).compute(player.getX(), player.getY(), player.getSightRadius(), map.computePlayerFOV.bind(map));
    	//get the leftmost x coordinate to draw in order to center the player since our map is wider than the screen 
    	//but make sure that we don't display offscreen tiles if the player is close to the left border
    	var leftmostX = Math.max(0,player.getX() - (screenWidth/2));
    	//and make sure that we don't display offscreen tiles if the player is close to the right border
    	leftmostX = Math.min(leftmostX, map.getWidth() - screenWidth);
    	
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
    }
};
