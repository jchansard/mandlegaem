Game.ActorProperties = {};

Game.ActorProperties.PlayerActor = {
	name: 'PlayerActor',
	group: 'Actor',
	act: function() {
		Game.refreshScreen();
		this.getMap().getEngine().lock();
		this._numActions = 3;
		this.getMap().updateScheduler();
	},
	init: function() {
		this._numActions = 3;
	},
	getNumActions: function() {
		return this._numActions;
	},
	decreaseNumActions: function(n) {
		this._numActions -= n;
		//Game.refreshScreen();
	},
	tryAction: function(func) {
		var args = Array.prototype.slice.call(arguments,1);
		var actions = func.apply(this,args);
		if (actions > -1) {
			this.decreaseNumActions(actions);
			this.decreaseSkillCooldowns(1);
			this.decreaseAmmoForConstantSkills(1);
			Game.refreshScreen();
			if (this.getNumActions() <= 0) { //TODO: this should be better......??????
				this.getMap().getEngine().unlock();
			}
			return true;
		}
		else {
			return false;
		}
	}
};

Game.ActorProperties.ZombieActor = {
	name: 'ZombieActor',
	group: 'Actor',
	init: function(template) {
		this._priorities = ['wakeUp','chase','becomeDormant','doNothing'];
		this._turnsInactive = 0;
		this._goalInUndeath = false;
	},
	act: function() {
		if (this.hasProperty('Defender')) {
			if (this._debuffs['stunned'] > 0) {
				this._debuffs['stunned']--;
				return;
			}
		}
		for (var i = 0; i < this._priorities.length; i++) {
			if (this.canDo(this._priorities[i])) {
				this[this._priorities[i]]();
				return;
			}
		}
	},
	isAwake: function() {
		if (this._goalInUndeath) {
			return true;
		} else {
			return false;
		}
	},
	canDo: function(action) {
		switch(action) {
			case 'wakeUp':
				if (this._goalInUndeath !== false) { 
					return false; 
				} else if (this.canSee(this.getMap().getPlayer()) || this._lastSoundHeard !== undefined) {
					return true;
				}
				return false;
				break;
			case 'chase':
				if (this._goalInUndeath !== false) {
					console.log('chasin');
					return true;
				} else {
					return false;
				}
				break;
			case 'becomeDormant':
				if (this._turnsInactive >= 10) {
					return true;
				} else { 
					return false;
				}
				break;
			case 'doNothing':
				return true;
				break;
			}
	},
	wakeUp: function() {
		console.log(this.getName() + ' has noticed you');
		var map = this.getMap();
		var player = map.getPlayer(), pcentities = map.getPCEntities();
		if (this.canSee(player)) {
			this._goalInUndeath = player.getPosition();
		} else if (pcentities.length > 0) {
			for (var i = 0; i < pcentities.length; i++) {
				if (this.canSee(pcentities[i])) {
					this._goalInUndeath = pcentities[i].getPosition();
				}
			}
		} else 	{
			this._goalInUndeath = this._lastSoundHeard;
		}
		this.setBGColor('gold');
	},
	chase: function() {
		if (this.getBGColor() !== 'gold') {
			this.setBGColor('gold');
		}
		var player = this.getMap().getPlayer();
		if (this.canSee(player)) {
			this._goalInUndeath = player.getPosition();
		} else if (this._goalInUndeath.l === this.getLevel() && this._goalInUndeath.x === this.getX() && this._goalInUndeath.y === this.getY()) {
			this._goalInUndeath = false;
			return;
		}
		if (this.getMap().getDistanceBetween(this._x, this._y, player.getX(), player.getY()) === 1) {
			player.kill();
			Game.refreshScreen();
			console.log('you died!');
		} else {
			var me = this, meL = this.getLevel(), meX = this.getX(); meY = this.getY(); 
			var path = new ROT.Path.AStar(this._goalInUndeath.x, this._goalInUndeath.y, function(x,y) {
				var entity = me.getMap().getActor(meL, x, y);
				//i guess it checks the tile it's on to start?
				if (entity && entity !== me) {
					return false;
				} else {
					return !(me.getMap().getTile(meL, x, y).blocksAI());
				}
			});
			path.compute(meX, meY, function(x, y) {
				if (me.getMap().getDistanceBetween(meX, meY, x, y) === 1) {
					me.move(meL, x, y); //TODO: this is probably gonna be buggy?? i don't like calling move directly but trymove takes dx, dy, dl for some reason
				}
			});
		}
	},
	becomeDormant: function() {
		console.log(this.getName() + ' seems to have forgotten about you');
		this._turnsInactive = 0;
		this.setBGColor('green'); //TODO: this aint workin
		this.getMap().getScheduler().remove(this);		
	},
	doNothing: function() {
		this._turnsInactive++;
	}
	
};

