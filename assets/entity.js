Game.Entity = function(template) {
	template = template || {};
	Game.Glyph.call(this, template);
	this._name = template['name'];
	this._x = template['x'] || 0;
	this._y = template['y'] || 0;
	this._l = template['l'] || 0;
	this._skills = template['skills'] || [];
	this._map = null;
	this._properties = {};
	this._propertyGroups = {};
	this._events = {};
	this._applySkillPassives();
	var properties = template['properties'] || [];
	for (var i = 0; i < properties.length; i++) {
		for (var key in properties[i]) {
			if (key !== 'name' && key !== 'group' && key !== 'init' && key !== 'events' && !this.hasOwnProperty(key)) {
				this[key] = properties[i][key];
			} else if (key === 'name') {
				this._properties[properties[i][key]] = true;
			} else if (key === 'group') {
				this._propertyGroups[properties[i][key]] = true;
			}
		}
		if (properties[i].events !== undefined) {
			for (var key in properties[i].events) {	
				if (this._events[key] === undefined) {
					this._events[key] = [];
				}
				this._events[key].push(properties[i].events[key]);
			}
		}
		if (properties[i].init !== undefined) {
			properties[i].init.call(this, template);
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
Game.Entity.prototype.getPosition = function() {
	return {l: this._l, x: this._x, y: this._y};
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

Game.Entity.prototype.hasProperty = function(property) {
	return this._properties[property] || this._propertyGroups[property];
};

Game.Entity.prototype._applySkillPassives = function() {
	for (var i = 0; i < this._skills.length; i++) {
		if (this._skills[i].initPassive !== undefined) {
			this._skills[i].initPassive.call(this);
		}
		if (this._skills[i].events !== undefined) {
			for (var key in this._skills[i].events) {	
				if (this._events[key] === undefined) {
					this._events[key] = [];
				}
				this._events[key].push(this._skills[i].events[key]);
			}
		}
	}
};

Game.Entity.prototype.reactToEvent = function(event) {
	if (this._events[event] === undefined) {
		return false;
	}
	var args = Array.prototype.slice.call(arguments,1);
	for (var i = 0; i < this._events[event].length; i++) {
		this._events[event][i].apply(this,args);
	}
};

//dl is last since level changing is rarer
Game.Entity.prototype.tryMove = function(dx, dy, dl) {
	//default dl to 0 if not passed
	dl = (dl !== undefined) ? dl : 0;
	if (dx === 0 && dy === 0 && dl === 0) {
		return 1;
	}
	var newX = this._x + dx;
	var newY = this._y + dy;
	var newL = this._l + dl;
	var tile = this.getMap().getTile(newL,newX,newY);
	var target = this.getMap().getEntity(newL,newX,newY);
	if (tile.blocksMove()) {
		return -1;
	} else if (target) {
		if (this.hasProperty('PlayerActor')) {
			target.kill();
			this.reactToEvent('onMove',dx, dy, dl);
			return 1;
		}
	} else {
		if (this.hasProperty('PlayerActor')) {
			var actions = tile.actionsToTraverse();		
			if (this.getNumActions() >= actions) {		//TODO: don't like calculating this in here
				this.move(newL,newX,newY);
				this.reactToEvent('onMove', dx, dy, dl);
				return actions;
			} else {
				console.log('not enough actions! have: ' + this.getNumActions() + ', need ' + actions);
				return -1;
			}
		}
		this.move(newL,newX,newY);
		this.reactToEvent('onMove', dx, dy, dl);
		return 1;
	}
};

Game.Entity.prototype.move = function(newL, newX, newY) {
	var oldl = this._l, oldx = this._x, oldy = this._y;
	this.setPosition(newL,newX,newY);
	this.getMap().updatePosition(this,oldl,oldx,oldy);	//TODO: don't really like this function needing old coordinates
};

//kills the entity
Game.Entity.prototype.kill = function() {
	this.getMap().removeEntity(this);
	//add blood tiles 
	var tileType = this.getMap().getTile(this._l, this._x, this._y).getType();
	if (tileType === 'floor') {
		for (var x = -1; x <= 1; x++) {
			for (var y = -1; y <= 1; y++) {
				if (Game.Calc.randRange(0,1) || (x === 0 && y === 0)) {
					this.getMap().setTile(Game.Tile.bloodTile, this._l, this._x + x, this._y + y, {sameProperties:true});
				}
			}
		}
	} else if (tileType === 'grass') {
		this.getMap().setTile(Game.Tile.bloodGrass, this._l, this._x, this._y);
	}
};
