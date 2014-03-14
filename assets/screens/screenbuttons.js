Game.ScreenButtons = {};

Game.ScreenButtons.SelectButton = new Game.ScreenButton({	
	caption: 'Select',
	FGColor: 'white',
	BGColor: 'darkslateblue',
	buttonLength: 18,
	action: Game.ScreenButton.ButtonAccept
});

Game.ScreenButtons.NextTargetButton = new Game.ScreenButton({
	caption: 'Next',
	FGColor: 'white',
	BGColor: 'darkslateblue',
	buttonLength: 18,
	action: Game.ScreenButton.ButtonNextTarget
});

Game.ScreenButtons.CancelButton = new Game.ScreenButton({
	caption: 'Cancel',
	FGColor: 'white',
	BGColor: 'darkslateblue',
	buttonLength: 18,
	action: Game.ScreenButton.ButtonCancel
});

Game.ScreenButtons.SkillToggleButton = new Game.ScreenButton({
	caption: function() {
		return this.getSkill().getToggle()[0];
	},	
	isToggle: true,
	toggleCaption: function() {
		return this.getSkill().getToggle()[1];
	},
	action: Game.ScreenButton.ButtonToggle
});
