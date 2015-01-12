Game.PlayerActor = {
	character: '@',
    fgcolor: 'white',
    bgcolor: 'none',
	sightRadius: 3,
	pc: true,
	properties: [Game.ActorProperties.PlayerActor, Game.ActorProperties.SkillUser, Game.ActorProperties.Lunger,
				Game.ActorProperties.Attacker, Game.ActorProperties.Defender,
				Game.ActorProperties.Sight,  Game.ActorProperties.MakesNoise],
	skills: [Game.Skill.QuickShot,Game.Skill.HeadShot,Game.Skill.Shove,Game.Skill.Flashlight]
};

//TODO: move this to actor database
//TODO: create actor properties

Game.ZombieActor = {
	name: 'zombie',
	character: '☻',
	fgcolor: 'red',
	bgcolor: 'none',
	sightRadius:2,
	properties: [Game.ActorProperties.ZombieActor, 
				Game.ActorProperties.Attacker, Game.ActorProperties.Defender,
				Game.ActorProperties.Sight, Game.ActorProperties.ZombieHearing, Game.ActorProperties.MakesNoise]
};