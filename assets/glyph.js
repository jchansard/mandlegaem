Game.Glyph = function(properties) {
	properties = properties || {};	
	this._character = properties['character'] || '®';
	this._fgcolor = (typeof properties['fgcolor'] === 'function') ? properties['fgcolor']() : properties['fgcolor'] || '#FFF';
	this._bgcolor = (typeof properties['bgcolor'] === 'function') ? properties['bgcolor']() : properties['bgcolor'] || '#000'; 
};
Game.Glyph.prototype.getChar = function() {
	return this._character;
};
Game.Glyph.prototype.getFGColor = function() {
	return this._fgcolor;
};
Game.Glyph.prototype.getBGColor = function() {
	return this._bgcolor;
};
Game.Glyph.prototype.setChar = function(character) {
	this._character = character;
};
Game.Glyph.prototype.setFGColor = function(color) {
	this._fgcolor = color;
};
Game.Glyph.prototype.setBGColor = function(color) {
	this._bgcolor = color;
};
Game.Glyph.prototype.getGlyph = function() {
	return '%c{' + this._fgcolor + '}%b{' + this._bgcolor + '}' + this._character;
};
