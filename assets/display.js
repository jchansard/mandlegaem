Game.Display = function(properties, screens) {
	properties = properties || {};
	this._height = properties.height;
	this._width = properties.width;
	this._screen = properties.screen; // TODO: HMMMMMMM
	this._screens = screens;
	this._display = new ROT.Display({height: this._height, width: this._width, fontSize: 24, fontFamily: 'inconsolata'});
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

// can draw to canvas if scr.id != undefined

Game.Display.prototype.draw = function(scr, drawInfo) {//x, y, toDraw, fg, bg) {
	if (scr != null && !this._screens[scr]) 
	{
		console.error('no such screen: ' + scr);
		return;
	}
	scr = this._screens[scr];
	drawInfo.x = drawInfo.x || 0;
	drawInfo.y = drawInfo.y || 0; 
	drawInfo.x += scr.x;
	drawInfo.y += scr.y;
	if ((drawInfo.x > scr.x + scr.width) || (drawInfo.y > scr. y + scr.height)) {
		console.error('drawing out of designated area: ' + x + ',' + y);
		return;
	}
	if (!scr.canvasID)
	{		
		this._display.draw(drawInfo.x, drawInfo.y, drawInfo.ch, drawInfo.fg, drawInfo.bg);
	} else {
		this.drawToCanvas(scr.canvasID, drawInfo);
	}
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

Game.Display.prototype.drawToCanvas = function(id, drawInfo) {
	var mult = Game.CANVASTILESIZE || 12;
	var x = drawInfo.x || 0; 
	var y = drawInfo.y || 0;
	drawInfo.type = drawInfo.type || 'image';
	x *= mult;
	y *= mult;
	var canvas = $(id).get(0).getContext('2d');

	switch(drawInfo.type) {
		case 'image':
			var img = new Image();
			img.src = drawInfo.src; //TODO: preload!!!!!!!!
			img.addEventListener("load", function() {
				canvas.drawImage(img, x, y);
			});
			break;
		case 'text':
			y += mult; // for text, x,y = bottom left, apparently (for images it's top left?) this way, coordinates are consistent
			canvas.font = drawInfo.font || "12px inconsolata";
			canvas.fillStyle = drawInfo.color || "white";
  			canvas.fillText(drawInfo.text, x, y);
  			/*var x = 2;
  			var timer = setInterval(function() {
  				canvas.fillStyle = 'rgb(217,0,217)';
  				canvas.fillRect(35, 107, x, 14);
  				x += 2;
  				if (x==160) {
  					console.log(x);
  					clearInterval(timer);
  				}
  			}, 50);*/
  			break;
  		default:
  			console.err("invalid type passed to canvas: " + drawInfo.type);
  	}
};			

Game.Display.prototype.updatePanic = function(curr, delta) {
	var canvas = $('#gameinfo').get(0).getContext('2d');
	if (curr + delta === 79) { 
		canvas.fillStyle = 'rgb(217, 0, 38)';
		canvas.fillRect(35, 107, 158, 14);
		return; 
	}
	else if (delta > 0) { canvas.fillStyle = 'rgb(217, 0, 217)'; } 
	else { canvas.fillStyle = 'rgb(0, 0, 0)'; }
  	canvas.fillRect(35 + (curr * 2), 107, (delta * 2), 14);
};
