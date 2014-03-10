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
			var map = this.getMap();
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

Game.Skills.Shoot = {
	name: 'shoot',
	source: 'skill',
	initPassive: function() {
		this._numShots = 12;
		this.getNumShots = function() {
			return this._numShots;
		};
	},
	canUse: function() {
		return (this.getNumShots() > 0);
	},
	//TODO: move this to entity
	use: function(target, options) {
		options = options || {};
		//TODO: make this not instakill, allow headshot option
		var l = this.getLevel(), x = this.getX(), y = this.getY();
		var line = Game.Calc.getLine(x, y, target.x, target.y, 5);		
		for (var i = 1; i < line.length; i++)
		{
			var entity = this.getMap().getEntities().get(l, line[i].x, line[i].y);
			var tile = this.getMap().getTile(l, line[i].x, line[i].y);
			if (entity) {
				if (entity !== this) {
					this._numShots--;
					entity.kill();
				}
				return;
			} else if (tile.blocksMove()) {
				this._numShots--;
				return;
			}
		}
		this._numShots--;
	}
};
