Game.Display.prototype.drawTools = {
	// reads .xp file; only supports 1 layer for now
	// TODO: make smarter
	init: function() {
		
		// CP437 mapping
		CP437 = [
	    '\u0000', '\u0001', '\u0002', '\u0003', '\u0004', '\u0005',
	    '\u0006', '\u0007', '\u0008', '\u0009', '\u000A', '\u000B',
	    '\u000C', '\u000D', '\u000E', '\u000F', '\u0010', '\u0011',
	    '\u0012', '\u0013', '\u0014', '\u0015', '\u0016', '\u0017',
	    '\u0018', '\u0019', '\u001A', '\u001B', '\u001C', '\u001D',
	    '\u001E', '\u001F', '\u0020', '\u0021', '\u0022', '\u0023',
	    '\u0024', '\u0025', '\u0026', '\u0027', '\u0028', '\u0029',
	    '\u002A', '\u002B', '\u002C', '\u002D', '\u002E', '\u002F',
	    '\u0030', '\u0031', '\u0032', '\u0033', '\u0034', '\u0035',
	    '\u0036', '\u0037', '\u0038', '\u0039', '\u003A', '\u003B',
	    '\u003C', '\u003D', '\u003E', '\u003F', '\u0040', '\u0041',
	    '\u0042', '\u0043', '\u0044', '\u0045', '\u0046', '\u0047',
	    '\u0048', '\u0049', '\u004A', '\u004B', '\u004C', '\u004D',
	    '\u004E', '\u004F', '\u0050', '\u0051', '\u0052', '\u0053',
	    '\u0054', '\u0055', '\u0056', '\u0057', '\u0058', '\u0059',
	    '\u005A', '\u005B', '\u005C', '\u005D', '\u005E', '\u005F',
	    '\u0060', '\u0061', '\u0062', '\u0063', '\u0064', '\u0065',
	    '\u0066', '\u0067', '\u0068', '\u0069', '\u006A', '\u006B',
	    '\u006C', '\u006D', '\u006E', '\u006F', '\u0070', '\u0071',
	    '\u0072', '\u0073', '\u0074', '\u0075', '\u0076', '\u0077',
	    '\u0078', '\u0079', '\u007A', '\u007B', '\u007C', '\u007D',
	    '\u007E', '\u007F', '\u00C7', '\u00FC', '\u00E9', '\u00E2',
	    '\u00E4', '\u00E0', '\u00E5', '\u00E7', '\u00EA', '\u00EB',
	    '\u00E8', '\u00EF', '\u00EE', '\u00EC', '\u00C4', '\u00C5',
	    '\u00C9', '\u00E6', '\u00C6', '\u00F4', '\u00F6', '\u00F2',
	    '\u00FB', '\u00F9', '\u00FF', '\u00D6', '\u00DC', '\u00A2',
	    '\u00A3', '\u00A5', '\u20A7', '\u0192', '\u00E1', '\u00ED',
	    '\u00F3', '\u00FA', '\u00F1', '\u00D1', '\u00AA', '\u00BA',
	    '\u00BF', '\u2310', '\u00AC', '\u00BD', '\u00BC', '\u00A1',
	    '\u00AB', '\u00BB', '\u2591', '\u2592', '\u2593', '\u2502',
	    '\u2524', '\u2561', '\u2562', '\u2556', '\u2555', '\u2563',
	    '\u2551', '\u2557', '\u255D', '\u255C', '\u255B', '\u2510',
	    '\u2514', '\u2534', '\u252C', '\u251C', '\u2500', '\u253C',
	    '\u255E', '\u255F', '\u255A', '\u2554', '\u2569', '\u2566',
	    '\u2560', '\u2550', '\u256C', '\u2567', '\u2568', '\u2564',
	    '\u2565', '\u2559', '\u2558', '\u2552', '\u2553', '\u256B',
	    '\u256A', '\u2518', '\u250C', '\u2588', '\u2584', '\u258C',
	    '\u2590', '\u2580', '\u03B1', '\u00DF', '\u0393', '\u03C0',
	    '\u03A3', '\u03C3', '\u00B5', '\u03C4', '\u03A6', '\u0398',
	    '\u03A9', '\u03B4', '\u221E', '\u03C6', '\u03B5', '\u2229',
	    '\u2261', '\u00B1', '\u2265', '\u2264', '\u2320', '\u2321',
	    '\u00F7', '\u2248', '\u00B0', '\u2219', '\u00B7', '\u221A',
	    '\u207F', '\u00B2', '\u25A0', '\u00A0'
	    ];
	    // init templates and template constants
		this.templates = [];
		Game.FLASHLIGHT = 0;
		Game.AMMO = 1;
		Game.INFO = 2;
		
		// add templates from files
		this._getASCIIFromTextFile('assets/ascii/flashlight.xp', this.templates, Game.FLASHLIGHT);
		this._getASCIIFromTextFile('assets/ascii/ammunition.xp', this.templates, Game.AMMO);
		this._getASCIIFromTextFile('assets/ascii/info.xp', this.templates, Game.INFO); //TODO: Wait for this to load before continuing
	},
	_getASCIIArray: function(bf) {
		//var bf = this._getASCIIFromTextFile(file); // binary file
		var ascii = [];
		var width = bf[8];
		var height = bf[12];
		var offset = 16;
		for (var i = 0; offset < bf.length; i++)
		{
			ascii[i] = {};
			ascii[i].ch = CP437[bf[offset]];
			ascii[i].fg = 'rgb(' + bf[offset+=4] + ',' + bf[++offset] + ',' + bf[++offset] + ')';
			ascii[i].bg = 'rgb(' + bf[++offset] + ',' + bf[++offset] + ',' + bf[++offset] + ')';
			ascii[i].x = Math.floor(i/height);
			ascii[i].y = Math.floor(i%height);
			offset++;
		}
		return ascii;
		
	},
	_getASCIIFromTextFile: function(file, templates, index)
	{
	    var rawFile = new XMLHttpRequest();
	    var bf; // binary file
	    var draw = this;
	    rawFile.open('GET', file, true);  
	    rawFile.responseType = 'arraybuffer';
	    rawFile.onload = function (response)
	    {
	      	bf = pako.inflate(new Uint8Array(rawFile.response));
	      	draw.templates[index] = draw._getASCIIArray(bf);
	    };
    	rawFile.send();
    }
};
