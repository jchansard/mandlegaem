Game.Skills = function(source,template) {
	this._source = source;
	this._name = template['name'];
	this._events = template['events'];
	this._screen = template['scr'];
	this.initPassive = template['initPassive'] || function() { return; };
	this.canUse = template['canUse'] || function() { return false; };
	this.use = template['use'] || function() { return false; };
	this._otherInfo = template['otherInfo'];			//TODO: skills have properties like actors e.g. range, aoe, target type
	this._toggle = template['toggle'];					//TODO: merge this with above
};  

Game.Skills.prototype.getSource = function() {
	return this._source;
};
Game.Skills.prototype.getName = function() {
	return this._name;
};
Game.Skills.prototype.getEvents = function() {
	return this._events;
};
Game.Skills.prototype.getScreen = function() {
	return this._screen;
};
Game.Skills.prototype.getOtherInfo = function(key) {		//TODO: don't like "other info"
	if (key) {
		return this._otherInfo[key];
	} else {
		return this._otherInfo;
	}
};
Game.Skills.prototype.getToggle = function() {
	return this._toggle;
};
Game.Skills.prototype.setOtherInfo = function(key,value) {
	this._otherInfo[key] = value;
};


Game.Skills.Lunge = {
	name: 'lunge',
	source: 'skill',
	initPassive: function(source) {
		source._lungeableTargets = null;
		source.clearLungeableTargets = function() {
			source._lungeableTargets = [];
		};
		source._getLungeableTargets = function() {
		//restricting targets to enemies within sight radius so that you can't lunge things you didn't see the previous turn.
			var radius = source.getSightRadius(); 
			var entitiesInSight = source.getMap().getEntitiesInRadius(radius,source._l,source._x,source._y, {includeCenter:false});
			for (var i = 0; i < entitiesInSight.length; i++) {
				if (source.canSee(entitiesInSight[i]));
				source._lungeableTargets.push(entitiesInSight[i]);
			}
		};
	},
	events: {
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
	},
};

Game.Skills.Shoot = {
	name: 'Shoot',
	source: 'skill',
	initPassive: function(source) {
		source._numShots = 12;
		source.getNumShots = function() {
			return source._numShots;
		};
		source.modifyNumShots = function(num) {
			source._numShots += num;
		};
	},
	otherInfo: {
		range: 4,
	},
	toggle: ['Normal (0)','Headshot (1)'],			//TODO: don't hardcode actions taken? also allow for more than one toggle?
	scr: {
		label: 'Select a target.',
		accept: function() {
			var coords = this.getMapCoords(this._cursor.x, this._cursor.y); //TODO: account for level??					
			this._player.tryAction(this._player.useSkill,'Shoot',coords,{headshot:this.getButtons(1).isToggled()});  //TODO: ewwwwwww
		},
	},
	canUse: function() {
		return (this._source.getNumShots() > 0);
	},
	use: function(target, options) {
		options = options || {};
		//TODO: make this not instakill if can't see enemy
		var l = this._source.getLevel(), x = this._source.getX(), y = this._source.getY();
		var line = Game.Calc.getLine(x, y, target.x, target.y, 5);		
		for (var i = 1; i < line.length; i++)
		{
			var entity = this._source.getMap().getEntities().get(l, line[i].x, line[i].y);
			var tile = this._source.getMap().getTile(l, line[i].x, line[i].y);
			var actions = (options['headshot']) ? 1 : 0;
			if (entity) {
				if (entity !== this._source) {
					this._source.modifyNumShots(-1);
					if (Math.random() > 0.5 || options['headshot']) {
						entity.kill();
					} else {
						console.log('TODO: daze enemy');
					}
					return actions;
				}
				return;
			} else if (tile.blocksMove()) {
				this._source.modifyNumShots(-1);
				return actions;
			}
		}
		this._source.modifyNumShots(-1);
		return actions;
	}
};
