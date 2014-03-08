Game.Architect = function(numLevels,width,height) {
	this._numLevels = numLevels;
	this._width = width;
	this._height = height;
	this._tiles = new Array(numLevels);
	for (var i = 0; i < numLevels; i++) {
		this._tiles[i] = this._generateSingleLevel(5);
	}
};

Game.Architect.prototype.getNumLevels = function() {
	return this._numLevels;
};
Game.Architect.prototype.getWidth = function() {
	return this._width;
};
Game.Architect.prototype.getHeight = function() {
	return this._height;
};
Game.Architect.prototype.getTiles = function() {
	return this._tiles;
};

Game.Architect.prototype._generateSingleLevel = function(iterations) {
	var w = this._width;
	var h = this._height;
	var tiles = new Array(w);
	for (var i = 0; i < w; i++) {
		tiles[i] = new Array(h);
	}
	//generate the grass and dirt floor
	var grassGen = new ROT.Map.Cellular(w, h);
	//40% chance of grass
	grassGen.randomize(0.4);
	for (var i = 1; i < iterations; i++) {
		grassGen.create();
	}
	grassGen.create(function(x,y,v) {
		if (v === 1) { 
			tiles[x][y] = new Game.Tile(Game.Tile.grassTile);	
     	} else { 
			tiles[x][y] = new Game.Tile(Game.Tile.groundTile); 
		}
	});
	//generate the trees - 50% chance
	var treeGen = new ROT.Map.Cellular(w, h);
	treeGen.randomize(0.5);
	for (var i = 1; i < iterations; i++) {
		treeGen.create();
	}
	treeGen.create(function(x,y,v) {
		if (v === 1) { 
			tiles[x][y] = new Game.Tile(Game.Tile.treeTile); 
		}
	});
	
	return tiles;
};
