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
statsBox.innerHTML = ( location.pathname.match(/(\.html)/)!==null )?
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
    window.addEventListener('keydown', function(event) {
        if(!event) var event = window.event; // cross-browser shenanigans
        if(event.keyCode === 32) { // this is the spacebar
            if( window.audio.paused ) window.audio.play();
            else window.audio.pause();
            event.preventDefault();
        }
        return true; // treat all other keys normally;
    });
	/* END Global Vars */

	/* Get canvas properties */
	var canvas = 
        canvasApp.cv = (typeof canvasApp.cv === "object")? 
                        canvasApp.cv: 
                        cv;
    
	Debugger.log( "Using canvas '"+ canvas.id +"'\n" );
	canvas.id = "layer1";
	canvas.alt = "Interactive Audio Visualizer";
	canvas.src = (location.pathname.match(/(\.html)/) !== null)?
        "visualizer.png":
	   "http://"+ window.location.host +"/js-demos/visualizer.png";
	canvas.width = canvas.width || "1024";
	canvas.height = canvas.height || "576";
	canvas.setAttribute( 'onmouseover', 'canvasApp.mouseOver=true;' );
	canvas.setAttribute( 'onmouseout', 'clearInterval(canvasApp.mouseEvent);canvasAppmouseOver=false;' );
	canvas.setAttribute( 'onmousemove', 'canvasApp.colorChange(event);' );
	canvasApp.mouseOver = false;
	canvasApp.mouseEvent = 0;
	canvasApp.tx = 0;
	canvasApp.strokeStyle = (window['foreground01']) ? window['foreground01'].style.color : 'rgb(127,255,127)';
	canvasApp.blockStyle = 'hsla(150,100%,100%,1.0)';
	var strokeR = (window['foreground02']) ?
				    window['foreground02'].style.color.match(/rgb\((\d+)/)[1] :
					(canvasApp.blockStyle && canvasApp.blockStyle.match(/rgb\((\d+)/) !== null)?
                    canvasApp.blockStyle.match(/rgb\((\d+)/)[1] :
                    "hsl(180, 100%, 100%)",
		strokeB = (window['foreground03']) ?
					window['foreground03'].style.color.match(/rgb\(\d+,[\s|\d]+,([\s|\d]+)/)[1] :
					(canvasApp.blockStyle && canvasApp.blockStyle.match(/rgb\((\d+)/) !== null)?
                    canvasApp.blockStyle.match(/rgb\((\d+)/)[1] :
                    "hsl(180, 100%, 100%)";
	canvasApp.colorChange = function(evt){
		 clearInterval(this.mouseEvent);
		 if( canvasApp.mouseOver ) window.mouseEvent = setTimeout( function(evt) {
		 	var width = window.innerWidth,
		 		height = window.innerHeight;
//		 	Debugger.log( "width: "+ width +" mouse x: "+ evt.clientX );
		 	if(! strokeR ) {
		 		strokeR = 127;
		 		strokeB = 255;
		 	} else {
		 		strokeR = parseInt(strokeR/2);
		 		if( strokeR > 127 ) strokeR--;
		 		if( strokeR < 1 ) strokeR++;
		 		strokeB = parseInt(strokeB);
		 		if( strokeB > 255 ) strokeB--;
		 		if( strokeB < 1 ) strokeB++;
		 	}
		 	if(evt.clientX > width/2) {
		 		canvasApp.blockStyle = 'rgb('+ (strokeR++) +',127,'+ (strokeB++) +')';
		 	} else {
		 		canvasApp.blockStyle = 'rgb('+ (strokeR--) +',127,'+ (strokeB--) +')';
		 	}
//		 	Debugger.log( canvasApp.strokeStyle );
		 }, 33, evt);
        
        return true;
	};

  /* Insert loader just after the canvas */
  if( document.getElementById('statBox') === null )
    canvas.parentNode.appendChild(statsBox);

  /* Track fft amplitudes */
  var amp1=0, amp2=0;

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
				( location.pathname.match(/(\.html)/) !== null )?
					"data/"+ aname +"-0"+ part +".js":
					"/js-demos/data/"+ aname +"-0"+ part +".js" :
				( location.pathname.match(/(\.html)/) !== null )?
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
		setTimeout(function(){ audio.play(); }, 3333);
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
  var title = (window.text_title) ? window.text_title.innerHTML: "Real~Currents";
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
	var bCanvas = document.createElement('canvas');
	aCanvas.width = bCanvas.width = w>>2; //aBuffer[0].length;
	aCanvas.height = bCanvas.height = canvas.height;
	var actx = canvasApp.actx = aCanvas.getContext('2d');
	var bctx = canvasApp.bctx = bCanvas.getContext('2d');
	//audio.play();

  /* Draw main function */

  function draw (ctx, w, h) {

	var actx = canvasApp.actx,
        bctx = canvasApp.bctx;
    
    function drawPictures (context, pictures) {
        var pidx = 0,
            change = 223;
        
        if( aidx > change ) pidx = parseInt(aidx/change)%(pictures.length);
        if( aidx < 10 ) {
            context.globalCompositeOperation = "source-out";
            context.globalAlpha = 0.05;
        } else if( aidx%change < 3 || (change - 3) < aidx%change) {
            context.globalCompositeOperation = "source-out";
            context.globalAlpha = 0.25;
        } else if( aidx%change < 6 || (change - 6) < aidx%change) {
            context.globalCompositeOperation = "screen";
            context.globalAlpha = 0.50;
        } else {
            context.globalCompositeOperation = "source-in";
            context.globalAlpha = 1.0;
        }
        context.drawImage(pictures[pidx], (canvas.width/2 - pictures[pidx].width), -40, pictures[pidx].width*2, pictures[pidx].height*2);

    }
      
    function drawVideo (context, video) {
         var pidx = 0,
             change = 223;

         if( aidx < 10 ) {
             context.globalCompositeOperation = "source-out";
             context.globalAlpha = 0.05;
         } else if( aidx%change < 3 || (change - 3) < aidx%change) {
             context.globalCompositeOperation = "source-out";
             context.globalAlpha = 0.25;
         } else if( aidx%change < 6 || (change - 6) < aidx%change) {
             context.globalCompositeOperation = "screen";
             context.globalAlpha = 0.50;
         } else {
             context.globalCompositeOperation = "source-in";
             context.globalAlpha = 1.0;
         }

        /* Draw video input, if any */
        if( window.canvasApp.canDrawVideo === true ) try {
            var cCanvas = document.createElement('canvas');
            var cctx = cCanvas.getContext('2d');
            var vx = 0;

            cCanvas.width = w/2;
            cCanvas.height = video.videoHeight;
            cctx.globalAlpha = 1.0

            vx =( video !== null )? (canvas.width/2 - video.videoWidth/2): 0;
            if ( (video !== null) && (video.readyState > 2) && (!video.paused) )
                cctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

            ctx.globalAlpha = 1.0;
            ctx.save();
            ctx.drawImage(cCanvas, 0, 0, w/2, video.videoHeight);
//            setTimeout(function () {
                ctx.translate(w, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(cCanvas, 0, 0, w/2, video.videoHeight);
                ctx.restore();
//            }, 1);

//            cctx.drawImage(aCanvas, 1, 2, (w>>2)-1, h-4);
//            cctx.fillStyle = "rgba(0%,0%,0%,0.005)";
//            cctx.fillRect(0, 0, w, h);

        } catch (err) {
            Debugger.on = true;
            Debugger.log("Failed to draw "+ video.id +": "+ err.stack);
            window.canvasApp.canDrawVideo = false;
            Debugger.on = false;
        }

        Debugger.log( "time: "+ time );
    }

	ctx.globalCompositeOperation = "source-over";
	ctx.globalAlpha = 1.0;


    try {
        if( time%2 ) {
            //Debugger.on = true;

            bctx.clearRect(0, 0, w, h);
            context.globalCompositeOperation = "source-over";
            context.globalAlpha = 1.0;
            
            if( window.pictures && window.pictures.children.length > 0 ) {
                drawPictures(ctx, window.pictures.children);
                ctx.globalCompositeOperation = "multiply";
                ctx.globalAlpha = 0.05;

            } else if( window.canvasApp.canDrawVideo === true ) {
                drawVideo(actx, audio);
                ctx.globalCompositeOperation = "multiply";
                ctx.globalAlpha = 0.5;
            }
            
            for( var o = 6; o > 0; o-- ) {
                aidx = canvasApp.aidx =
                  graphSamples(actx, audio, aBuffer, fBuffer, vBuffer, aidx, w, h, o);
            }
            ctx.globalAlpha = 1.0;
            ctx.drawImage(aCanvas, 0, 0, (w>>1), h);
            ctx.save();
            ctx.translate(w, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(aCanvas, 0, 0, (w>>1), h);
            ctx.restore();
            
            bctx.drawImage(aCanvas, 1, 2, (w>>2)-1, h-4);
            bctx.fillStyle = "rgba(0%,0%,0%,0.005)";
            bctx.fillRect(0, 0, w, h);
            
        } else {
            actx.clearRect(0, 0, w, h);

            actx.drawImage(bCanvas, 1, 2, (w>>2)-1, h-4);
            actx.fillStyle = (window['background02']) ? window['background02'].style.color : "rgba(0%,0%,0%,0.025)";
            actx.fillRect(0, 0, w, h);
        }

	} catch (err) {

        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1.0;
        
		Debugger.on = true;
		Debugger.log("Failed to draw: "+ err.stack);
		window.canvasApp.canDrawVideo = false;
		Debugger.on = false;
	}

	ctx.globalCompositeOperation = "source-over";
	ctx.globalAlpha = 1.0;

	/* Text */
	ctx.lineWidth = 2;
	ctx.fillStyle =  (window['foreground01']) ? window['foreground01'].style.color : "hsl(180, 100%, 100%)";
	ctx.strokeStyle = (window['foreground02']) ? window['foreground02'].style.color : "#fff";
	//Debugger.log( "aBuffer index: "+ aidx );
	if( aidx < 100 ) {
		ctx.font = "bold "+ aidx*2 +"px Comfortaa";
//		if( aidx%2) {
//			ctx.fillText(announcement, 24, h>>1);
//		} else 
//            ctx.strokeText(announcement, 24, h>>1);
	} else if( aidx > 300 ) {
		ctx.font = "bold 12px Verdana";
		ctx.fillText(title, 64, 128);
		if( (aidx > 1500) && (aidx < 3500) ) for(var i=0, z=copy.length; i<z; i++)
			ctx.fillText(copy[i], w>>1, (2500 - aidx) + (i*20) );
	}

	time++;
	if (time == "undefined") {
	  time = 0;
	}

	//Debugger.log( "time: "+ time );
  }

  /* Graph samples */
  function graphSamples( ctx, audio, abuf, fbuf, vbuf, aidx, w, h, o ) {

	try {
		if( abuf.length < 1 ) return aidx;
		if( audio.paused ) return aidx;
		if(! (audio.readyState > 3) ) return aidx;

		var idx = Math.floor( audio.currentTime*15.03 ) - 6;
		if(! abuf[parseInt(idx + o)] ) {
			Debugger.log( "abuf["+ idx +"] has not been recieved\n" );
			return aidx;
		}
		//Debugger.log( "aBuffer index: "+ idx );

		/* Reset canvas ctx properties */
		ctx.globalCompositeOperation = "source-over";
		ctx.globalAlpha = 1.0;
		ctx.font = "bold 10px Verdana";
		var hcorrect =  h / 2;
		/* Plot each sample on line that moves from left to right
		 * until we reach the end of the screen or the end of the sample
		 */
		if( idx < 1 ) {
			ctx.moveTo( 0, hcorrect );
		} else ctx.moveTo( 0, -(abuf[parseInt(idx + o)][0]*2*hcorrect) + hcorrect  );

		var verts = 6,
			hidx = parseInt(idx + o);
        
		ctx.beginPath();
        if( aidx%6 ) canvasApp.blockStyle = (window['foreground02']) ? window['foreground02'].style.color : "hsl(180, 100%, 100%)";
        else canvasApp.blockStyle = (window['foreground03']) ? window['foreground03'].style.color : "hsl(180, 100%, 100%)";
        
        ctx.fillStyle = canvasApp.blockStyle.replace(/,\s?0\.\d+\)/, ",1.0)");
		for( var i=0, z=abuf[hidx].length, n=z; i<z; i++ ) {
			/* Draw a curve of the amplitude data */
			if( i > 0 ) {
				ctx.strokeStyle = canvasApp.strokeStyle;
				ctx.strokeWidth = canvasApp.strokeWidth;
				ctx.quadraticCurveTo(
					(i-1)*4, abuf[hidx][i] + o,
					i*4, abuf[hidx][i] + o
				);
			}
			/* Draw bars for the eq levels (fft) data */
			var barh = h - vbuf[hidx][i]*h;
			amp2 = amp1;
			amp1 = (i === 3 && vbuf[hidx][i] > 0.05)? vbuf[hidx][i] : amp1;
			verts = (amp2 !== amp1)? parseInt(Math.random()*10) : verts;
			if( (i <= n) ) {
				var freq = Math.floor(fbuf[hidx][i]);
				//ctx.fillStyle = "hsl("+ (200 - vbuf[parseInt(idx + o)][i]*180) +", 100%, 50%)";
				ctx.fillStyle = canvasApp.blockStyle.replace(
                                    /,\s?0\.\d+\)/, 
                                    ",1.0)"
                                ).replace(
                                    /hsla\((150),\s?(100)\%,\s?(70)\%/,
                                    "hsla($1, "+ (vbuf[parseInt(idx + o)][i]*50) +"%, $3%"
                                ); 
				ctx.fillRect( i*4, barh, 4, h );
			}
		}

		polygon(ctx, verts, idx%(w)-(w>>3), idx%(h), (parseFloat(amp2+amp1)/2)*w, idx, 0);
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
    drawLoop = setInterval(draw, 31, context, canvas.width, canvas.height);
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
