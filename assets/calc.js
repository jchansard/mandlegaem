//random number b/w x and y (inclusive)

Game.randRange = function(x,y) {
	return Math.floor(Math.random()*(y-x+1)) + x;
};

