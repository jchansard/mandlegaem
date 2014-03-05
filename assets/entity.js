Game.Entity = function(template) {
	template = template || {};
	Game.Glyph.call(this, template);
	this._name = template['name'];
	this._x = template['x'] || 0;
	this._y = template['y'] || 0;
	this._l = template['l'] || 0;
	this._map = null;
	this._properties = {};
	this._propertyGroups = {};
	var properties = template['properties'] || [];
	for (var i = 0; i < properties.length; i++) {
		for (var key in properties[i]) {
			if (key !== 'name' && key !== 'group' && key != 'init' && !this.hasOwnProperty(key)) {
				this[key] = properties[i][key];
			} else if (key === 'name') {
				this._properties[properties[i][key]] = true;
				console.log(this._properties);
			} else if (key === 'group') {
				this._propertyGroups[properties[i][key]] = true;
			}
		}
		if (properties[i].init !== undefined) {
			properties[i].init.call(this, properties);
		}
		this._properties[properties[i].name] = true;
	}
};
Game.Entity.extend(Game.Glyph);

Game.Entity.prototype.getName = function() {
	return this._name;
};
Game.Entity.prototype.getX = function() {
	return this._x;
};
Game.Entity.prototype.getY = function() {
	return this._y;
};
Game.Entity.prototype.getLevel = function() {
	return this._l;
};
Game.Entity.prototype.getMap = function() {
	return this._map;
};
Game.Entity.prototype.setX = function(x) {
	this._x = x;
};
Game.Entity.prototype.setY = function(y) {
	this._y = y;
};
Game.Entity.prototype.setLevel = function(l) {
	this._l = l;
};
Game.Entity.prototype.setPosition = function(l,x,y) {
	l = l || this._l;
	this._l = l;
	this._x = x;
	this._y = y;
};
Game.Entity.prototype.setMap = function(map) {
	this._map = map;
};

//dl is last since level changing is rarer
Game.Entity.prototype.tryMove = function(dx, dy, dl) {
	//default dl to 0 if not passed
	dl = (dl !== undefined) ? dl : 0;
	var oldX = this._x;
	var oldY = this._y;
	var oldL = this._l;
	var newX = this._x + dx;
	var newY = this._y + dy;
	var newL = this._l + dl;
	var tile = this.getMap().getTile(newL,newX,newY);
	if (tile.blocksMove()) {
		return false;
	} else {
		this.setPosition(newL,newX,newY);
		this.getMap().updatePosition(this,oldL,oldX,oldY);
	}
};
