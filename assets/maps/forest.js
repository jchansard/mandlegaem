Game.Map.Forest = function(numLevels,width,height, player) {
	Game.Map.call(this,numLevels,width,height,player);
	this.addEntityAtRandomPosition(player, 0);
	for (var i = 0; i < 600; i++) {
		this.addEntityAtRandomPosition(new Game.Entity(Game.ZombieActor),0);
	}
};
Game.Map.Forest.extend(Game.Map);
