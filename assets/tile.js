Game.Tile = function(properties) {
	properties = properties || {};
	Game.Glyph.call(this,properties);
	this._type = properties['type'] || 'null';
	this._blocksMove = (properties['blocksMove'] !== undefined) ? properties['blocksMove'] : true;
	this._blocksLight = (properties['blocksLight'] !== undefined) ? properties['blocksLight'] : true;
	this._blocksSpawn = properties['blocksSpawn'] || this._blocksMove || false;
	this._blocksAI = (properties['blocksAI'] !== undefined) ? properties['blocksAI'] : true;
	this._sightModifier = properties['sightModifier'] || 1;
	this._actionsToTraverse = properties['actionsToTraverse'] || 1;
	this._noiseToTraverse = properties['noiseToTraverse'] || 2;
};
Game.Tile.extend(Game.Glyph);

Game.Tile.prototype.getType = function() {
	return this._type;
};
Game.Tile.prototype.blocksMove = function() {
	return this._blocksMove;
};
Game.Tile.prototype.blocksLight = function() {
	return this._blocksLight;
};
Game.Tile.prototype.blocksSpawn = function() {
	return this._blocksSpawn;
};
Game.Tile.prototype.blocksAI = function() {
	return this._blocksAI;
};
Game.Tile.prototype.getSightModifier = function() {
	return this._sightModifier;
};
Game.Tile.prototype.actionsToTraverse = function() {
	return this._actionsToTraverse;
};
Game.Tile.prototype.noiseToTraverse = function() {
	return this._noiseToTraverse;
};

Game.Tile.nullTile = new Game.Tile({});
Game.Tile.treeTile = {
	type: 'tree',
	character: '▲',
	fgcolor:'#0A0',
	bgcolor: function() {
		var color = ROT.Color.randomize([0,90,0],[0,15,0]);
		return ROT.Color.toHex(color); 
		},
	blocksMove: true,
	blocksLight: true,
	blocksSpawn: true,
	blocksAI: true,
	//sightModifier: 0.25,
	//actionsToTraverse: 3
};
Game.Tile.secretPathTile = {
	type: 'floor',
	character: '▲',
	fgcolor:'#080',
	bgcolor: function() {
		var color = ROT.Color.randomize([0,90,0],[0,15,0]);
		return ROT.Color.toHex(color); 
		},
	blocksMove: false,
	blocksLight: false,
	blocksSpawn: true,
	blocksAI: true,
	sightModifier: 0.25,
	actionsToTraverse: 3,
	noiseToTraverse: 5
};
Game.Tile.grassTile = {
	type: 'grass',
	character: '"',
	fgcolor:'#0D0',
	bgcolor: function() {
		var color = ROT.Color.randomize([0,120,0],[5,15,5]);
		return ROT.Color.toHex(color); 
		},
	blocksMove: false,
	blocksLight: false,
	blocksAI: false,
	sightModifier: 0.34
};
Game.Tile.groundTile = {
	type: 'floor',
	character: '.',
	fgcolor: '#543',
	bgcolor: function() {
		var color = ROT.Color.randomize([48,32,16],[5,5,0]);
		return ROT.Color.toHex(color); 
		},
	blocksMove: false,
	blocksLight: false,
	blocksAI: false,
};
Game.Tile.bloodTile = {
	type: 'floor',
	character: '~',
	fgcolor: '#F00',
	bgcolor: function() {
		var color = ROT.Color.randomize([120,0,0],[15,0,0]);
		return ROT.Color.toHex(color);
	},
	blocksMove: false,
	blocksLight: false,
	blocksAI: false
};
Game.Tile.bloodGrass = {
	type: 'grass',
	character: '"',
	fgcolor: '#F00',
	bgcolor: function() {
		var color = ROT.Color.randomize([172,0,0],[15,0,0]);
		return ROT.Color.toHex(color);
	},
	blocksMove: false,
	blocksLight: false,
	blocksAI: false,
	sightModifier: 0.34,	
};
