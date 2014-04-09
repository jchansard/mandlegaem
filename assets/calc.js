Game.Calc = {
	//random number b/w x and y (inclusive)
	randRange: function(x,y) {
	return Math.floor(Math.random()*(y-x+1)) + x;
	},
    getLine: function(x1, y1, x2, y2,len) {
    	if (typeof x1 !== 'number' || typeof y1 !== 'number' || typeof x2 !== 'number' || typeof y2 !== 'number') {
    		throw new Error("non-numbers passed to getline");
    		return;
    	}
    	//stolen fairly shamelessly
    	//TODO: fix bug with lines looking weird (e.g. when line = y-3,x-2)
        var line = [];
        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);
        var sx = (x1 < x2) ? 1 : -1;
        var sy = (y1 < y2) ? 1 : -1;
        var err = dx - dy;
        var e2;
        while (true) {
            line.push({x: x1, y: y1});
            if ((len === undefined && (x1 == x2 && y1 == y2)) || (len !== undefined && line.length >= len)) {
                break;
            }
            e2 = err * 2;
            if (e2 > -dx) {
                err -= dy;
                x1 += sx;
            }
            if (e2 <= dx) {
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
    calcOffsets: function(x1, y1, x2, y2, full) {
    	full = full || false;
    	if (!full) {
    		var xOffset = ((x1 - x2) > 1) ? 1 : -1;
    		var yOffset = ((y1 - y2) > 1) ? 1 : -1;
    	} else {
    		var xOffset = x1 - x2;
    		var yOffset = y1 - y2;
    	}
    	return {x:xOffset, y:yOffset};
    },
    getFilledCircle: function(xO, yO, radius) {
	    // copied/modified from stackoverflow.com/questions/1201200/fast-algorithm-for-drawing-filled-circles
	    var x = radius;
	    var y = 0;
	    var xChange = 1 - (radius << 1);
	    var yChange = 0;
	    var radiusError = 0;
	    var points = [];
	    
	    while (x >= y) {
	        for (var i = xO - x; i <= xO + x; i++) {
	            points.push({x: i, y:yO + y});
	            points.push({x: i, y:yO - y});
	            //tiles[i][yO + y] = tile;
	            //tiles[i][yO - y] = tile;
	        }
	        for (var i = xO - y; i <= xO + y; i++) {
	        	points.push({x: i, y:yO + x});
	            points.push({x: i, y:yO - x});
	            //tiles[i][yO + x] = tile;
	            //tiles[i][yO - x] = tile;
	        }
	
	        y++;
	        radiusError += yChange;
	        yChange += 2;
	        if (((radiusError << 1) + xChange) > 0) {
	            x--;
	            radiusError += xChange;
	            xChange += 2;
	        }
	    }
	return points;
	}
};
