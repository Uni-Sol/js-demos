/* FFT Visualizing
 * Because I know very little about sound visualization with fft data,
 * this is an attempt to explorer that using HTML5 audio & canvas
 */

(function() { 
  if (typeof Debugger === "function") { 
    Debugger.on = true;
	Debugger.log( "Because I know very little about sound visualization with fft data, this is an attempt to explorer that using HTML5 audio & canvas\n" );
    return; 
  }
} )();

canvasApp = function canvasApp () {
//alert('Running default canvasApp');
  var time = 0;

  /* Get canvas properties */
  var canvas = window.cv;
	
  /* Audio visualization stuff */
  var audio = window.aud1;
  var aidx = 0;
  var aBuffer = [];
  if( sBuffer.length > 0 ) {
	for( var i=1, z=sBuffer.length; i<z; i++ ) {
		var v = sBuffer[i].split(',')[0];
		aBuffer.push(v);
		//Debugger.log( "V*h="+ aBuffer[i-1]*canvas.height +" w="+ canvas.width +" h="+ canvas.height +" \n" );
	}
  } else for( var i=0, z=2000; i<z; i++ ) aBuffer.push(0.5);
  audio.play();
  var aCanvas = document.createElement('canvas');
  aCanvas.width = canvas.width;
  aCanvas.height = canvas.height;
  
  /* Draw main function */
  var draw = function draw(ctx,w,h) {
    var t = time%32;
	var actx = aCanvas.getContext('2d');

    ctx.globalAlpha = 1.0;

    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 2;
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#fff";
	ctx.strokeRect(0, 0, w, h);
    ctx.font = "bold 12px Verdana";
    ctx.fillText("The Stylogical Map", 24, 128);
	
	aidx = graphSamples(actx, audio, aBuffer, aidx, w, h);
	ctx.drawImage(aCanvas, 0, 0);
    
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
		var at = audio.currentTime;
		if( (at * 30 * 37) < aidx ) return aidx;
		var idx = aidx;
		//Debugger.log( "aBuffer index: "+ idx );
		
		/* Plot each sample on line that moves from left to right
		 * until we reach the end of the screen or the end of the sample
		 */
		ctx.clearRect(0, 0, w, h);
		ctx.strokeStyle = "#ffffff";
		ctx.beginPath();
		var hcorrect =  h / 2;
		if( idx < 1 ) {
			ctx.moveTo( 0, hcorrect );
		} else ctx.moveTo( 0, -(abuf[idx]*h) + hcorrect  );
		for( var i=0, z=( abuf.length>(147+idx) )?147:(abuf.length-idx); i<z; i++ ) {
			ctx.lineTo( i*4.5, -(abuf[i+idx]*hcorrect) + hcorrect );
		}
		ctx.stroke();
		return idx + 147;
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
  } catch(e) { 
    Debugger.log("drawLoop failed to start"); 
    return;
  }
};

window.onload = canvasApp;