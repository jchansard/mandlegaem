Game.Map.Forest = function(numLevels,width,height, player) {
	Game.Map.call(this,numLevels,400,height,player);
	this.addEntity(player,0,this._startingPoints[0].x, this._startingPoints[0].y);
	//fordebugging this.addEntity(player, 0, 3, 3);
	//fordebugging this.addEntity(new Game.Entity(Game.ZombieActor),0,2,2);
	for (var i = 0; i < 1000; i++) {
		this.addEntityAtRandomPosition(new Game.Entity(Game.ZombieActor),0);
	}
};
Game.Map.Forest.extend(Game.Map);
