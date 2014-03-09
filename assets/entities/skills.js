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
			var radius = this.getSightRadius(); 
			var entitiesInSight = this.getMap().getEntitiesInRadius(radius,this._l,this._x,this._y, false);
			for (var i = 0; i < entitiesInSight.length; i++) {
				if (this.canSee(entitiesInSight[i]));
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
			var target = this.getMap().getEntity(pos.l + dl, pos.x + dx, pos.y + dy);
			if (target !== undefined && this._lungeableTargets.indexOf(target) > -1) {
				console.log('you lunge at the '+target.getName() + '!');
				target.kill();
			}
			this.clearLungeableTargets();
			this._getLungeableTargets();
		}
	}
};
