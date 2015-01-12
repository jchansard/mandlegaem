var Game =  {
	init: function() {
        // create display objects
        var screens = [];
    	screens['play'] = {	x: 0, y: 0,	width: 120,	height: 38 };
    	screens['info'] = {	x: 120,	y: 0, width: 40, height: 38 };
    	screens['info_flashlight'] = {x : 122, y: 1, width: 38, height: 1};
    	screens['action'] = { x: 0,	y: 38, width: 160, height: 12 };
    	screens['full'] = {	x: 0, y: 0,	width: 160,	height: 50 };
    	
        this.display = new Game.Display({width: 160, height: 50}, screens);
        this.display.drawTools.init();
        $('#game').append(this.display.getDisplay().getContainer());
        this.display.changeScreen(Game.Screen.startScreen);

        /*
        this.playScreen = new Game.Display({width: 120, height: 38});
        this.infoScreen = new Game.Display({width: 40, height: 38});
        this.actionScreen = new Game.Display({width: 160, height: 12});
        this.fullScreen = new Game.Display({width: 160, height: 50});
        */
    },
};

$(document).ready(function() {
	
        Game.init();     

        /*$('#play').append(Game.playScreen.getDisplay().getContainer());
        $('#info').append(Game.infoScreen.getDisplay().getContainer());
        $('#action').append(Game.actionScreen.getDisplay().getContainer());
		$('#fullscreen').append(Game.fullScreen.getDisplay().getContainer());*/
});    