Game.ActorProperties.Sight = {
	name: 'Sight',
	group: 'Sight',
	init: function(properties) {
		this._sightRadius = properties['sightRadius'] || 4;
		this.getSightRadius = function() {
			var tile = this.getMap().getTile(this._l, this._x, this._y);
			var modifiedRadius = Math.floor(tile.getSightModifier() * this._sightRadius);
			return modifiedRadius;
		};
	},
	canSee: function(entity) {
		var l = this.getLevel();
		//break early if they're not on the same level
		if (l !== entity.getLevel() || this.getMap() !== entity.getMap()) {
			return false;
		}
		var x2 = entity.getX();
		var y2 = entity.getY();
		
		//break early if they're not even close to each other
		var nearbyActors = this.getMap().getActorsInRadius(this.getSightRadius(),l,this._x,this._y,{includeCenter: false});
		if (nearbyActors.indexOf(entity) < 0) {
			return false;
		}
		
		var canSee = false;
		var fov = this.getMap().getFOV(l);
		fov.compute(this._x,this._y,this.getSightRadius(), function(x, y, r, visibility) {
			if (x === x2 && y === y2 && visibility > 0) {
				canSee = true;
			} 
		});
		return canSee;
	}
};
//TODO: move skills stuff here
Game.ActorProperties.SkillUser = {
	name: 'SkillUser',
	group: 'SkillUser',
	init: function(properties) {
		this._lastTarget = null; 
		this._skills = properties['skills'];
		this._learnStartingSkills();
		this._applySkillPassives();	
	},
	getSkills: function() {
		return this._skills;
	},
	useSkill: function(skill) {
		var args = Array.prototype.slice.call(arguments,1);
		var actions = -1;
		if (typeof skill === 'string') {
			for (var i = 0; i < this._skills.length; i++) {
				if (skill === this._skills[i].getName()) {
					skill = this._skills[i];
					break;
				}
			}
		}
		if (skill.canUse.apply(skill,args)) {
			actions = skill.use.apply(skill,args);
		}
		return actions;
	},
	_learnStartingSkills: function() {
		for (var i = 0; i < this._skills.length; i++) {
			this._skills[i] = new Game.Skill(this, this._skills[i]);
		}
	},
	_applySkillPassives: function() {
		for (var i = 0; i < this._skills.length; i++) {
			this._skills[i].initPassive(this);
			var events = this._skills[i].getEvents();
			if (events !== undefined) {
				for (var key in events) {	
					if (this._events[key] === undefined) {
						this._events[key] = [];
					}
					this._events[key].push(events[key]);
				}
			}
		}
	},
	decreaseSkillCooldowns: function(num) {
		num = num || 1;
		for (var i = 0; i < this._skills.length; i++) {
			if (this._skills[i].getCooldown() !== undefined && this._skills[i].getCooldown() > 0) {
				this._skills[i].decCooldownTimer(num);
			}
		}
	},
	decreaseAmmoForConstantSkills: function(num) {
		num = num || 1;
		for (var i = 0; i < this._skills.length; i++) {
			if (this._skills[i].hasProperty('HasAmmo') && this._skills[i].hasProperty('Toggleable')) {
				if (this._skills[i].isToggled()) {
					this._skills[i].modifyAmmo(-num);
					if (this._skills[i].getAmmo() <= 0) {
						this._skills[i].toggle();
					}
				}
			}
		}
	}
};

Game.ActorProperties.ZombieHearing = {
	name: 'ZombieHearing',
	group: 'Hearing',
	init: function(properties) {
		this._lastSoundHeard =  undefined;
	},
	events: {
		hearNoise: function(l,x,y) {
			this._lastSoundHeard = {l:l, x:x, y:y};
			if (!this.isAwake() && this._debuffs['stunned'] === 0) {
				this.wakeUp();
			}
		}	
	},
};

Game.ActorProperties.MakesNoise = {
	name: 'MakesNoise',
	makeNoise: function(radius) {
			var entities = this.getMap().getActorsInRadius(radius, this._l, this._x, this._y, {includeCenter: false, closestFirst: true, visibleOnly: false});
			for (var i = 0; i < entities.length; i++) {
				entities[i].reactToEvent('hearNoise', this._l, this._x, this._y);
			}	
	}
};

Game.ActorProperties.Defender = {
	name: 'Defender',
	group: 'Attacker',
	init: function(properties) {
		this._hp = properties['hp'] || 1;
		this._debuffs = {stunned: 0}; 
	},
	getHP: function() {
		return this._hp;
	},
	getDebuffs: function(debuff) {
		if (debuff !== undefined) {
			return this._debuffs[debuff];
		} else {
		return this._debuffs;
		}
	},	
	takeDamage: function(damage) {
		this._hp -= damage;
		if (this._hp <= 0) {
			this.kill();
		}
	},
	stun: function(duration) {
		duration = duration || 1;
		if (this._debuffs['stunned'] === undefined) {
			this._debuffs['stunned'] = 0;
		}
		this._debuffs['stunned'] += duration;
		this.setBGColor('mediumpurple');
	},
};

Game.ActorProperties.Attacker = {
	name: 'Attacker',
	group: 'Attacker',
	init: function(properties) {
		this._atk = properties['atk'] || 1;
	},
	attack: function(target) {
		if (target.hasProperty('Defender')) {
			target.takeDamage(this._atk);
		}
	},
	getAttack: function() {
		return this._atk;
	}
};


Game.ActorProperties.Lunger = {
	name: 'lunge',
	//source: 'skill',
	init: function() {
		this._lungeableTargets = null;
		this.clearLungeableTargets = function() {
			this._lungeableTargets = [];
		};
		this._getLungeableTargets = function() {
		//restricting targets to enemies within sight radius so that you can't lunge things you didn't see the previous turn.
			var radius = this.getSightRadius(); 
			var entitiesInSight = this.getMap().getActorsInRadius(radius,this._l,this._x,this._y, {includeCenter:false});
			for (var i = 0; i < entitiesInSight.length; i++) {
				if (this.canSee(entitiesInSight[i]));
				this._lungeableTargets.push(entitiesInSight[i]);
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
			var target = this.getMap().getActor(pos.l + dl, pos.x + dx, pos.y + dy);
			if (target !== undefined && this._lungeableTargets.indexOf(target) > -1) {
				console.log('you lunge at the '+target.getName() + '!');
				target.kill();
			}
			this.clearLungeableTargets();
			this._getLungeableTargets();
		}
	},
};

