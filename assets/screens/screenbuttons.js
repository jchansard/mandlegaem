Game.ScreenButtons = {};

Game.ScreenButtons.SelectButton = {	
	caption: 'Select',
	FGColor: 'white',
	BGColor: 'darkslateblue',
	buttonLength: 18,
	action: Game.ScreenButton.ButtonAccept
};

Game.ScreenButtons.NextTargetButton = {
	caption: 'Next',
	FGColor: 'white',
	BGColor: 'darkslateblue',
	buttonLength: 18,
	action: Game.ScreenButton.ButtonNextTarget
};

Game.ScreenButtons.CancelButton = {
	caption: 'Cancel',
	FGColor: 'white',
	BGColor: 'darkslateblue',
	buttonLength: 18,
	action: Game.ScreenButton.ButtonCancel
};

Game.ScreenButtons.SkillToggleButton = {
	caption: function() {
		return this._screen.getSkill().getToggle()[0];
	},	
	isToggle: true,
	toggleCaption: function() {
		return this._screen.getSkill().getToggle()[1];
	},
	action: Game.ScreenButton.ButtonToggle
};
