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
		for (var i = 0; i < this._priorities.length; i++) {
			if (this.canDo(this._priorities[i])) {
				this[this._priorities[i]]();
				return;
			}
		}
	},
	canDo: function(action) {
		switch(action) {
			case 'wakeUp':
				if (this._goalInUndeath !== false) { 
					return false; 
				} else if (this.canSee(this.getMap().getPlayer())) {
					return true;
				}
				break;
			case 'chase':
				if (this._goalInUndeath !== false) {
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
		this._goalInUndeath = this.getMap().getPlayer().getPosition();
	},
	chase: function() {
		var player = this.getMap().getPlayer();
		if (this.canSee(player)) {
			this._goalInUndeath = player.getPosition();
		}
		if (this.getMap().getDistanceBetween(this._x, this._y, player.getX(), player.getY()) === 1) {
			player.kill();
			Game.refreshScreen();
			console.log('you died!');
		} else {
			var me = this, meL = this.getLevel(), meX = this.getX(); meY = this.getY(); 
			var path = new ROT.Path.AStar(this._goalInUndeath.x, this._goalInUndeath.y, function(x,y) {
				var entity = me.getMap().getEntity(meL, x, y);
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
		var nearbyEntities = this.getMap().getEntitiesInRadius(this.getSightRadius(),l,this._x,this._y,false);
		if (nearbyEntities.indexOf(entity) < 0) {
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