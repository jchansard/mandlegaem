Game.ActorProperties = {};

Game.ActorProperties.PlayerActor = {
	name: 'PlayerActor',
	group: 'Actor',
	act: function() {
			Game.refreshScreen();
			this.getMap().getEngine().lock();
	}
};