Game.Hashmap = function(numValues,dimensions){
	this._numValues = numValues;
	this._dimensions = dimensions || 1;
};

Game.Hashmap.prototype.add = function(value) {
	var args = Array.prototype.splice.call(arguments,1);
	var key = this._getKey(args);
	if (this._dimensions === 1) {
		this[key] = value;
	} else if (this._dimensions === 2) {
		if (this[key] === undefined) {
			this[key] = [];
		}
		this[key].push(value);
	}
};
Game.Hashmap.prototype.get = function(/*values,index*/) {
	var args = Array.prototype.splice.call(arguments,0);
	var index;
	if (args.length > this._numValues) {
		index = args[this._numValues+1];
	}
	var key = this._getKey(args);
	if (index === undefined || this._dimensions === 1) {
		return this[key];	
	} else if (this._dimensions === 2) {
		return this[key][index];
	}
	
};
Game.Hashmap.prototype.del = function(/*values,index*/) {
	var args = Array.prototype.splice.call(arguments,0);
	var index;
	if (args.length > this._numValues) {
		index = args[this._numValues+1];
	}
	var key = this._getKey(args);
	if (index === undefined || this._dimensions === 1) {
		delete this[key];	
	} else if (this._dimension === 2) {
		this[key].splice(index,1);
	}
	
};
Game.Hashmap.prototype._getKey = function(args) {
	var key = '';
	for (var i = 0; i < this._numValues; i++) {
		key += args[i] + ',';
	}
	key = key.substr(0,key.length-1);
	return key;
};
Game.Hashmap.prototype.getKeysAsArray = function() {
	var arr = Object.keys(this).slice(2);  //remove _numValues and _dimensions
	return arr;
};


