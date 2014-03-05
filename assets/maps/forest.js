Game.Map.Forest = function(numLevels,width,height, player) {
	Game.Map.call(this,numLevels,width,height,player);
	this.addEntityAtRandomPosition(player, 0);
};
Game.Map.Forest.extend(Game.Map);
