Game.Skills = function(source,template) {
	this._source = source;
	this._name = template['name'];
	this._events = template['events'];
	this._screen = template['scr'];
	this.initPassive = template['initPassive'] || function() { return; };
	this.canUse = template['canUse'] || function() { return false; };
	this.use = template['use'] || function() { return false; };
	this.otherInfo = template['otherInfo'];			//TODO: skills have properties like actors e.g. range, aoe, target type
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
		_headshot: false,
		_targets: [],
		_currTarget: null,
	},
	scr: {
		buttonCaption1: 'Shoot',
		buttonCaption2: 'Regular (0)',
		buttonCaption3: 'Next',
		buttonCaption4: 'Cancel',
		label: 'Select a target.',
		accept: function() {
			var coords = this.getMapCoords(this._cursor.x, this._cursor.y); //TODO: account for level??					
			this._player.tryAction(this._player.useSkill,'Shoot',coords,{headshot:this._headshot}); 
		},
		buttonFunc1: function() {
			this.acceptTarget();
		},
		buttonFunc2: function() {
			if (this._headshot !== true) {  		//TODO: better way of doing this: link screen to skill
				this.buttonCaption2 = 'Headshot (1)';
				this._headshot = true;
			} else {
				this.buttonCaption2 = 'Regular (0)';
				this._headshot = false;
			}
			Game.refreshScreen();
		},
		buttonFunc3: function() {
			if (this._targets === undefined) {		//TODO: ewewew
				this._targets = this._player.getMap().getEntitiesInRadius(4,this._player.getLevel(),this._player.getX(),this._player.getY(),{
					includeCenter: false,
					closestFirst: true,
					visibleOnly: true});          //TODO; don't hardcode range here
			}
			if (this._target === undefined || this._targets.length - 1 <= this._target) {
				this._target = 0;
			} else {
				this._target ++;
			}
			if (this._targets[this._target] !== undefined) {
				this._cursor = this.getScreenCoords(this._targets[this._target].getX(), this._targets[this._target].getY());		//TODO: movecursorto function?
				Game.refreshScreen();
			}
		},
		buttonFunc4: function() {
			Game.Screen.gameScreen.setSubscreen(undefined);
		}
	},
	canUse: function() {
		return (this._source.getNumShots() > 0);
	},
	//TODO: move this to entity
	use: function(target, options) {
		options = options || {};
		//TODO: make this not instakill if can't see enemy
		//TODO: clean up for loop
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
						console.log('TODO: daze enemy')
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
