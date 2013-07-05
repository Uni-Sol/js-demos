﻿/* FFT Visualizing
 * Because I know very little about sound visualization with fft data,
 * this is an attempt to explorer that using HTML5 audio & canvas
 */

var audio = window.aud1;
var appReady = false, appStarted = false;
audio.oncanplaythrough = (typeof audio.oncanplaythrough === "object")?
  function() { appReady = true; Debugger.log("audio is ready"); } : appReady = true;

(function() { 
  if (typeof Debugger === "function") { 
    Debugger.on = true;
	Debugger.log( "Because I know very little about sound visualization with fft data, this is an attempt to explorer that using HTML5 audio & canvas\n" );
    return; 
  }
} )();

var canvasApp = function canvasApp () {
if(! appReady ) {
	Debugger.log( appReady );
	return setTimeout(canvasApp, 33);
}
if( appStarted ) return appStarted;
//alert('Running default canvasApp');
  var time = 0;

  /* Get canvas properties */
  var canvas = window.cv;
  
  /* Textual stuff */
  var title = window.text_title.innerHTML || "The Stylogical Map";
  //Debugger.log( title );
  var copy = window.text_copy.innerHTML.split(/[\n|\r]/);
  //Debugger.log( copy );
	
  /* Audio visualization stuff */
  var aidx = 0;
  var aBuffer = [];
  if( sBuffer.length > 0 ) {
	for( var i=1, z=sBuffer.length; i<z; i++ ) {
		var v = []
		for( var j=0, n=sBuffer[i].length; j<n; j++ ) {
			v.push( sBuffer[i][j].split(',')[0] );
		}
		aBuffer.push(v);
		//Debugger.log( "V*h="+ aBuffer[i-1]*canvas.height +" w="+ canvas.width +" h="+ canvas.height +" \n" );
	}
	Debugger.log( "Total frames: "+ (aBuffer.length) );
  } else for( var i=0, z=2000; i<z; i++ ) aBuffer.push(0.5);
  var aCanvas = document.createElement('canvas');
  aCanvas.width = canvas.width;
  aCanvas.height = canvas.height;
  var video = audio;
  var vx = 0;
  try {
	vx = ( video !== null )? (canvas.width/2 - video.videoWidth/2) : 0;
	//Debugger.log(video.id);
  } catch (e) {}
  audio.play();
  
  /* Draw main function */
  var draw = function draw(ctx,w,h) {
    var t = time%32;
	var actx = aCanvas.getContext('2d');

    ctx.globalAlpha = 1.0;
    ctx.clearRect(0, 0, w, h);
	
    /* Draw video input, if any */
	try {
    	if ( (video !== null) && (video.readyState > 2) && (!video.paused) )
        	ctx.drawImage(video, vx, 0, video.videoWidth, video.videoHeight);
    } catch (err) {
        Debugger.log("Failed to draw "+ video.id +": "+ err.message);
    } 
	
	aidx = graphSamples(actx, audio, aBuffer, aidx, w, h);
	ctx.drawImage(aCanvas, 0, 0);
	
	/* Text */
    ctx.lineWidth = 2;
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#fff";
	//Debugger.log( "aBuffer index: "+ aidx );
	if( aidx < 100 ) {
		ctx.font = "bold "+ aidx*2 +"px Comfortaa";
		if( aidx%2 === 0) { 
			ctx.fillText("Happy Birthday, Dad!", 24, h>>1);
		} else ctx.strokeText("Happy Birthday, Dad!", 24, h>>1);
		
	} else if( aidx > 300 ) {
		ctx.font = "bold 12px Verdana";
		ctx.fillText(title, 24, 128);
		if( (aidx > 1500) && (aidx < 3500) ) for(var i=0, z=copy.length; i<z; i++)
			ctx.fillText(copy[i], w>>1, (2500 - aidx) + (i*20) );
	}
    
    time += 1;
    if (time == "undefined") {
      time = 0;
    }
  };
  
  /* Graph samples */
  function graphSamples( ctx, audio, abuf, aidx, w, h ) {
	try {
		if( abuf.length < 1 ) return aidx;
		if( audio.paused ) return aidx;
		if(! (audio.readyState > 3) ) return aidx;
		var idx = aidx;
		//Debugger.log( "aBuffer index: "+ idx );
		if(! abuf[idx] ) return aidx;
		var at = audio.currentTime;
		if( (at * 7.46) < aidx ) return idx;
		//Debugger.log( (at * 7.46) +": "+ at +", idx: "+ idx +" \n");
		
		/* Plot each sample on line that moves from left to right
		 * until we reach the end of the screen or the end of the sample
		 */
		ctx.clearRect(0, 0, w, h);
		ctx.strokeStyle = "#ffffff";
		ctx.beginPath();
		var hcorrect =  h / 2;
		if( idx < 1 ) {
			ctx.moveTo( 0, hcorrect );
		} else ctx.moveTo( 0, -(abuf[idx][0]*hcorrect) + hcorrect  );
		for( var i=0, z=abuf[idx].length; i<z; i++ ) {
			//ctx.lineTo( i*4, -(abuf[idx][i]*hcorrect) + hcorrect );
			if( i > 0 ) ctx.quadraticCurveTo(
				(i-1)*4, -(abuf[idx][i]*hcorrect) + hcorrect,
				i*4, -(abuf[idx][i]*hcorrect) + hcorrect
			);
		}
		ctx.stroke();
		return ++idx;
	} catch(e) {
		Debugger.log( "graphSamples failed: " + e.message );
		return aidx;
	}
  }

  /* Draw polygons */
  function polygon(c, n, x, y, r, angle, counterclockwise, order) {
    var order = order || null;
    if (order === (null || "first")) {
      c.beginPath();
    }
    var angle = angle || 0;
    var counterclockwise = counterclockwise || false;
    //Compute vertex position and begin a subpath there
    c.moveTo(x + r*Math.sin(angle),
             y - r*Math.cos(angle));
    var delta = 2*Math.PI/n;
    //For remaining verts, 
    for (var i=1; i < n; i++) {
      //compute angle of this vertex,
      angle += counterclockwise ? -delta : delta;
      //then compute position of vertex and add line
      c.lineTo(x + r*Math.sin(angle),
               y - r*Math.cos(angle));
    }
    //Connect last vertex back to first
    c.closePath();
    
    if (order === (null || "last")) {
      //Fill the poly
      c.fill();
      //Outline the poly
      c.stroke();
    }
  }

  /* Begin draw loop */
  try {
    var context = canvas.getContext('2d');
    drawLoop = setInterval(draw,33,context,canvas.width,canvas.height);
    Debugger.log("Draw loop started");
	appStarted = true;
	return appStarted;
  } catch(e) { 
    Debugger.log("drawLoop failed to start"); 
    return;
  }
};


window.onload = canvasApp;