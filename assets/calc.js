Game.Calc = {
	//random number b/w x and y (inclusive)
	randRange: function(x,y) {
	return Math.floor(Math.random()*(y-x+1)) + x;
	},
    getLine: function(x1, y1, x2, y2) {
    	//stolen fairly shamelessly
        var line = [];
        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);
        var sx = (x1 < x2) ? 1 : -1;
        var sy = (y1 < y2) ? 1 : -1;
        var err = dx - dy;
        var e2;
        while (true) {
            line.push({x: x1, y: y1});
            if (x1 == x2 && y1 == y2) {
                break;
            }
            e2 = err * 2;
            if (e2 > -dx) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx){
                err += dx;
                y1 += sy;
            }
        }
        return line;
    },
    //calculates slope b/w two points
    calcSlope: function(x1, y1, x2, y2) {
    	return ((y2 - y1)/(x2-x1));
    },
    calcOffsets: function(x1, y1, x2, y2) {
    	var xOffset = ((x1 - x2) > 1) ? 1 : -1;
    	var yOffset = ((y1 - y2) > 1) ? 1 : -1;
    	return {x:xOffset, y:yOffset};
    } 
};
