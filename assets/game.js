var Game =  {
	_display: null,
	_screenWidth: 120,
    _screenHeight: 36,
    _currentScreen: null,

	init: function() {
        // create rot display object 
        this._display = new ROT.Display({width: this._screenWidth, height: this._screenHeight + 1});
        //send keyboard input to screens
        var game = this; 
        var sendEventsToScreen = function(event) {
            window.addEventListener(event, function(t) {
                if (game._currentScreen) {
                    game._currentScreen.handleInput(event, t);
                }
            });
        };
        sendEventsToScreen('keydown');
        sendEventsToScreen('keypress');
    },
	getDisplay: function() {
		return this._display;
	},
	getScreenWidth: function() {
    return this._screenWidth;
	},
	getScreenHeight: function() {
	    return this._screenHeight;
	},
	getCurrentScreen: function() {
		return this._currentScreen;
	},
    refreshScreen: function() {
        // clear the screen and re-render it
        this._display.clear();
        this._currentScreen.render(this._display);
    },
	changeScreen: function(screen) {
        this.getDisplay().clear();
        // enter and render passed screen
        this._currentScreen = screen;
        if (!this._currentScreen !== null) {
            this._currentScreen.enter();
            this.refreshScreen();
        }
    }
};

window.onload = function() {
        Game.init();
        document.body.appendChild(Game.getDisplay().getContainer());
        Game.changeScreen(Game.Screen.startScreen);
};    