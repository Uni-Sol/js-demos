(function() {
  if(typeof canvasApp[0] !== 'function') canvasApp=[];
}());

canvasApp.push( function() {

  var rtime = function rtime() {
    var t = new Date();
    return t.getTime();
  };

  var frate=66,
         fdelay=frate*2, 
         ftime=0,
         ptime=rtime(), 
         no_selection=true, 
         mouse_down=false, 
         mouse_up=true, 
         mouse_x=0, 
         mouse_y=0, 
         hXY=[0,0,0];

  /* Get canvas properties */
  var win = $(window);
  var doc = $(document);
  var cv = $('canvas#cv');
  var canvas = cv[0];
  var context = canvas.getContext('2d');
  var bb = canvas.getBoundingClientRect();
  var cv_w = (canvas.width/bb.width);
  var cv_h = (canvas.height/bb.height);
  var cv_pos = cv.offset();
  win.scrollTop(cv_pos.top);

  /* Define Radial Gradient */
  var radfade = context.createRadialGradient(10,10,1,10,10,20);
  radfade.addColorStop(0.0, 'hsl( 60, 100%, 50%)');
  radfade.addColorStop(1.0, 'hsla( 0, 0%, 0%, 0)');
  var fade = 'hsl( 0, 100%, 50%)'

  /* Declare Points for vector drawing */
  var PIm2 = Math.PI*2;
  var a = [0, 180, 160];
  var vpoints = [a];

  /* Define Title Screen */
  var ts = {
    drawScreen : function (w, h) {
      if (typeof ts.p === 'undefined') {
          ts.p = ftime;
          ts.h1 = ['T','h','e',' ','S','t','y','l','o','g','i','c','a','l',' ','M','a','p'];
          ts.hx = [];
          ts.f = []; 
          ts.c = $("<canvas></canvas>").attr({width:w, height:h})[0].getContext('2d');
          ts.c.beginPath();
          ts.c.moveTo(0, 0);
          ts.c.lineTo(w, 0);
          ts.c.lineTo(w,h);
          ts.c.lineTo(0, h);
          ts.c.closePath();
          ts.c.clip();

          ts.drawScreen = function drawScreen(w, h) {
            var c = ts.c;
            c.globalAlpha = 1.0;
            if (ts.p < 72) {
              c.globalAlpha = 0.1;
              c.fillStyle = '#000';
              c.fillRect(0, 0, w, h);
              c.strokeStyle = "#fff";
              c.globalAlpha = 1.0;
              for(var i=0, z=ts.h1.length; i<z; i++) {
                c.font = 'bold '+ ts.f[ts.p] +'px Verdana';
                c.fillStyle = '#000';
                c.fillText(ts.h1[i], ts.hx[i], 224-ts.p);
                c.strokeText(ts.h1[i], ts.hx[i]+1, 224-ts.p);
              }
            } else {
                if (ts.p < 92) {
                  c.globalAlpha = 0.1;
                  c.fillStyle = '#000';
                  c.fillRect(0, 0, w, h);
                  c.strokeStyle = "#fff";
                  c.globalAlpha = 1.0;
                } else {
                  c.globalAlpha = 1.0;
                  c.clearRect(0, 0, w, h);
                }
              c.font = 'bold 52px Verdana';
              c.fillStyle = '#000';
              c.fillText('The Stylogical Map', 8, 128);
              c.strokeText('The Stylogical Map', 8, 128);
            }
            ts.p = ftime;
          };

        for (var i=0; i<128; i++) {
          ts.hx.push(8+(25*i));
          ts.f.push(( .038*(i*i) - 8.42*i + 512 ));
        }
        Debugger.log('drawTitle: '+ ts.p +' (first run)');
      } 
    }
  }

  /* Define Vector-Heightmap Screen */
  var vhm = {
    drawScreen : function (w, h) {
      if (typeof vhm.p === 'undefined') {
          //alert('Defining Vector-heightmap');
          vhm.p = ftime;
          vhm.c = $("<canvas></canvas>").attr({width:w, height:h})[0].getContext('2d');
          vhm.h = h;
          vhm.bgfade = [];
          for( var j=0,end=h; j<end; j++) {
              vhm.bgfade.push((vhm.c.createLinearGradient(0,j,w,j)));
              vhm.bgfade[j].addColorStop(0.0, '#000');
              vhm.bgfade[j].addColorStop(1.0, '#000');
          }
          //alert(vhm.bgfade.length);
          vhm.paintVectors = function paintVectors() {
            var c = vhm.c;
            var h = vhm.h;
            c.clearRect(0,0,w,h);
            for( var j=0,end=h; j<end; j+=8) {
                vhm.bgfade[j]=c.createLinearGradient(0,j,w,j);
                vhm.bgfade[j].addColorStop(0.0, '#000');
                vhm.bgfade[j].addColorStop(1.0, '#000');
                for (var p=0, endp=vpoints.length; p<endp; p++) {
                  var deltax = (vpoints[p][1]);
                  var deltay = (32 - (j - vpoints[p][2]));
                  if ((deltay>0) && (deltay<64)) {
                    var dmin = (vpoints[p][2]>j) ? deltax-(1024/deltay) : deltax+deltay;
                    var dmax = (vpoints[p][2]>j) ? deltax+(1024/deltay) : deltax-deltay;
                    //Debugger.log("deltay is "+ deltay +" & dmin is "+ dmin);
                    if (dmin<0) { dmin=0; } else if (dmin>w) { dmin=w; }
                    if (dmax<0) { dmax=0; } else if (dmax>w) { dmax=w; }               
                    vhm.bgfade[j].addColorStop((dmin/w), 'rgba(0,0,0,127)');
                    vhm.bgfade[j].addColorStop((dmax/w), 'rgba(0,0,0,127)');
                    vhm.bgfade[j].addColorStop((deltax/w), 'transparent');
                  }
                }
            }
          };
          vhm.drawScreen = function drawScreen(w, h) {
            var c = vhm.c;
            c.globalAlpha = 1.0;
            //c.clearRect(0, 0, w, h);
            for(var j=0,j01,end=h; j<end; j++) {
              c.beginPath();
              j01=j&7;
              if (j01 === 0) { 
                c.moveTo(0, j);
                c.lineTo(w, j);
                c.strokeStyle = fade;
                c.stroke();
                c.strokeStyle = vhm.bgfade[j];
                c.stroke();
              }
            }
            
            vhm.p = ftime;
          };
          vhm.paintVectors();  
          Debugger.log('drawVectorHeightMap: '+ vhm.p +' (first run)');
      } 
    }
  }

  /* Define Control-Point Screen */
  var ctrl = {
    drawScreen : function (w, h) {
      if (typeof ctrl.p === 'undefined') {
          ctrl.p = ftime;
          ctrl.c = $("<canvas></canvas>").attr({width:w, height:h})[0].getContext('2d');
          ctrl.drawScreen = function drawScreen(w, h) {
            var c = ctrl.c;
            c.globalAlpha = 1.0;
            c.clearRect(0, 0, w, h);

           /* Draw Geometry */
           c.lineWidth = 2;
           c.strokeStyle = '#fff';
          c.beginPath();
           c.moveTo(0,0);
           for (var p=0, endp=vpoints.length; p<endp; p++) { 
              c.lineTo(vpoints[p][1],vpoints[p][2]);
           }
           c.stroke();

           /* Draw control points */
           fade = 'hsl( '+ (ftime&255) +', 100%, 50%)';
           radfade.addColorStop(0.0, fade); 
           c.fillStyle = radfade;
           for (var p=0, endp=vpoints.length; p<endp; p++) {
           c.save();
             //Debugger.log(('Current point is '+ vpoints[p][1] +', '+ vpoints[p][2]));
             c.beginPath();
             c.translate(vpoints[p][1]-10,vpoints[p][2]-10);
             c.moveTo(10, 10);
             c.arc(10,10,10,0,PIm2,false);
             c.fill();
             c.arc(10,10,15,0,PIm2,false);
           c.restore();
              /* Move Selected Control point */
              if (vpoints[p][0] !== 0) {
                /*Repaing vector height-map*/
                if (typeof vhm.paintVectors !== 'undefined') {
                  vhm.paintVectors();
                }
                if (mouse_down && (!mouse_up)) {
                  vpoints[p][1] = mouse_x;
                  vpoints[p][2] = mouse_y;
                  //vpoints[p][0] = 0;
                }
                else { 
                  vpoints[p][0] = 0;
                }
              }
              /* Delete selected control point and refresh screen */
              if (mouse_up && (hXY[0] !== 0)) {
                /*Repaing vector height-map*/
                if (typeof vhm.paintVectors !== 'undefined') {
                  vhm.paintVectors();
                }
                var hit = c.isPointInPath(mouse_x,mouse_y);
                if (hit && (vpoints[p][0] === 0) && 
                     (vpoints[(p+1)] !== 'undefined') && 
                     (vpoints[(p+1)][0] === 1)) {
                  hXY = [1, mouse_x, mouse_y];
                  Debugger.log(('Mouse hit at '+ hXY));
                  vpoints.splice(p+1, 1);
                  vpoints[p]= hXY;
                } else if (!hit) Debugger.log("No mouse hit"); 
             }
             /* Select a control point */
             if (mouse_down && (hXY[0] === 0)) {
               var hit = c.isPointInPath(mouse_x,mouse_y);
               if (hit) {
                 Debugger.log(('Mouse hit at '+ hXY));
                 hXY = [1, mouse_x, mouse_y];
                 vpoints[p] = hXY;
               } else {
                 Debugger.log(('No mouse hit at '+ hXY));
                 hXY = [0, mouse_x, mouse_y];
               }
             }
           }            
             ctrl.p = ftime;
         };
            
         Debugger.log('drawControlPoints: '+ ctrl.p +' (first run)');
      } 
    }
  }

  /* Draw main function */
  var draw = function draw(ctx,w,h,v) {
      /* Timing and Frame drops */
      var ctime = rtime();
      var t = fdelay + ptime;

  /* START: DRAW frames if ctime is a head of time t ELSE DROP frames*/
  if (t > ctime) {
      //Debugger.log("Current time (ms): "+ ctime);
      //Debugger.log("Frame time (ms): "+ t);

      /* Draw video input */
      if (typeof v !== 'undefined') {
        /* Check if a GIF is being created before drawing video */
        if (gif_time > 31 ) {
          drawVideo(v, ctx, 0, 0, w, h);
        }
      }

      ctx.globalAlpha = 1.0;

      if (vdrawing === false) {

         /* Draw Vector-Heightmap */
         if (ftime > 71 && mouse_up) {
           vhm.drawScreen(w, h);
           if (typeof vhm.c === 'object') {
             ctx.drawImage(vhm.c.canvas, 0, 0);
           } else {
             vhm.drawScreen(w, h);
           }
         } else if (ftime > 72) {
           if (typeof vhm.c === 'object') {
             ctx.drawImage(vhm.c.canvas, 0, 0);
           } else {
             vhm.drawScreen(w, h);
           }
         }

         /* Draw Title */
         if (ftime < 96) {
           ts.drawScreen(w, h);
         }
         ctx.drawImage(ts.c.canvas, 0, 0);

        /* Draw Ctrl Points */
        ctrl.drawScreen(w, h);
        ctx.drawImage(ctrl.c.canvas, 0, 0);

        /* GIF Recording */
        if (gif_time < 9) {
          if (ftime%5 <= 1) {
            //alert('Adding frame');
            Debugger.log('Adding frame');
            try {
              encoder.addFrame(ctx);
            } catch (e) {
              //alert(typeof encoder.addFrame);
            }
          }
        } else if ((!encoded) && (gif_time < 11)) {
          //alert('GIF complete');
          Debugger.log('GIF complete');
          encoder.finish();
          var binary_gif = encoder.stream().getData();
          var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
          Debugger.log(data_url);
          $('#license').after("<img src=\'"+ data_url +"\' width='768' height='432'/>");
          window.location.hash = '#license';
          encoded = true;
        } else {
          /* Reset GIF Recorder */
          encoded = false;
          encoder = new GIFEncoder();
          encoder.setRepeat(0);   //0  -> loop forever
                        //1+ -> loop n times then stop
          encoder.setDelay(150);  //go to next frame every n milliseconds
          encoder.start();
          gif_time = 32;
        }
      } else if (vdrawing === true) {
        vplayed += 1;
        if (ftime < 3000) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#fff';
          ctx.font = 'bold 44px Verdana';
          ctx.strokeText('The Stylogical Map', 8, 128);
        }
      }

  } else {
    //Debugger.log("DROP FRAME");
  }
  /* STOP: Drop frames */
      //Debugger.log( "Frame Rate (fps): "+ ( 1000 / (ctime-ptime) ));
      ptime = ctime;

      if (gif_time < 32 && (ftime%5 === 0)) {
        gif_time +=  1;
        Debugger.log("GIF record time is: "+ gif_time);
      } else if (gif_time > 32) {
        gif_time = 32;
      }

      ftime += 1;
      if (ftime == 'undefined') {
        ftime = 0;
      }
       
  };

  /* Record GIF function */
  if (typeof recordGIF === "object") {
    recordGIF = function recordGIF () {
      if ((!vdrawing) && (vplayed === 0))  {
        //var cv = $("canvas#cv")[0];
        //cv.getContext('2d').clearRect(0,0,cv.width,cv.height);
        gif_time = 0;
      } else {
        alert("GIF animations can only be created prior to any video playing on this page.\n Please refresh the page and start recording a GIF *before* playing the video.\n dream, play & have fun,\n Rev");
      }  
    };
  }

  var touchHit = function touchHit(event) {
    //Debugger.log(event.touches);
    mouse_x = (event.touches[0].clientX - cv_pos.left + doc.scrollLeft()) * cv_w;
    mouse_y = (event.touches[0].clientY - cv_pos.top + doc.scrollTop()) * cv_h;
    //Debugger.log('Canvas coords: '+ cv_pos.left +', '+ cv_pos.top);
    //Debugger.log('Bound box size: '+ bb.width +', '+ bb.height);
    //Debugger.log('Bound-box coords: '+ bb.left +', '+ bb.top);
    //Debugger.log('Viewport size: '+ doc.width() +', '+ doc.height());
    //Debugger.log('Viewport coords: '+ doc.scrollLeft() +', '+ doc.scrollTop());
    //Debugger.log('Touch coords: '+ event.touches[0].clientX +', '+ event.touches[0].clientY);
  }
  var mouseHit = function mouseHit(event) {
    mouse_x = (event.clientX - cv_pos.left + doc.scrollLeft()) * cv_w;
    mouse_y = (event.clientY - cv_pos.top + doc.scrollTop()) * cv_h;
    Debugger.log('mouse coords captured');
  }
  if ('ontouchmove' in document.createElement('div'))  {
    /*win.bind('touchstart', function(e){
      e.preventDefault();
    });
    win.bind('touchmove', function(e){
      e.preventDefault();
    });
    win.bind('touchend', function(e){
      e.preventDefault();
    });*/
    cv.bind('touchstart', function(e){
      Debugger.log('MouseDown');
      mouse_down = true;
      mouse_up = false;
      touchHit(e.originalEvent);
      e.preventDefault();
    });
    cv.bind('touchmove', function(e){
      touchHit(e.originalEvent);
      e.preventDefault();
    });
    cv.bind('touchend', function(e){ 
      Debugger.log('MouseUp');
      mouse_down = false;
      mouse_up = true;
      /* Add a control point */
      if (hXY[0] === 0) {
        vpoints.push(hXY);
        /*Repaint vector height-map*/
        if (vhm.paintVectors !== 'undefined') {
          vhm.paintVectors();
        }
      }
      e.preventDefault();
    });
    Debugger.log('touch is present');
  } else {
    cv.mousedown(function(e) {
      Debugger.log('MouseDown');
      mouse_down = true;
      mouse_up = false;
      mouseHit(e);  
    });
    cv.mousemove(mouseHit);
    cv.mouseup(function (e) { 
       Debugger.log('MouseUp');
       mouse_down = false;
       mouse_up = true; 
      if (hXY[0] === 0) {
        vpoints.push(hXY);
        /*Repaint vector height-map*/
        if (vhm.paintVectors !== 'undefined') {
          vhm.paintVectors();
        }
      }
    });
  }

  /* Initialize draw loop */
  try {
    var videos = $('video').toArray();
    var numVids = videos.length;
    ptime = rtime();
     /* Display initial time props */
    Debugger.log("Start time: "+ ptime);
    drawLoop = setInterval(draw,frate,context,canvas.width,canvas.height,videos);
    Debugger.log('drawLoop started');
  } catch(e) { 
    Debugger.log('drawLoop failed to start'); 
  }  

});
