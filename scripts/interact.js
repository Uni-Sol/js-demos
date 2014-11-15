function canvasApp( canvas ) {
	canvas.width = canvas.width || "1024";
  	canvas.height = canvas.height || "576";
	
try {
    var buffer = document.createElement("canvas");
    buffer.width = canvas.width;
    buffer.height = canvas.height;
    alert( buffer );
    
    var ctx = buffer.getContext("2d");
    
    var ball1 = new Ball(buffer);
    	
    var track1  = new SliderTrack(buffer, 10, 1, 10, 99, 1);    	
    var track2  = new SliderTrack(buffer, 90, 1, 90, 99, 3);
    
    ball1.accelBall(2000, 500);
    
    setInterval( function() {
		ctx.clearRect(0, 0, buffer.width, buffer.height);
		
		/* Background */
    	ctx.fillStyle = "#000";
    	ctx.fillRect(0, 0, buffer.width, buffer.height);
		
		/* Tracks */
    	track1.renderTrack();
    	track1.handle.accelHandle( 0.85*ball1.vel.y );
    	track1.handle.moveHandle();
    	track2.renderTrack();
    	track2.handle.accelHandle( 0.85*ball1.vel.y );
    	track2.handle.moveHandle();
    	
    	/* Ball */
   		ball1.renderBall();
   		ball1.moveBall();
   		
   		if( track1.checkCollision(ball1) ) {
   			ball1.accelBall(-ball1.vel.x, ball1.vel.y);
   			ball1.bounceBall("x");	
   		} else if( track2.checkCollision(ball1) ) {
   			ball1.accelBall(-ball1.vel.x, ball1.vel.y);
   			ball1.bounceBall("x");	
   		}
   		
   		/* buffer to on-screen canvas */
   		canvas.getContext("2d").drawImage(buffer, 0, 0, canvas.width, canvas.height);
    }, 33 );
    return canvas;
} catch(e) { alert( e.stack ); }
}


"use strict";

function Ball( canvas ) {
	this.loc = { x: 50, y: 50 };
	this.size = 20;
	this.vel = { x: 0, y: 0 };
	this.canvas = canvas;
	
	Ball.prototype.accelBall = 
	function( x, y ) {
		this.vel.x = x;
		this.vel.y = y;
		
		return this.vel;
	};
	
	Ball.prototype.bounceBall = 
	function( axis ) {
		if( axis === "y" ) {
			this.loc.y = this.loc.y + (this.vel.y/250);
		} else if( axis === "x" ) {
			this.loc.x = this.loc.x + (this.vel.x/250);
		}
	};
	
	Ball.prototype.moveBall = 
	function() {
		this.loc.x = this.loc.x + this.vel.x/1000;
		this.loc.y = this.loc.y + this.vel.y/1000;
		
   		if( 100 < this.loc.x || this.loc.x < 0 ) {
   			this.accelBall(-this.vel.x, this.vel.y);
   			this.bounceBall("x");
   		}
   		if( 100 < this.loc.y || this.loc.y < 0 ) {
   			this.accelBall(this.vel.x, -this.vel.y);
   			this.bounceBall("y");
   		}

		return this.loc;
	};
	
	Ball.prototype.renderBall = 
    function() {
    	var ctx = this.canvas.getContext("2d"),
    		w = this.canvas.width,
    		h = this.canvas.height,
			a = {};
    	a.x = (this.loc.x)/100 * w - this.size/2,
    	a.y = (this.loc.y)/100 * h - this.size/2;
		//alert( a.x +" "+ a.y +" "+ this.size );
    	
    	ctx.lineWidth = 2;
    	ctx.fillStyle = "#FFF";
    	ctx.fillRect(a.x, a.y, this.size, this.size);
    };
}

