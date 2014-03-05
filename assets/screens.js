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
	enter: function() {
		this._player = new Game.Entity(Game.PlayerActor);
		var numLevels = 1;
		var width = 400;
		var height = Game.getScreenHeight();
		var map = new Game.Map.Forest(numLevels,width,height,this._player); 
	},
	render: function(display) {
		var map = this._player.getMap();
		this.drawTiles(display,map);
	},
	handleInput: function(type, data) {
		//TODO: make this better?? especially refreshing every keypress
		if (type === 'keydown') {
            // Movement
            if (data.keyCode === ROT.VK_LEFT) {
                this._player.tryMove(-1, 0);
            } else if (data.keyCode === ROT.VK_RIGHT) {
                this._player.tryMove(1, 0);
            } else if (data.keyCode === ROT.VK_UP) {
                this._player.tryMove(0, -1);
            } else if (data.keyCode === ROT.VK_DOWN) {
                this._player.tryMove(0, 1);
            } else { return; }
        } else { return; }
        Game.refreshScreen();
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
    	
    	//get the leftmost x coordinate to draw in order to center the player since our map is wider than the screen 
    	//but make sure that we don't display offscreen tiles if the player is close to the left border
    	var leftmostX = Math.max(0,player.getX() - (screenWidth/2));
    	//and make sure that we don't display offscreen tiles if the player is close to the right border
    	leftmostX = Math.min(leftmostX, map.getWidth() - screenWidth);
    	
    	//draw them tiles
    	for (var x = leftmostX; x < screenWidth + leftmostX; x++) {
    		for (var y = 0; y < Math.min(map.getHeight(),screenHeight); y++) {
    			var glyph;
    			if (entities.get(l,x,y)) {
    				glyph = map.getEntity(l,x,y).getGlyph();
    			} else {
    				var glyph = tiles[l][x][y].getGlyph();
    			}
    			display.drawText(x-leftmostX,y,glyph);
    		}
    	}
    }
};
