Game.Tile = function(properties) {
	properties = properties || {};
	Game.Glyph.call(this,properties);
	this._type = properties['type'];
	this._blocksMove = (properties['blocksMove'] !== undefined) ? properties['blocksMove'] : true;
	this._blocksLight = (properties['blocksLight'] !== undefined) ? properties['blocksLight'] : true;
	this._blocksSpawn = properties['blocksSpawn'] || this._blocksMove || false;
	this._blocksAI = properties['blocksAI'] || false;
	this._sightModifier = properties['sightModifier'] || 1;
	this._actionsToTraverse = properties['actionsToTraverse'] || 1;
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

Game.Tile.nullTile = new Game.Tile({});
Game.Tile.treeTile = {
	type: 'tree',
	character: '♣',
	fgcolor:'#0A0',
	bgcolor: function() {
		var color = ROT.Color.randomize([0,90,0],[0,15,0]);
		return ROT.Color.toHex(color); 
		},
	blocksMove: false,
	blocksLight: true,
	blocksSpawn: true,
	blocksAI: true,
	actionsToTraverse: 3
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
	sightModifier: 0.25
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
	blocksLight: false
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
	blocksLight: false
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
	sightModifier: 0.25,	
};
