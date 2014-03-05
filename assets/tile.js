Game.Tile = function(properties) {
	properties = properties || {};
	Game.Glyph.call(this,properties);
	this._blocksMove = (properties['blocksMove'] !== undefined) ? properties['blocksMove'] : true;
	this._blocksLight = (properties['blocksLight'] !== undefined) ? properties['blocksLight'] : true;
};
Game.Tile.extend(Game.Glyph);

Game.Tile.prototype.blocksMove = function() {
	return this._blocksMove;
};
Game.Tile.prototype.blocksLight = function() {
	return this._blocksLight;
};

Game.Tile.nullTile = new Game.Tile({});
Game.Tile.wallTile = new Game.Tile({
	character: '#',
	fgcolor:'#0A0',
	bgcolor: '#060',
	blocksMove: true,
	blocksLight: true,
});
Game.Tile.grassTile = new Game.Tile({
	character: '"',
	fgcolor:'#0D0',
	bgcolor: '#090',
	blocksMove: false,
	blocksLight: false,
});
Game.Tile.groundTile = new Game.Tile({
	character: '.',
	fgcolor: '#543',
	bgcolor: '#321',
	blocksMove: false,
	blocksLight: false
});
