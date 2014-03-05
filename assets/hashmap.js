Game.Hashmap = function(numValues){
	this._numValues = numValues;
};
Game.Hashmap.extend(Array);

Game.Hashmap.prototype.add = function(value) {
	var args = Array.prototype.splice.call(arguments,1);
	var key = this._getKey(args);
	this[key] = value;
};
Game.Hashmap.prototype.get = function() {
	var args = Array.prototype.splice.call(arguments,0);
	var key = this._getKey(args);
	return this[key];
};
Game.Hashmap.prototype.del = function() {
	var args = Array.prototype.splice.call(arguments,0);
	var key = this._getKey(args);
	delete this[key];
};
Game.Hashmap.prototype._getKey = function(args) {
	var key = '';
	for (var i = 0; i < this._numValues; i++) {
		key += args[i] + ',';
	}
	key = key.substr(0,key.length-1);
	return key;
};


