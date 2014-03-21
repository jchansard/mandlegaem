Game.Skill = function(source,template) {        //TODO: not skills
	this._source = source;
	this._name = template['name'];
	this._events = template['events'];
	this._screen = template['scr'];
	this._cooldown = template['cooldown'] || 0;
	this._cooldownTimer = template['cooldownTimer'] || 0;
	this._aimType = template['aimType'] || 'none';
	this.initPassive = template['initPassive'] || function() { return; };
	this.canUse = template['canUse'] || function() { return false; };
	this.use = template['use'] || function() { return false; };

	this._otherInfo = template['otherInfo'];			//TODO: skills have properties like actors e.g. range, aoe, target type
	this._toggle = template['toggle'];					//TODO: merge this with above
	//TODO: cooldown
};  

Game.Skill.prototype.getSource = function() {
	return this._source;
};
Game.Skill.prototype.getName = function() {
	return this._name;
};
Game.Skill.prototype.getEvents = function() {
	return this._events;
};
Game.Skill.prototype.getScreen = function() {
	return this._screen;
};
Game.Skill.prototype.getOtherInfo = function(key) {		//TODO: don't like "other info"
	if (key) {
		return this._otherInfo[key];
	} else {
		return this._otherInfo;
	}
};
Game.Skill.prototype.getCooldown = function() {
	return this._cooldown;
};
Game.Skill.prototype.getCooldownTimer = function() {
	return this._cooldownTimer;
};
Game.Skill.prototype.decCooldownTimer = function() {
	this._cooldownTimer--;
};
Game.Skill.prototype.resetCooldownTimer = function() {
	this._cooldownTimer = this._cooldown + 1; //TODO: fix????? or is this ok
};
Game.Skill.prototype.getToggle = function() {
	return this._toggle;
};
Game.Skill.prototype.getAimType = function() {
	return this._aimType;
};
Game.Skill.prototype.setOtherInfo = function(key,value) {
	this._otherInfo[key] = value;
};


Game.Skill.Lunge = {
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

Game.Skill.QuickShot = {
	name: 'Quick Shot',
	source: 'skill',
	aimType: 'target',
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
	scr: {
		label: 'Select a target.',
		accept: function() {
			var coords = this.getMapCoords(this._cursor.x, this._cursor.y); 
			coords.l = this._player.getLevel();					
			this._player.tryAction(this._player.useSkill,'Quick Shot',coords);  //TODO: better way to get name
		},
	},
	canUse: function() {
		return (this._source.getNumShots() > 0);
	},
	use: function(target, options) {
		if (this._source.getX() === target.x && this._source.getY() === target.y) {			
			return -1;
		}
		if (this._source.hasProperty('MakesNoise')) {
			this._source.makeNoise(6);				//TODO: don't hardcode
		}
		options = options || {};
		//TODO: make this not instakill if can't see enemy
		var l = this._source.getLevel(), x = this._source.getX(), y = this._source.getY();
		var line = Game.Calc.getLine(x, y, target.x, target.y, 5);		
		for (var i = 1; i < line.length; i++)
		{
			var entity = this._source.getMap().getEntities().get(l, line[i].x, line[i].y);
			var tile = this._source.getMap().getTile(l, line[i].x, line[i].y);
			var actions = 0;
			if (entity) {
				if (entity !== this._source) {
					this._source.modifyNumShots(-1);
					if (Math.random() > 0.5) { 
						entity.kill();
					} else {
						entity.stun(1);
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

Game.Skill.HeadShot = {
	name: 'Head Shot',
	source: 'skill',
	aimType: 'target',
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
	scr: {
		label: 'Select a target.',
		accept: function() {
			var coords = this.getMapCoords(this._cursor.x, this._cursor.y); 
			coords.l = this._player.getLevel();					
			this._player.tryAction(this._player.useSkill,'Head Shot',coords);  //TODO: better way to get name
		},
	},
	canUse: function() {
		return (this._source.getNumShots() > 0);
	},
	use: function(target, options) {
		if (this._source.getX() === target.x && this._source.getY() === target.y) {			
			return -1;
		}
		if (this._source.hasProperty('MakesNoise')) {
			this._source.makeNoise(6);				//TODO: don't hardcode
		}
		options = options || {};
		//TODO: make this not instakill if can't see enemy
		var l = this._source.getLevel(), x = this._source.getX(), y = this._source.getY();
		var line = Game.Calc.getLine(x, y, target.x, target.y, 5);		
		for (var i = 1; i < line.length; i++)
		{
			var entity = this._source.getMap().getEntities().get(l, line[i].x, line[i].y);
			var tile = this._source.getMap().getTile(l, line[i].x, line[i].y);
			var actions = 1;
			if (entity) {
				if (entity !== this._source) {
					this._source.modifyNumShots(-1);
					entity.kill();
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

Game.Skill.Shove = {
	name: 'Shove',
	source: 'skill',
	aimType: 'direction',
	cooldown: 3,
	scr: {
		label: 'Select a direction to shove.',
		accept: function(dx,dy) {				
			this._player.tryAction(this._player.useSkill,'Shove',dx,dy);  
		},
	},
	canUse: function() {
		return (this.getCooldownTimer() <= 0);
	},
	use: function(dx, dy) {
		var pos = this._source.getPosition();
		var target = this._source.getMap().getEntity(pos.l, pos.x + dx, pos.y + dy);
		if (target) {
			target.knockback(dx,dy,1);
			target.stun(1);
			var targetNewPos = target.getPosition();
			var nearbyEnemies = this._source.getMap().getEntitiesInRadius(1, targetNewPos.l, targetNewPos.x, targetNewPos.y, {includeCenter:false, closestFirst:true});
			for (var i = 0; i < nearbyEnemies.length; i++) {
				if (nearbyEnemies[i] !== this._source && nearbyEnemies[i].hasProperty('Defender')) {
					nearbyEnemies[i].stun(1);
				}
			}
			this.resetCooldownTimer();
			return 1;
		} else { return -1; }
	}
};
