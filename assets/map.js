Game.Map = function(numLevels, width, height, player) {
	this._tiles = new Game.Architect(numLevels, width, height).getTiles();
	this._player = player;
	this._numLevels = numLevels;
	this._width = width;
	this._height = height;
	this._entities = new Game.Hashmap(3);
	this._scheduler = new ROT.Scheduler.Simple();
    this._engine = new ROT.Engine(this._scheduler);
    this._fov = []; 
    this._createFOV();
    this._exploredTiles = new Game.Hashmap(3);
};
Game.Map.prototype.getTiles = function() {
	return this._tiles;
};
Game.Map.prototype.getPlayer = function() {
	return this._player;
};
Game.Map.prototype.getNumLevels = function() {
	return this._numLevels;
};
Game.Map.prototype.getWidth = function() {
	return this._width;
};
Game.Map.prototype.getHeight = function() {
	return this._height;
};
Game.Map.prototype.getEntities = function() {
	return this._entities;
};
Game.Map.prototype.getEngine = function() {
	return this._engine;
};
Game.Map.prototype.getFOV = function(level) {
	return this._fov[level];
};

//functions

//returns tile at x,y on level
Game.Map.prototype.getTile = function(l,x,y) {
	l = l || this._player.getLevel();
	return this._tiles[l][x][y] || Game.Tile.nullTile;
};

//sets a tile to a new template. if same is set, will only replace if template's 'type' key is the same as that of the tile it is replacing.
Game.Map.prototype.setTile = function(template,l,x,y,same) {
	//nope for out of boundses
	if (x < 0 || x > this.getWidth() || y < 0 || y > this.getHeight()) {
		return false;
	}
	if (same) {
		if (this._tiles[l][x][y].getType() !== template.type) {
			return false;
		} 
	}
	this._tiles[l][x][y] = new Game.Tile(template);
};

//returns random tile on level. if blocksmove is set, returns tile with specified blocksmove value; defaults to false
Game.Map.prototype.getRandomTile = function(l,blocksmove) {
	blocksmove = blocksmove || false;
	var x,y;
	do {
		x = Game.randRange(0,this._width-1);
		y = Game.randRange(0,this._height-1);
	} while(!this._tiles[l][x][y].blocksMove() === blocksmove);
	return {l:l, x:x, y:y};
};

//returns entity at x,y on level
Game.Map.prototype.getEntity = function(l,x,y) {
	return this._entities.get(l,x,y);
};

//updates the entities hashmap with the entity's current position, or, if it doesn't exist, add it
Game.Map.prototype.updatePosition = function(entity,oldL,oldX,oldY) {
	if (oldL !== undefined && oldX !== undefined && oldY !== undefined) {
		this._entities.del(oldL,oldX,oldY);		
	}
	this._entities.add(entity,entity.getLevel(),entity.getX(),entity.getY());
};

//adds an entity to the map and sets the entity's map to this one
Game.Map.prototype.addEntity = function(entity,l,x,y) {
	if (x !== undefined && y !== undefined && z !== undefined) {
		entity.setPosition(l,x,y);
	}
	this.updatePosition(entity);
	entity.setMap(this);
	//TODO: only for actors
	this._scheduler.add(entity,true);
};

//adds an entity at a random valid position on level l
Game.Map.prototype.addEntityAtRandomPosition = function(entity,l) {
	var position = this.getRandomTile(l);
	entity.setPosition(position.l, position.x, position.y);
	this.addEntity(entity);
};

Game.Map.prototype.removeEntity = function(entity) {
	this._entities.del(entity.getLevel(),entity.getX(),entity.getY());
	if (entity.hasProperty('Actor')) {
		this._scheduler.remove(entity);
	}
};

//setup FOV for each level
Game.Map.prototype._createFOV = function() {
	var map = this;
	for (var i = 0; i < this._numLevels; i++) {
		var level = i;
		this._fov.push(new ROT.FOV.PreciseShadowcasting(function(x,y) {
			return !map.getTile(level,x,y).blocksLight();
		}, {topology:8}));
	}
};

//set up explored hashmap
Game.Map.prototype.setTileExplored = function(explored,l,x,y) {
	if (l >= 0 && l < this._numLevels && x >= 0 && x < this._width && y >= 0 && y < this._height) {
		this._exploredTiles.add(explored,l,x,y);
	}; 
};

//returns true if tile has been explored (exists in explored tiles hashmap)
Game.Map.prototype.isTileExplored = function(l,x,y) {
	return this._exploredTiles.get(l,x,y);
};
