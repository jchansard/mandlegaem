Game.SkillEntities = {};

Game.SkillEntities.Flashlight = {
	character: 'none',
	fgcolor: 'none',
	bgcolor: 'none',
	sightRadius: 1,
	pc: true,
	properties: [Game.ActorProperties.Sight, {
		init: function() {
			this._initialOffsets = {};
			this.calcInitialOffsets = function() {
				this._initialOffsets = Game.Calc.calcOffsets(this._x, this._y, this._owner.getX(), this._owner.getY(),true);
			};
		},
		events: { 
			calculateFOV: function() {
				var newPos = {x: this._owner.getX() + this._initialOffsets.x, y: this._owner.getY() + this._initialOffsets.y};
				this.move(this._owner.getLevel(), newPos.x, newPos.y);
				var map = this.getMap();
				var player = map.getPlayer();
				var l = player.getLevel();
				var line = Game.Calc.getLine(player.getX(), player.getY(), this._x, this._y);
				var endOfTheLine = {};
				for (var i = 1; i < line.length; i++)
				{
					var actor = map.getActor(l, line[i].x, line[i].y);
					var tile = map.getTile(l, line[i].x, line[i].y);
					map.addVisibleTile(line[i].x, line[i].y);
					map.setTileExplored(true, l, line[i].x, line[i].y);
					if (actor) {
						if (actor !== this._source) {
							if (actor.hasProperty('ZombieActor')) {
							actor.wakeUp();
							}
						endOfTheLine = {x: line[i].x, y: line[i].y};
						break;
						}
					} else if (tile.blocksLight()) {
						endOfTheLine = {x: line[i].x, y: line[i].y};				
						break;
					}
				}
				if (endOfTheLine.x !== undefined && endOfTheLine.y !== undefined) {
					this.move(l, endOfTheLine.x, endOfTheLine.y);
				}
				map.getFOV(l).compute(this._x, this._y, this.getSightRadius(), map.computePlayerFOV.bind(map));			
			},
		}
	}]
};
