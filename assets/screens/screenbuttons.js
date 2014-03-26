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
		return 'Turn off';
		//return (this._screen.getSkill().isToggled()) ? 'Turn off' : 'Turn on';
	},	
	FGColor: 'white',
	BGColor: 'darkslateblue',  
	buttonLength: 18,
	action: Game.ScreenButton.ButtonToggle
};

Game.ScreenButtons.EmptyButton = {
	caption: '',
	FGColor: 'black',
	BGColor: 'black',
	buttonLength: 18
};