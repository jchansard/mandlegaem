Game.PlayerActor = {
	character: '@',
    fgcolor: 'white',
    bgcolor: 'black',
	properties: [Game.ActorProperties.PlayerActor]
};

//TODO: move this to actor database
//TODO: create actor properties

Game.ZombieActor = {
	character: 'z',
	fgcolor: 'red',
	//bgcolor: 'black',
	properties: [{
		name: 'ZombieActor',
		group: 'Actor',
		act: function() {
			//console.log('braaains');
			return;
		}
	}]
};