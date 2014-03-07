Game.Skills = {};

Game.Skills.Lunge = {
	name: 'lunge',
	source: 'skill',
	initPassive: function() {
		this._lungeableTargets = null;
		this.clearLungeableTargets = function() {
			this._lungeableTargets = [];
		};
		this._getLungeableTargets = function() {
		//restricting targets to enemies within sight radius so that you can't lunge things you didn't see the previous turn.
		//a radius of 2 should catch all possible lungeable targets, but we'll take the minimum of the player's modified
		//sight radius and 2 for cases when the player's sight radius is less than two.
			var radius = Math.min(this.getSightRadius(),2); 
			var entitiesInSight = this.getMap().getEntitiesInRadius(radius,this._l,this._x,this._y, false);
			for (var i = 0; i < entitiesInSight.length; i++) {
				this._lungeableTargets.push(entitiesInSight[i]);
			}
		};
	},
	events: {
	//TODO: make it so that you can't kill things you didn't see before moving (e.g. in tall grass)
		onMove: function(dx,dy,dl) {
			//should only happen if you haven't moved yet
			if (this._lungeableTargets === null) {
				this._lungeableTargets = [];
				this._getLungeableTargets();
			}
			var pos = this.getPosition();
			var map = this.getMap()
//			var visibleTiles = map.getVisibleTiles();
			var target = this.getMap().getEntity(pos.l + dl, pos.x + dx, pos.y + dy)
			if (target !== undefined && this._lungeableTargets.indexOf(target) > -1) {
				console.log('you lunge at the '+target.getName() + '!');
				target.kill();
			}
			this.clearLungeableTargets();
			/*for (var i = 0; i < Object.keys(visibleTiles).length; i++) {
				var key = Object.keys(visibleTiles)[i]
				if (typeof key !== 'function' && key !== '_numValues') {
					key = key.toString().split(",");
					var x = +key[0];
					var y = +key[1];
					var target = map.getEntity(this._l,x,y);
					if (x === 2 && y === 2) {
						//console.log(target);
					}
					if (target !== undefined && (x !== this._x && y !== this._y)) {					
						this._lungeableTargets.push(target);
					}
				}
			}*/
			/*var entitiesInSight = map.getEntitiesInRadius(this.getSightRadius(),this._l,this._x,this._y, false);
			for (var i = 0; i < entitiesInSight.length; i++) {
				this._lungeableTargets.push(entitiesInSight[i]);
			}*/
			this._getLungeableTargets();
		}
	}
};
