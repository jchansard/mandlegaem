Game.PlayerActor = {
	character: '@',
    fgcolor: 'white',
    bgcolor: 'black',
	sightRadius: 4,
	properties: [Game.ActorProperties.PlayerActor, Game.ActorProperties.Sight],
	skills: [Game.Skills.Lunge,Game.Skills.Shoot]
};

//TODO: move this to actor database
//TODO: create actor properties

Game.ZombieActor = {
	name: 'zombie',
	character: 'z',
	fgcolor: 'red',
	bgcolor: '#222',
	properties: [Game.ActorProperties.ZombieActor, Game.ActorProperties.Sight]
};