function SliderHandle() {
    this.loc = 50;
    this.vel = 0;
    
    SliderHandle.prototype.accelHandle = 
	function( vel ) {
		this.vel = vel;
		
		return this.vel;
	};
    
    SliderHandle.prototype.moveHandle = 
	function() {
		this.loc = this.loc + this.vel/1000;
		
   		if( 90 < this.loc ) {
   			this.loc = 90
   		} else if( this.loc < 10 ) {
   			this.loc = 10;
   		}
   				
		return this.loc;
	};
    
    SliderHandle.prototype.renderHandle = 
    function( canvas ) {
    	var ctx = canvas.getContext("2d"),
    		w = canvas.width,
    		h = canvas.height,
			a, b;
    	a = -10/100 * h,
    	b = 10/100 * h;
    	
    	ctx.beginPath();
    	ctx.moveTo(0, a);
    	ctx.lineTo(0, b);
    	ctx.lineWidth = 30;
    	ctx.strokeStyle = "#FFF";
    	ctx.stroke();
	};
}

function SliderTrack( canvas, x1, y1, x2, y2, or ) {
	/* STATIC */
	SliderTrack.modes = {
		"static": 0,
		"dynamic": 1
	}
	SliderTrack.orientation = [ 0, 90, 180, 270 ];
	
	/* this INSTANCE */
    this.mode = "static";
    this.a = { x: x1, y: y1 };
    this.b = { x: x2, y: y2 };
    this.canvas = canvas;
	this.or = or || 0;
    
    this.handle = new SliderHandle();
    
    SliderTrack.prototype.checkCollision = 
	function( ball ) {
		switch( this.or ) {	
			case 0:
			break;
			case 1:
				if( (this.handle.loc + 10) > ball.loc.y && 
					ball.loc.y > (this.handle.loc - 10) 
				) {
					if( (this.a.x) > (ball.loc.x-2) ) {
						return true;
					}
				}
				if( (this.handle.loc + 10) > ball.loc.x && 
					ball.loc.x > (this.handle.loc - 10) 
				) {
					if( (this.a.y+2) > (ball.loc.y-2) ) {
						return true;
					}
				}
			break;
			case 2:
			break;
			case 3:
				if( (this.handle.loc + 10) > ball.loc.y && 
					ball.loc.y > (this.handle.loc - 10) 
				) {
					if( (this.a.x) < (ball.loc.x+2) ) {
						return true;
					}
				}
				if( (this.handle.loc + 10) > ball.loc.x && 
					ball.loc.x < (this.handle.loc - 10) 
				) {
					if( (this.a.y+2) > (ball.loc.y-2) ) {
						return true;
					}
				}
			break;
		}
    	
    	return false;
    };
    
    SliderTrack.prototype.renderTrack =
    function() {
    	var ctx = this.canvas.getContext("2d"),
    		w = this.canvas.width,
    		h = this.canvas.height,
			a = {}, b = {};
    	a.x = (this.a.x)/100 * w,
    	a.y = (this.a.y)/100 * h,
    	b.x = (this.b.x)/100 * w,
    	b.y = (this.b.y)/100 * h;
    	
    	ctx.beginPath();
    	ctx.moveTo( a.x, a.y );
    	ctx.lineTo( b.x, b.y );
    	ctx.lineWidth = 20;
    	ctx.strokeStyle = this.trackPattern();
    	ctx.stroke();
    	
    	ctx.save();
    	ctx.translate(a.x, (this.handle.loc/100*h));
    	this.handle.renderHandle(this.canvas);
    	ctx.restore();
    };
    
    SliderTrack.prototype.trackPattern = function( ax, ay, bx, by ) {
    	var tp = document.createElement("canvas");
    	tp.width = tp.height = 50;
    	tp.ctx = tp.getContext('2d');
    	tp.ctx.fillStyle = "#777";
    	tp.ctx.fillRect(0, 0, tp.width-20, tp.height-20);
    	tp.pattern = tp.ctx.createPattern(tp, 'repeat');
    	//tp.ctx.rotate(Math.PI/8);
    	//tp...
    	return tp.pattern;
    };
}
