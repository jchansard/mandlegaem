Game.Architect = function(numLevels,width,height) {
	this._numLevels = numLevels;
	this._width = width;
	this._height = height;
	this._startingPoints = new Array(numLevels);
	this._tiles = new Array(numLevels);
	for (var i = 0; i < numLevels; i++) {
		this._startingPoints[i] = this._generateStartingPoint();
		do {
			this._tiles[i] = this._generateSingleLevel(5,this._startingPoints[i]);
		} while (!this._hasPathToEnd(this._tiles[i], this._startingPoints[i]));
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
Game.Architect.prototype.getStartingPoints = function() {
	return this._startingPoints;
};


Game.Architect.prototype._generateStartingPoint = function() {
		return {x: 3, y: Game.Calc.randRange(0,this._height-1)};	
};

Game.Architect.prototype._generateSingleLevel = function(iterations,startingPoint) {
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
	tiles = this._trailblaze(tiles,45);
	tiles = this._createSpawnArea(tiles, startingPoint);
	return tiles;
};

//creates lines of walkable treetiles in tree masses. Creates numPaths paths.
Game.Architect.prototype._trailblaze = function(tiles,numPaths) {
	for (var i = 0; i < numPaths; i++) {
		var startTile, firstDestinationTile, secondDestinationTile, x, y;
		startTile = this._getRandomTileOfType(tiles,'tree');
		firstDestinationTile = this._getRandomTileOfType(tiles,'floor');
		var offsets = Game.Calc.calcOffsets(startTile.x, startTile.y, firstDestinationTile.x, firstDestinationTile.y);
		do {
			secondDestinationTile = this._getRandomTileOfType(tiles,'floor');
			var offsets2 = Game.Calc.calcOffsets(startTile.x, startTile.y, secondDestinationTile.x, secondDestinationTile.y);
		} while (offsets.x === offsets2.x && offsets.y === offsets2.y);
		
		//set starting point to a secret path tile
		tiles[startTile.x][startTile.y] = new Game.Tile(Game.Tile.secretPathTile);
		
		//get the points b/w start tile and destination tile
		var path = Game.Calc.getLine(startTile.x, startTile.y, firstDestinationTile.x, firstDestinationTile.y);
		
		//turn all the trees b/w start tile and destination tile into secret path tiles until it hits a non-tree tile		
		for (var j = 1; j < path.length; j++) {
			var x = path[j].x, y = path[j].y;
			if (tiles[x][y].getType() === 'tree') {
				tiles[path[j].x][path[j].y] = new Game.Tile(Game.Tile.secretPathTile);
			} else {
				break;
			}
		}
		
		//now do the same with the second destination tile (copy paste wooooooooo)
		path = Game.Calc.getLine(startTile.x, startTile.y, secondDestinationTile.x, secondDestinationTile.y);
		for (var j = 1; j < path.length; j++) {
			var x = path[j].x, y = path[j].y;
			if (tiles[x][y].getType() === 'tree') {
				tiles[path[j].x][path[j].y] = new Game.Tile(Game.Tile.secretPathTile);
			} else {
				break;
			}
		}
	}
	return tiles;
};

Game.Architect.prototype._hasPathToEnd = function(tiles, start) {
	var endPoints = [];
	
	for (var i = 0; i < this._height; i++) {
		if (tiles[this._width-1][i].blocksMove() === false) {
			endPoints.push({x: this._width-1, y:i});
		}
	}
	var isPassable = false;
	var w = this._width;
	var h = this._height;
	for (var i = 0; i < endPoints.length; i++) {
		var path = new ROT.Path.AStar(endPoints[i].x, endPoints[i].y, function(x,y) {
			if (x < 0 || x >= w || y < 0 || y >= h) {
				return false;
			}
			return !(tiles[x][y].blocksMove());
		});
		path.compute(start.x,start.y, function(x,y) {
			isPassable = true;
		});
		if (isPassable) {
			return true;
		}
	}
	return isPassable;
};

//returns a random tile in tiles of type 'type'. 
Game.Architect.prototype._getRandomTileOfType = function(tiles,type) {
	var x,y,tile;
	do {
		x = Game.Calc.randRange(0,this._width-1);
		y = Game.Calc.randRange(0,this._height-1);
		tile = {x:x, y:y};
	} while(tiles[x][y].getType() !== type);	
	return tile;
};

Game.Architect.prototype._createSpawnArea = function(tiles,start) {	
	var circle = Game.Calc.getFilledCircle(start.x, start.y, 3);
	for (var i = 0; i < circle.length; i++) {
		tiles[circle[i].x][circle[i].y] = new Game.Tile(Game.Tile.groundTile);
	}
	return tiles;
};
