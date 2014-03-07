Game.ActorProperties = {};

Game.ActorProperties.PlayerActor = {
	name: 'PlayerActor',
	group: 'Actor',
	act: function() {
			Game.refreshScreen();
			this.getMap().getEngine().lock();
	}
};

Game.ActorProperties.PlayerSight = {
	name: 'PlayerSight',
	group: 'Sight',
	init: function(properties) {
		this._sightRadius = properties['sightRadius'] || 4;
		this.getSightRadius = function() {
			var tile = this.getMap().getTile(this._l, this._x, this._y);
			var modifiedRadius = Math.floor(tile.getSightModifier() * this._sightRadius);
			return modifiedRadius;
		};
	}
};