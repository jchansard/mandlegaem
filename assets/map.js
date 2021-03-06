Game.Map = function(numLevels, width, height, player) {
	this._architect = new Game.Architect(numLevels, width, height);
	this._tiles = this._architect.getTiles();
	this._startingPoints = this._architect.getStartingPoints();
	this._player = player;
	this._numLevels = numLevels;
	this._width = width;
	this._height = height;
	this._actors = new Game.Hashmap(3);
	this._entities = new Game.Hashmap(3,2);
	this._PCEntities = [];
	this._scheduler = new ROT.Scheduler.Simple();
    this._engine = new ROT.Engine(this._scheduler);
    this._fov = []; 
    this._createFOV();
	this._visibleTiles = new Game.Hashmap(2);
    this._exploredTiles = new Game.Hashmap(3);
};
Game.Map.prototype.getTiles = function() {
	return this._tiles;
};
Game.Map.prototype.getStartingPoints = function () {
	return this._startingPoints;
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
Game.Map.prototype.getActors = function() {
	return this._actors;
};
Game.Map.prototype.getEntities = function() {
	return this._entities;
};
Game.Map.prototype.getPCEntities = function() {
	return this._PCEntities;
};
Game.Map.prototype.getScheduler = function() {
	return this._scheduler;
};
Game.Map.prototype.getEngine = function() {
	return this._engine;
};
Game.Map.prototype.getFOV = function(level) {
	return this._fov[level];
};
Game.Map.prototype.getVisibleTiles = function() {
	return this._visibleTiles;
};

//functions

//returns tile at x,y on level
Game.Map.prototype.getTile = function(l,x,y) {
	if (l < 0 || l >= this.getNumLevels() || x < 0 || x >= this.getWidth() || y < 0 || y >= this.getHeight()) {
		return Game.Tile.nullTile;
	}
	l = l || this._player.getLevel();
	return this._tiles[l][x][y] || Game.Tile.nullTile;
};

//sets a tile to a new template. if same is set, will only replace if template's 'type' key is the same as that of the tile it is replacing.
Game.Map.prototype.setTile = function(template,l,x,y,same) {
	//nope for out of boundses
	if (x < 0 || x >= this.getWidth() || y < 0 || y >= this.getHeight()) {
		return false;
	}
	if (same) {
		if (this._tiles[l][x][y].getType() !== template.type) {
			return false;
		} 
	}
	this._tiles[l][x][y] = new Game.Tile(template);
};

//returns random tile on level. if blocksspawn is set, returns tile with specified blocksspawn value; defaults to false
Game.Map.prototype.getRandomTile = function(l,blocksspawn) {
	blocksspawn = blocksspawn || false;
	var x,y;
	do {
		x = Game.Calc.randRange(0,this._width-1);
		y = Game.Calc.randRange(0,this._height-1);
	} while(!this._tiles[l][x][y].blocksSpawn() === blocksspawn);
	return {l:l, x:x, y:y};
};

//returns actor at x,y on level
Game.Map.prototype.getActor = function(l,x,y) {
	return this._actors.get(l,x,y);
};

Game.Map.prototype.getEntitiesAt = function(l,x,y) {
	return this._entities.get(l,x,y);
};

//returns entities in square radius around specified coordinates
//includeCenter: if true, returns entity @ l,x,y; if false, doesn't
//closestFirst: if true, sorts by closest
//visibleOnly: if true, returns only entities in visible tiles
//TODO: if closestFirst turns out to be reliable, make it the default way
Game.Map.prototype.getActorsInRadius = function(radius, l, x, y, options) {
	var includeCenter = options['includeCenter'];
	var closestFirst = options['closestFirst'];
	var visibleOnly = options['visibleOnly'];
	var hasProp = options['hasProp'] || 'Actor';
	var actors = [];	
	if (!closestFirst) {
		for (var key in this._actors) {
		//TODO: better way to loop through hashmaps
			if (this._actors[key] instanceof Game.Entity) {
				var entity = this._actors[key];
				if (entity.getX() >= (x - radius) &&
					entity.getX() <= (x + radius) &&
					entity.getY() >= (y - radius) &&
					entity.getY() <= (y + radius) &&
					entity.getLevel() === l) {
					if (includeCenter || !(entity.getX() === x && entity.getY() === y)) {
						if (!visibleOnly || this._visibleTiles.get(entity.getX(),entity.getY())) {
							if (hasProp === undefined || entity.hasProperty(hasProp)) {
								actors.push(entity);
							}
						}
					}
				}
			}
		}
	}
	else {								//TODO: this needs work
		if (includeCenter) {
			if (hasProp === undefined || entity.hasProperty(hasProp)) {
				actors.push(this._actors.get(l,x,y));
			}
		}
		for (var r = 1; r <= radius; r++) {
			for (var yoff = -1*r; yoff <= 1*r; yoff++) {
				for (var xoff = -1*r; xoff <= 1*r; xoff++) {
					var entity = this._actors.get(l, x + xoff, y + yoff);
					if (entity && !(xoff === 0 && yoff === 0) && actors.indexOf(entity) === -1) {
						if (!visibleOnly || this._visibleTiles.get(entity.getX(),entity.getY())) {
							if (hasProp === undefined || entity.hasProperty(hasProp)) {
								actors.push(entity);
							}
						}	
					}	
				}	
			}	
		}	
	}
	return actors;
};

Game.Map.prototype.getDistanceBetween = function(x1,y1,x2,y2) {
	var line = new ROT.Path.AStar(x2, y2, function(x,y) {
		return true;
	});
	var distance = -1;
	line.compute(x1, y1, function(x,y) {
		distance++;
	});
	return distance;
};

//updates the actors hashmap with the entity's current position, or, if it doesn't exist, add it
Game.Map.prototype.updatePosition = function(entity,oldL,oldX,oldY) {
	var isActor = entity.hasProperty('Actor');
	if (oldL !== undefined && oldX !== undefined && oldY !== undefined) {
		if (isActor) {
			this._actors.del(oldL,oldX,oldY);
		} else {	
			this._entities.del(oldL,oldX,oldY,this._entities.get(oldL,oldX,oldY).indexOf(entity));
		}		
	}
	if (isActor) {
		this._actors.add(entity,entity.getLevel(),entity.getX(),entity.getY());
	} else {
		this._entities.add(entity,entity.getLevel(),entity.getX(),entity.getY());
	}
	
};

//adds an entity to the map and sets the entity's map to this one
Game.Map.prototype.addEntity = function(entity,l,x,y) {
	if (x !== undefined && y !== undefined && l !== undefined) {
		entity.setPosition(l,x,y);
	}
	this.updatePosition(entity);
	entity.setMap(this);
	//TODO: only for actors
	if (entity.hasProperty('PlayerActor')) {
		this._scheduler.add(entity,true);
	}
	if (entity.isPlayerControlled()) {
		this._PCEntities.push(entity);	
	}
	
};

//adds an entity at a random valid position on level l
Game.Map.prototype.addEntityAtRandomPosition = function(entity,l) {
	do {
		var position = this.getRandomTile(l);
	} while (this.getActor(position.l, position.x, position.y) !== undefined);
	entity.setPosition(position.l, position.x, position.y);
	this.addEntity(entity);
};

Game.Map.prototype.removeEntity = function(entity) {	
	var l = entity.getLevel(), x = entity.getX(), y = entity.getY();
	if (entity.hasProperty('Actor')) {
		this._scheduler.remove(entity);
		this._actors.del(l, x, y);
	} else {
		this._entities.del(l, x, y, this._entities.get(l, x, y).indexOf(entity));
	}
	
	if (entity.isPlayerControlled()) {
		for (var i = 0; i < this._PCEntities.length; i++) {
			if (this._PCEntities[i] === entity) {
				this._PCEntities.splice(i,1);
			}
		}
	}
};

//adds actors from scheduler in a (sightradius*2) radius around the player
//TODO: remove them when they're inactive in their act function
Game.Map.prototype.updateScheduler = function() {
	var player = this._player;
	var pos = player.getPosition();
	var rad;
	//sanity check
	if (player.hasProperty('Sight')) {
		var rad = (player.getSightRadius() * 2);
	}
	else { rad = 10; };
	var actors = this.getActorsInRadius(rad,pos.l,pos.x,pos.y,{includeCenter:false, hasProp:'Actor'});
	for (var i = 0; i < actors.length; i++) {
		this._scheduler.add(actors[i]);
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
//function to use in fov compute method
Game.Map.prototype.computePlayerFOV = function(x, y, radius, visibility) {
	this.addVisibleTile(x,y);
    this.setTileExplored(true,this.getPlayer().getLevel(),x,y);
};

//resets visible tiles to an empty hashmap
Game.Map.prototype.resetVisibleTiles = function() {
	this._visibleTiles = new Game.Hashmap(2);
};

//adds x,y position to visible tile hashmap
Game.Map.prototype.addVisibleTile = function(x,y) {
	this._visibleTiles.add(true,x,y);
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

//returns the background of the displayed glyph at l,x,y
Game.Map.prototype.calcTransparentBGColor = function(l,x,y) {
	var entity = this._actors.get(l,x,y);
	if (entity) {
		var bg = entity.getBGColor();
	} 
	if (!entity || bg === 'none') {
		bg = this.getTile(l,x,y).getBGColor();
	}
	return bg;
};


