Game.PlayerActor = {
	character: '@',
    fgcolor: 'white',
    bgcolor: 'none',
	sightRadius: 4,
	properties: [Game.ActorProperties.PlayerActor, Game.ActorProperties.SkillUser, 
				Game.ActorProperties.Attacker, Game.ActorProperties.Defender,
				Game.ActorProperties.Sight,  Game.ActorProperties.MakesNoise],
	skills: [Game.Skills.Lunge,Game.Skills.Shoot]
};

//TODO: move this to actor database
//TODO: create actor properties

Game.ZombieActor = {
	name: 'zombie',
	character: 'z',
	fgcolor: 'red',
	bgcolor: 'none',
	sightRadius:3,
	properties: [Game.ActorProperties.ZombieActor, 
				Game.ActorProperties.Attacker, Game.ActorProperties.Defender,
				Game.ActorProperties.Sight, Game.ActorProperties.ZombieHearing, Game.ActorProperties.MakesNoise]
};