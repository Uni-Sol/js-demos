canvasApp = function canvasApp () {

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
  var cv = $('canvas#cv');
  var canvas = cv[0];
  var context = canvas.getContext('2d');
  var bb = canvas.getBoundingClientRect();
  var doc = $(document);
  var cv_w = (canvas.width/bb.width);
  var cv_h = (canvas.height/bb.height);
  var cv_pos = cv.offset();
  $(window).scrollTop(cv_pos.top);

  /* Define Title Screen */
  var title_screen = {
    drawTitle : function (ctx, w, h, ts) {

      if (typeof ts.p === 'undefined') {
        ts={
          p : ftime,
          h1 : ['T','h','e',' ','S','t','y','l','o','g','i','c','a','l',' ','M','a','p'],
          f : [], 
          fs : [],
          c : $("<canvas></canvas>").attr({width:w, height:h})[0].getContext('2d'),
          drawTitle : function drawTitle(ctx, w, h, ts) {
            var c = ts.c;
            if (ts.p < 72) {
              c.fillStyle = ts.fs[ts.p];
              //Debugger.log("fillStyle: "+ ctx.fillStyle);
              c.strokeStyle = ts.fs[ts.p];
              //var fade = 'rgb( 0%, 0%, '+ p +'%)';
              //bgfade.addColorStop(0.5, fade);
              //ctx.beginPath();
              //for(var j=0; j<h; j++) {
              //  ctx.moveTo(0, j);
              //  ctx.lineTo(w,j);
              //  ctx.stroke();
              //}
              c.fillRect(0,0,w,h)

              for(var i=0, z=ts.h1.length; i<z; i++) {
                c.font = 'bold '+ ts.f[ts.p] +'px Verdana';
                c.fillStyle = '#000';
                c.fillText(ts.h1[i], 8+(25*i), 224-ts.p);
                c.strokeText(ts.h1[i], 9+(25*i), 224-ts.p);
              }

            } else {
               c.fillStyle = bgfade;
               c.fillRect(0,0,w,h);

              c.font = 'bold 52px Verdana';
              c.fillStyle = '#000';
              c.fillText('The Stylogical Map', 8, 128);
              c.strokeText('The Stylogical Map', 8, 128);
            }
            ctx.drawImage(c.canvas, 0, 0);
            ts.p = ftime;
            return ts;
          }       
        };

        for (var i=0; i<128; i++) {
          ts.fs.push('rgb(0, 0, '+ ((i*2) >> 0) +')');
          ts.f.push(( .038*(i*i) - 8.42*i + 512 ));
        }
        Debugger.log('drawTitle: '+ ts.p +' (first run)');
      }

      return ts;  
    }
  }

  /* Define Linear Gradient */
  var bgfade = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  bgfade.addColorStop(0.0, 'rgb(0, 0, 0)');
  bgfade.addColorStop(1.0, 'rgb(0, 0, 255)');

  /* Declare Points for vector drawing */
  var PIm2 = Math.PI*2;
  var a = [0, 20, 20],
        b = [0, 40, 20],
        c = [0, 40, 40],
        d = [0, 20, 40];
  var vpoints = [a, b, c, d];


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

           /* Draw Title */
          title_screen = title_screen.drawTitle(ctx, w, h, title_screen);
          Debugger.log("title_screen.p: "+ title_screen.p);

          /* Draw Geometry */
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#fff';
          ctx.beginPath();
          ctx.moveTo(0,0);
          for (var p=0, endp=vpoints.length; p<endp; p++) { 
             ctx.lineTo(vpoints[p][1],vpoints[p][2]);
          }
          ctx.stroke();

          /* Draw control points */
          ctx.fillStyle = '#ff0';
          for (var p=0, endp=vpoints.length; p<endp; p++) {
             //Debugger.log(('Current point is '+ vpoints[p][1] +', '+ vpoints[p][2]));
             ctx.beginPath();
             ctx.moveTo(vpoints[p][1],vpoints[p][2]);
             ctx.arc(vpoints[p][1],vpoints[p][2],10,0,PIm2,false);
             ctx.fill();
             if (vpoints[p][0] !== 0) {
               if (mouse_down && (!mouse_up)) {
                 vpoints[p][1] = mouse_x;
                 vpoints[p][2] = mouse_y;
                 //vpoints[p][0] = 0;
               }
               else { 
                 vpoints[p][0] = 0;
               }
             }
             if (mouse_down && (hXY[0] === 0)) {
               var hit = context.isPointInPath(mouse_x,mouse_y);
               if (hit) {
                 hXY = [1, mouse_x, mouse_y];
                 Debugger.log(('Mouse hit at '+ hXY));
                 vpoints[p] = hXY;
               } else {
                 hXY = [0, mouse_x, mouse_y];
                 //Debugger.log(('No mouse hit at '+ hXY));
               }
            }
          }


        /* GIF Recording */
        if (gif_time < 29) {
          if (ftime%6 <= 1) {
            //alert('Adding frame');
            Debugger.log('Adding frame');
            try {
              encoder.addFrame(ctx);
            } catch (e) {
              //alert(typeof encoder.addFrame);
            }
          }
        } else if ((!encoded) && (gif_time < 31)) {
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
    Debugger.log("DROP FRAME");
  }
  /* STOP: Drop frames */
      Debugger.log( "Frame Rate (fps): "+ ( 1000 / (ctime-ptime) ));
      ptime = ctime;

      if (gif_time < 32 && (ftime%6 === 0)) {
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
        alert("GIF animations can only be created prior to any video playing on this page. Please refresh the page and start recording a GIF *before* playing the video.\ndream, play & have fun,\nRev");
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
    mouse_x = (event.clientX - cv_pos.left + doc.scrollLeft()) * cv_x;
    mouse_y = (event.clientY - cv_pos.top + doc.scrollRight()) * cv_y;
    Debugger.log('mouse coords captured');
  }
  if ('ontouchmove' in document.createElement('div'))  {
    cv.bind('touchstart', function(e){
      Debugger.log('MouseDown');
      mouse_down = true;
      mouse_up = false;
      touchHit(e.originalEvent);
      e.preventDefault()
    });
    cv.bind('touchmove', function(e){
      touchHit(e.originalEvent);
      e.preventDefault()
    });
    cv.bind('touchend', function(e){ 
      Debugger.log('MouseUp');
      mouse_down = false;
      mouse_up = true; 
      if (hXY[0] === 0) {
        vpoints.push(hXY);
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

};
