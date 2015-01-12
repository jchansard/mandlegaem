Game.Display = function(properties, screens) {
	properties = properties || {};
	this._height = properties.height;
	this._width = properties.width;
	this._screen = properties.screen; // TODO: HMMMMMMM
	this._screens = screens;
	this._display = new ROT.Display({width: this._width, height: this._height, fontSize: 16});
	var d = this; 
    var sendEventsToScreen = function(event) {
        window.addEventListener(event, function(t) {
            if (d._screen) {
                d._screen.handleInput(event, t);
            }
        });
    };
    sendEventsToScreen('keydown');
    sendEventsToScreen('keypress');
};

Game.Display.prototype.getDisplay = function() {
	return this._display;
};

Game.Display.prototype.getScreenWidth = function(scr) {
    scr = scr || 'full';
    return this._screens[scr].width;
};

Game.Display.prototype.getScreenHeight = function(scr) {
	scr = scr || 'full';
	return this._screens[scr].height;
};

Game.Display.prototype.getCurrentScreen = function() {
	return this._screen;
};

Game.Display.prototype.refreshScreen = function() {
    // clear the screen and re-render it
    this._display.clear();
    this._screen.render(this);
};

Game.Display.prototype.changeScreen = function(screen) {
    this.getDisplay().clear();
    if (this._screen && this._screen.exit) {
    	this._screen.exit();
    }
    // enter and render passed screen
    this._screen = screen;
    if (!this._screen !== null) {
        this._screen.enter();
        this.refreshScreen();
    }
};
    
Game.Display.prototype.draw = function(scr, x, y, ch, fg, bg) {
	if (scr != null && !this._screens[scr]) //TODO: doesn't work'
	{
		console.error('no such screen: ' + scr);
		return;
	}
	scr = this._screens[scr];
	x += scr.x;
	y += scr.y;
	if ((x > scr.x + scr.width) || (y > scr. y + scr.height)) {
		console.error('drawing out of designated area: ' + x + ',' + y);
		return;
	}		
	this._display.draw(x, y, ch, fg, bg);
};

Game.Display.prototype.drawText = function(scr, x, y, text, maxWidth) {
	if (scr != null && !this._screens[scr]) //TODO: doesn't work
	{
		console.error('no such screen: ' + scr);
		return;
	}
	scr = this._screens[scr];
	x += scr.x;
	y += scr.y;
	if ((x > scr.x + scr.width) || (y > scr.y + scr.height)) {
		console.error('drawing out of designated area');
		return;
	}		
	this._display.drawText(x, y, text, maxWidth);
};

Game.Display.prototype.drawASCII = function(scr, x, y, template) {
	if (scr != null && !this._screens[scr]) //TODO: doesn't work
	{
		console.error('no such screen: ' + scr);
		return;
	}
	//var area = scr; 
	//scr = this._screens[scr];
	var arr = this.drawTools.templates[template];
	var disp = this;
	arr.forEach(function(val) {
		disp.draw(scr, x + val.x, y + val.y, val.ch, val.fg, val.bg);
	});
};

