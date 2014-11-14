/* Accelerated Visualizing
 * I've had some success with analyzing an audio file and visualizing the output.
 * Now I would like to speed up the drawing algorithms
 */

var sBuffer = [],
	fftReady = false,
	fftProgress = -1,
	fftLoader = 0,
	appStarted = false,
	appDelay = 0,
	statsBox = document.createElement('div');
statsBox.id = 'statBox';
statsBox.style.width = statsBox.style.minWidth = statsBox.style.maxWidth = 
statsBox.style.height = statsBox.style.minHeight = statsBox.style.maxHeight = "120px";
statsBox.style.position = "relative";
statsBox.style.marginTop = "-180px";
statsBox.style.marginLeft = "42.5%";
statsBox.style.color = "#FFFFFF";
statsBox.style.textAlign = "center";
statsBox.innerHTML = ( location.pathname.match(/(?:visualizer\.html|happy-b-day\.html)/)!==null )?
	'<img src="images/bw-loader.gif" /><br />Loading... ':
	'<img src="/js-demos/images/bw-loader.gif" /><br />Loading... ';

var canvasApp = function canvasApp(cv) {

/* START Global Vars */
window.audio = window.aud1;
window.audioLoad = false; 
window.audioReady = false;
window.audioName = audio.children[0].src.match(/[\/|\\]*([\w|\-|]+)\.\w\w\w$/)[1];
window.audio.onloadstart = (typeof audio.onloadstart === "object")?
	function() { audioLoad = true; return audioLoad; } : 
	(function(){ audioLoad = true; return {audioLoad:true}; })();
window.audio.oncanplaythrough = (typeof audio.oncanplaythrough === "object")?
  function() { 
	Debugger.log("audio is ready"); 
	audioReady = true; 
	return audioReady;
  } : 
  (function() {
	/*
	Debugger.log( "Inline video is not supported\n" );
	return false;
	*/
	audioReady = true; 
	return {audioReady:true};
  })();
window.canvasApp.canDrawVideo = true;
/* END Global Vars */

  /* Get canvas properties */
  var canvas = canvasApp.cv = (typeof canvasApp.cv === "object")? canvasApp.cv: cv ;
  //Debugger.log( "Using canvas '"+ canvas.id +"'\n" );
  canvas.id = "layer1";
  canvas.alt = "Interactive Audio Visualizer";
  canvas.src = "http://"+ window.location.host +"/js-demos/visualizer.png";
  canvas.width = canvas.width || "1024";
  canvas.height = canvas.height || "576";
  canvas.setAttribute( 'onmouseover', 'canvasApp.mouseOver=true;' );
  canvas.setAttribute( 'onmouseout', 'clearInterval(canvasApp.mouseEvent);canvasAppmouseOver=false;' );
  canvas.setAttribute( 'onmousemove', 'canvasApp.colorChange(event);' );
    canvasApp.mouseOver = false;
    canvasApp.mouseEvent = 0;
    canvasApp.tx = 0;
	canvasApp.strokeStyle = 'rgba(50%,100%,50%,1.0)';
    canvasApp.colorChange = function(evt){
		clearInterval(this.mouseEvent);
		if( canvasApp.mouseOver ) window.mouseEvent = setTimeout( function(evt) {
			var width = window.innerWidth,
	    		height = window.innerHeight;
			//Debugger.log( "width: "+ width +" mouse x: "+ evt.clientX );
			var strokeB, strokeR = canvasApp.strokeStyle.match(/rgba\((\d+)\%/)[1];
			if( strokeR === null ) { 
				strokeR = 50;
			} else {
				strokeR = parseFloat(strokeR)/2;
				if( strokeR > 49 ) strokeR--;
				if( strokeR < 1 ) strokeR++;
			}
			strokeB = 50 - strokeR;
			if(evt.clientX > width/2) {
				canvasApp.strokeStyle = 'rgba('+ (++strokeR)*2 +'%,100%,'+ (--strokeB)*2 +'%,1.0)';
			} else {
				canvasApp.strokeStyle = 'rgba('+ (--strokeR)*2 +'%,100%,'+ (++strokeB)*2 +'%,1.0)';
			}
			//Debugger.log( canvasApp.strokeStyle );
		}, 33, evt);
    };
  
  /* Insert loader just after the canvas */
  if( document.getElementById('statBox') === null )
    canvas.parentNode.appendChild(statsBox);

  var fftLoad = canvasApp.fftLoad = function fftLoad ( aname, pr, single ) {
	//audio.load();
	var part;
	if( pr < 0 ) {
		fftProgress = [];
		part = fftProgress.length;
	} else {
		part = pr;
	}
	  
	if( (pr > 99) || (part > 99) ) {
		clearTimeout(fftLoader);
		return true;
	} else {
		var sr = document.createElement('script'),
			fname = (part < 10)? 
				( location.pathname.match(/(?:visualizer\.html|happy-b-day\.html)/) !== null )?
					"data/"+ aname +"-0"+ part +".js":
					"/js-demos/data/"+ aname +"-0"+ part +".js" :
				( location.pathname.match(/(?:visualizer\.html|happy-b-day\.html)/) !== null )?
					"data/"+ aname +"-"+ part +".js":
					"/js-demos/data/"+ aname +"-"+ part +".js" ;	
		sr.src = fname;
		document.body.appendChild(sr);
		if( (part < 99) && (!single) )
		  fftLoader = setTimeout( fftLoad, 99, aname, ++part );
	}
	return true;
  };
    
if(! fftReady ) {
	Debugger.log( "Progress "+ fftProgress.length +"%" );
	statsBox.innerHTML = statsBox.innerHTML.match(/.+\.\.\./)[0] + fftProgress.length +"%";
	if( fftProgress < 0 ) { 
		for( var p=fftProgress, z=10; p<z; p++) {
			fftLoad(audioName, p, true);
		}
		return appDelay = setTimeout(canvasApp, 333, canvasApp.cv);
	} else if( fftProgress.length > 9 ) {
		fftReady = true;
		statsBox.parentNode.removeChild(statsBox);
	} else {
		return appDelay = setTimeout(canvasApp, 333, canvasApp.cv);
	}
} else if(! audioReady ) {
	//Debugger.log( audioReady );
	if( audioLoad === false ) audio.load();
	return appDelay = setTimeout(canvasApp, 333, canvasApp.cv);
} else clearTimeout(appDelay);
if( appStarted ) return appStarted;

  var time = 0;
  
  /* Textual stuff */
  var announcement = document.title;
  var title = (window.text_title) ? window.text_title.innerHTML: "The Stylogical Map";
  //Debugger.log( title );
  var copy = (window.text_copy) ? window.text_copy.innerHTML.split(/[\n|\r]/): "";
  //Debugger.log( copy );
	
  /* Audio visualization stuff */
  var aidx = canvasApp.aidx = 0;
  var aBuffer = canvasApp.aBuffer = [];
  var fBuffer = canvasApp.fBuffer = [];
  var vBuffer = canvasApp.vBuffer = [];
  var w = canvas.width, h = canvas.height;
  var hcorrect =  h / 2;
  if( sBuffer.length > 0 ) {
	for( var i=1, z=sBuffer.length; i<z; i++ ) {
		var a=[], f=[], v=[];
		if( typeof sBuffer[i] !== 'object' ) {
			Debugger.log( "sBuffer has hole at "+ i +"\n" );
			for( var p=0, z=11, buf=true; p<z; p++ ) {
				if( (p < 10) && (!fftProgress[p]) ) {
				  buf = false;
				  fftLoad(audioName, p, true);
				} else if(! buf ) {
					fftReady = false;
					appStarted = false;
					canvas.parentNode.appendChild(statsBox);
					return appDelay = setTimeout(canvasApp, 333, canvasApp.cv);
				}
			}
			continue;
		}
		for( var j=0, n=sBuffer[i].length; j<n; j++ ) {
			var afv = sBuffer[i][j].split(',');
			/* Draw a curve of the amplitude data */
			var curveh = -afv[0]*hcorrect + hcorrect;
			a[j] = curveh;
			f[j] = afv[1];
			v[j] = afv[2];
			
		}
		aBuffer.push(a);
		fBuffer.push(f);
		vBuffer.push(v);
		//Debugger.log( "V*h="+ aBuffer[i-1]*canvas.height +" w="+ canvas.width +" h="+ canvas.height +" \n" );
	}
	fftLoad(audioName, 10);
	//Debugger.log( "Total frames: "+ (aBuffer.length) );
  } else for( var i=0, z=2000; i<z; i++ ) aBuffer.push(0.5);
  var aCanvas = document.createElement('canvas');
  var actx = canvasApp.actx = aCanvas.getContext('2d');
  aCanvas.width = aBuffer[0].length;
  aCanvas.height = canvas.height;
  //audio.play();
 
  /* Draw main function */
  
  function draw (ctx,w,h) {
    //var t = time%32;
	var actx = canvasApp.actx;

	ctx.globalCompositeOperation = "source-over";
	ctx.globalAlpha = 1.0;
    ctx.clearRect(0, 0, w, h);
	
	aidx = canvasApp.aidx = 
	  graphSamples(actx, audio, aBuffer, fBuffer, vBuffer, aidx, w, h);
	ctx.drawImage(aCanvas, 0, 0, w>>1, h);
	  
	/* Draw video input, if any */
	var video = audio;
	if( window.canvasApp.canDrawVideo === true ) try {
  		var vx = 0;
  		vx =( video !== null )? (canvas.width/2 - video.videoWidth/2): 0;
		ctx.globalCompositeOperation = "lighter";
    	if ( (video !== null) && (video.readyState > 2) && (!video.paused) )
        	ctx.drawImage(video, vx, 0, video.videoWidth, video.videoHeight);
		/* Composite fill blue background with tranparency tied to bass v */
		ctx.globalCompositeOperation = "source-atop";
		ctx.fillStyle = "rgba(0%, 0%, 100%, "+ (0.25 - vBuffer[aidx][0]*4) +")";
		ctx.fillRect(vx, 0, video.videoWidth, video.videoHeight);
		/* Now fill red background tied to snare v */
		ctx.fillStyle = "rgba(100%, 0%, 0%, "+ (0.25 - vBuffer[aidx][5]*4) +")";
		ctx.fillRect(vx, 0, video.videoWidth, video.videoHeight);
		/* Now fill green background */
		ctx.fillStyle = "rgba(0%, 100%, 0%, "+ (0.25 - vBuffer[aidx][12]*4) +")";
		ctx.fillRect(vx, 0, video.videoWidth, video.videoHeight);
		ctx.globalCompositeOperation = "source-over";
    } catch (err) {
		Debugger.on = true;
        Debugger.log("Failed to draw "+ video.id +": "+ err.stack);
		window.canvasApp.canDrawVideo = false;
    }
	
	ctx.save();
	ctx.translate(w, 0);
	ctx.scale(-1, 1);
	ctx.drawImage(aCanvas, 0, 0, (w>>1), h);
	ctx.restore();
	
	
	/* Text */
    ctx.lineWidth = 2;
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#fff";
	//Debugger.log( "aBuffer index: "+ aidx );
	if( aidx < 100 ) {
		ctx.font = "bold "+ aidx*2 +"px Comfortaa";
		if( aidx%2 === 0) { 
			ctx.fillText(announcement, 24, h>>1);
		} else ctx.strokeText(announcement, 24, h>>1);
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
  }
  
  /* Graph samples */
  function graphSamples( ctx, audio, abuf, fbuf, vbuf, aidx, w, h ) {
	try {
		if( abuf.length < 1 ) return aidx;
		if( audio.paused ) return aidx;
		if(! (audio.readyState > 3) ) return aidx;
		var idx = Math.floor( audio.currentTime*15.02 );
		if(! abuf[idx] ) {
			Debugger.log( "abuf["+ idx +"] has not been recieved\n" );
			return aidx;
		}
		//Debugger.log( "aBuffer index: "+ idx );
		
		//ctx.clearRect(0, 0, w, h);
		ctx.fillStyle = 'rgba(0,0,0,0.25)';
		ctx.fillRect(0, 0, w, h);
		
		/* Reset canvas ctx properties */
		ctx.globalCompositeOperation = "source-over";
		ctx.font = "bold 10px Verdana";
		ctx.strokeStyle = canvasApp.strokeStyle;
		ctx.fillStyle = "#afafaf";
		ctx.beginPath();
		var hcorrect =  h / 2;
		/* Plot each sample on line that moves from left to right
		 * until we reach the end of the screen or the end of the sample
		 */
		if( idx < 1 ) {
			ctx.moveTo( 0, hcorrect );
		} else ctx.moveTo( 0, -(abuf[idx][0]*2*hcorrect) + hcorrect  );
		
		for( var i=0, z=abuf[idx].length, n=z; i<z; i++ ) {
			/* Draw a curve of the amplitude data */
			if( i > 0 ) ctx.quadraticCurveTo(
				(i-1), abuf[idx][i],
				i, abuf[idx][i]
			);
			/* Draw bars for the eq levels (fft) data */
			var barh = h - vbuf[idx][i]*h;
			if( (i <= n) ) {
				var freq = Math.floor(fbuf[idx][i]);
				ctx.fillRect( i, barh, 1, h );
				//ctx.fillText( freq, i*24, barh-10 );
			}
		}
		ctx.stroke();
		return ++idx;
		
	} catch(e) {
		Debugger.log( "graphSamples failed: " + e.message +" at frame "+ aidx +"\n"+ e.stack );
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
	time = 0;
    drawLoop = setInterval(draw,31,context,canvas.width,canvas.height);
    Debugger.log("Draw loop started");
	appStarted = true;
	return appStarted;
  } catch(e) { 
    Debugger.log("drawLoop failed to start"); 
    return;
  }
};

canvasApp.updateFFT = function(prog) { setTimeout( function(prog) {
  fftProgress[prog] = true;
  Debugger.log( fftProgress[prog] );
  var aidx = canvasApp.aidx;
  var aBuffer = canvasApp.aBuffer;
  var fBuffer = canvasApp.fBuffer;
  var vBuffer = canvasApp.vBuffer;
  var firstBreak = false;
  var w = canvasApp.cv.width, h = canvasApp.cv.height;
  var hcorrect =  h / 2;
  if( 
	  typeof sBuffer !== 'object' ||
	  typeof aBuffer !== 'object' ||
	  typeof fBuffer !== 'object' ||
	  typeof vBuffer !== 'object'
	) return Debugger.log( "canvas Buffers are undefined");
  Debugger.log( "Progress "+ fftProgress.length +"%" );
  if( fftProgress.length < 10 ) return;
  
  if( sBuffer.length > 0 ) {
	var idx = ( aidx > aBuffer.length )? aidx: (aBuffer.length-1);
	for( var i=0, z=aBuffer.length; i<z; i++ ) {
		if(! aBuffer[i] ) {
			idx = i;
			break;
		}
	}
	for( var i=idx, z=sBuffer.length; i<z; i++ ) {
		var a=[], f=[], v=[];
		if( (typeof sBuffer[i] !== 'object') ) {
			if(! firstBreak ) {
				Debugger.log( "sBuffer has hole at "+ i +"\n" );
				for( var p in fftProgress ) {
					if( (p < prog) && (!fftProgress[p]) )
					  fftLoad(audioName, p, true);
				}
				firstBreak = true;
			}
			continue;
		}

		for( var j=0, n=sBuffer[i].length; j<n; j++ ) {
			var afv = sBuffer[i][j].split(',');
			/* Draw a curve of the amplitude data */
			var curveh = -afv[0]*hcorrect + hcorrect;
			a[j] = curveh;
			f[j] = afv[1];
			v[j] = afv[2];
		}
		aBuffer.push(a);
		fBuffer.push(f);
		vBuffer.push(v);
	}
	Debugger.log( "Total frames: "+ (aBuffer.length) );
  }
}, 266, prog); };
