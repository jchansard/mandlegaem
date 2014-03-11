Game.Map.Forest = function(numLevels,width,height, player) {
	Game.Map.call(this,numLevels,width,height,player);
	this.addEntityAtRandomPosition(player, 0);
	//fordebugging this.addEntity(player, 0, 3, 3);
	//fordebugging this.addEntity(new Game.Entity(Game.ZombieActor),0,2,2);
	for (var i = 0; i < 1000; i++) {
		this.addEntityAtRandomPosition(new Game.Entity(Game.ZombieActor),0);
	}
};
Game.Map.Forest.extend(Game.Map);
