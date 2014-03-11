Game.PlayerActor = {
	character: '@',
    fgcolor: 'white',
    bgcolor: 'none',
	sightRadius: 4,
	properties: [Game.ActorProperties.PlayerActor, Game.ActorProperties.Sight, Game.ActorProperties.SkillUser],
	skills: [Game.Skills.Lunge,Game.Skills.Shoot]
};

//TODO: move this to actor database
//TODO: create actor properties

Game.ZombieActor = {
	name: 'zombie',
	character: 'z',
	fgcolor: 'red',
	bgcolor: 'none',
	properties: [Game.ActorProperties.ZombieActor, Game.ActorProperties.Sight]
};