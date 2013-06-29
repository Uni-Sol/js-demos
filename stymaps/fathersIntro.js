(function() {
  if(typeof canvasApp[0] !== 'function') canvasApp=[];
}());

canvasApp.push( function() {

  /* Audio: Get element, clone, insert clone into doc */
  var audioA = document.getElementById('aud1');
  var audioB = audioA.cloneNode(true);
  audioB.id = 'aud2';
  document.getElementById('stream').appendChild(audioB);

  var rtime = function rtime() {
    var t = new Date();
    return t.getTime();
  };

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
  var fade = 'hsl( 0, 100%, 50%)';

  /* Trignometric constants */
  var PIm2 = Math.PI*2;

/* GSS Emblem from SVG:
<svg xmlns="http://www.w3.org/2000/svg">
  <linearGradient id='g' gradientTransform='rotate(90, 0.5, 0.5)'>
    <stop offset='0.4' stop-color='#12f' />
    <stop offset='0.5' stop-color='#2f2' />
  </linearGradient>
  <linearGradient id='s' gradientTransform='rotate(90, 0.5, 0.5)'>
    <stop offset='0.45' stop-color='#ed1' />
    <stop offset='0.55' stop-color='#d2e' />
  </linearGradient>

  <!-- path d='M 120,70 L 120,16 L 8,16 L 8,72 L 8,128 L 120,128 L 120,72 L 92,72' stroke='#000' fill='none' / -->
  <path d='M 120,68 C 120,0 8,0 8,72 C 8,144 120,144 120,72 L 92,72' stroke-width='4' stroke='url(#g)' fill='none' /> 

  <!-- path d='M 72,68 L 92,44 L 78,30 L 64,16 L 50,30 L 36,44 L 50,58 L 64,72 L 78,86 L 92,100 L 78,114 L 64, 128 L 50,114 L 36,100 L 56,76' stroke='#000' fill='none' / -->
  <path d='M 72,68 Q 96,44 78,30 Q 64,20 50,30 Q 32,44 50,58 Q 64,72 78,86 Q 96,100 78,114 Q 64, 124 50,114 Q 32,100 56,76' stroke-width='4' stroke='url(#s)' fill='none'/>
</svg> */
  /* GSS Title screen */
  var gss = {
    drawScreen : function  (w, h) {
      if (typeof this.p === 'undefined') {
        this.p = ftime;
        this.h1 = [
          ['Global'], 
          ['Survival'], 
          ['system','software','systems','sufficiency','society','sanity','spontanaeity']
        ];
        this.w = 256;
        this.h = 144;
        this.color = '#12f';
        this.c = $("<canvas></canvas>").attr({width:this.w, height:this.h})[0].getContext('2d');
        this.g_grad = this.c.createLinearGradient(0,0,0,this.h);
        this.g_grad.addColorStop(0.4, '#12f');
        this.g_grad.addColorStop(0.5, '#2f2');
        this.s_grad = this.c.createLinearGradient(0,0,0,this.h);
        this.s_grad.addColorStop(0.45, '#2f2');
        this.s_grad.addColorStop(0.55, '#12f');
        this.PI = Math.PI/15;

        this.drawScreen = function drawScreen(w,h) {
          var c = this.c;
          c.globalAlpha = 1.0;
          c.clearRect(0, 0, this.w, this.h);
          c.save();

          var cyc = this.p%45-15;
          if (15>cyc) {
            c.beginPath();
            c.moveTo(64,72);
            c.moveTo(120,76);
            c.arc(64,72, 64, 0,-this.PI*(cyc), true);
            c.arc(64,72, 64, Math.PI-this.PI*(cyc),Math.PI, false);
            c.closePath();
            c.lineWidth=8;
            c.strokeStyle='#fff';
            //c.stroke();
            c.clip(); 
          }  
          c.beginPath();
          c.moveTo(120,68);
          c.bezierCurveTo(120,0, 8,0, 8,72);
          c.bezierCurveTo(8,144, 120,144, 120,72);
          c.lineTo(92,72);
          c.lineWidth=4;
          c.strokeStyle=this.g_grad;
          c.stroke();
          c.beginPath(); 
          c.moveTo(72,68);
          c.quadraticCurveTo(96,44, 78,30); 
          c.quadraticCurveTo(64,20, 50,30);
          c.quadraticCurveTo(32,44, 50,58);
          if ((9>cyc) && (cyc>-1)) {
            c.lineTo(62,68);
            c.moveTo(66,76);
           }
          c.quadraticCurveTo(66,76, 78,86);
          c.quadraticCurveTo(96,100, 78,114);
          c.quadraticCurveTo(64,124, 50,114);
          c.quadraticCurveTo(32,100, 56,76);
          c.lineWidth=4;
          c.strokeStyle=this.s_grad;
          c.stroke();

          c.restore();
          c.font = 'small-caps bold 28px Comfortaa';
          if (this.p > 2) {
            var h1x = this.w/2 + 4;
            c.fillStyle = this.color;
            for (var i=0, z=this.h1.length; i<z; i+=1)  {
              //c.strokeText('TEST', 100, 100);
              c.fillText(this.h1[i][(this.p%this.h1[i].length)], h1x, 52+(i*32));
            }
          } 
          this.p = ftime;       
        };
        Debugger.log('drawGSS: '+ this.p +' (first run)');
      }
    }
  };

  /* A Title Screen function */
  var drawTitle = function drawTitle () {
      if (typeof this.p === 'undefined') {
          var w = arguments[0];
          var h = arguments[1];
          this.init = ftime;
          this.p = ftime - this.init;
          this.h1 = arguments[3];
          this.hx = [];
          this.hy = h/4;
          this.f = []; 
          this.fc = '#23f';
          this.c = $("<canvas></canvas>").attr({width:w, height:h})[0].getContext('2d');
          this.c.beginPath();
          this.c.moveTo(0, 0);
          this.c.lineTo(w, 0);
          this.c.lineTo(w,h);
          this.c.lineTo(0, h);
          this.c.closePath();
          this.c.clip();

          this.drawScreen = function () {
            var c = this.c;
            var w = arguments[0];
            var h = arguments[1];
            c.globalAlpha = 1.0;
            if (this.p < 72) {
              c.globalAlpha = 0.1;
              c.fillStyle = '#000';
              c.fillRect(0, 0, w, h);
              //c.fillStyle = this.fc;
              c.strokeStyle = this.fc;
              c.globalAlpha = 1.0;
              for(var i=z=(this.h1.length-1); (i+1)>0; i--) {
                var cx = this.hx[this.p]+(i*36);
                c.font = 'bold '+ this.f[this.p] +'px Comfortaa';
                //c.fillText(this.h1[i], cx, this.hy);
                c.strokeText(this.h1[i], cx, this.f[this.p]);
              }
            } else {
                if (this.p < 92) {
                  c.globalAlpha = 0.1;
                  c.fillStyle = '#000';
                  c.fillRect(0, 0, w, h);
                  c.strokeStyle = this.fc;
                  c.globalAlpha = 1.0;
                } else {
                  c.globalAlpha = 1.0;
                  c.clearRect(0, 0, w, h);
                }
              c.font = 'bold small-caps 58px Comfortaa';
              c.fillStyle = this.fc;
              c.fillText(arguments[4], this.hx[0]-24, this.hy);
            }
            this.p = ftime - this.init;
          };

        for (var i=0; i<128; i++) {
          this.hx.push(48+(4*i));
          this.f.push(( .038*(i*i) - 8.42*i + 512 ));
        }
        Debugger.log(arguments[2] +': '+ this.p +' (first run)');
      } 
    };

  /* Define first Title Screen */
  var ts = {
    drawScreen : drawTitle
  };

  /* Define second Title Screen */
  var t2 = [];

  /* Audio Tracker */
  var atPlayer = function() {
    if (typeof this.atime === 'undefined' && this.A.readyState > 1 && this.B.readyState > 1) {
      this.atime = ftime/15;
      this.stime = this.atime;
      this.A.currentTime = 0.1;
      this.B.currentTime = 0.1;

      this.play = function() { 
        var A = this.A;
        var B = this.B;
        var lp = this.looptime;
        if (B.currentTime === 0) B.pause();
        if (A.currentTime === 0) A.pause();
        if (A.paused === true) {
          Debugger.log('B time: '+ B.currentTime);
          if ( (this.atime-this.stime) > lp ) {
            B.currentTime = 0.01;
            A.currentTime = 0.01;
            A.play();
            this.stime = this.atime;
            B.pause();
          }
        } else {
          Debugger.log('A time: '+ A.currentTime);
          if ( (this.atime-this.stime) > lp ){
            A.currentTime = 0.01;
            B.currentTime = 0.01;
            B.play(); 
            this.stime = this.atime;
            A.pause();
          }
        }
        this.atime = ftime/15;
      };

      setTimeout(this.A.play(), fdelay);
    } else Debugger.log('readyState is '+ this.A.readyState);
  };

  var atrack = {
    A : audioA,
    B : audioB,
    looptime : 4.7999999999,
    play : atPlayer
  };

  /* Draw main function */
  var draw = function draw(ctx,w,h,v) {
      /* Timing and Frame drops */
      var ctime = rtime();
      var t = fdelay + ptime;

  /* START: DRAW frames if ctime is ahead of time t 
      ELSE: DROP frames*/
  if (t > ctime) {
      //Debugger.log("Current time (ms): "+ ctime);
      //Debugger.log("Frame time (ms): "+ t);

      ctx.globalAlpha = 1.0;

      /* Draw video input */
      if (typeof v !== 'undefined') {
        /* Check if a GIF is being created before drawing video */
        if (gif_time > 31 ) {
          drawVideo(v, ctx, 0, 0, w, h);
        }
      }

      if (vdrawing === false) {

      /* Draw first Title */
      if (ftime < 100) {
        if (ftime > 96) {
          ctx.globalAlpha = 32/ftime;
        } else {
          ctx.globalAlpha=1.0;
          ctx.clearRect(0,0,w,h);
        }
        ts.drawScreen(w, h, 'drawTitle', ['G','  ','S',' ','s'], 'GSs Presents');
        ctx.drawImage(ts.c.canvas, 0, 0);
      } 

      /*Draw GSS Title */
      if (ftime > 96 && ftime < 268) {
        if (ftime < 100) {
          ctx.globalAlpha=0.25;
        } else {
          ctx.globalAlpha=1.0;
          ctx.clearRect(0,0,w,h);
        }
        gss.drawScreen(w, h);
        ctx.drawImage(gss.c.canvas, 0, 0, w, h);
      }

      /* Draw secondary Titles */
      var phrase = ['::Are ','You ','Paying::','Netention???'];
      if (typeof t2.p !== 'number') for (var i=0, z=phrase.length; i<z; i++) {
        if (ftime > 550 && ftime < 640) ctx.clearRect(0,0,w,h);
        if (typeof t2[i] !== 'object') t2.push({drawScreen : drawTitle}); 
        if (ftime > (264+i*86) && ftime < (380+i*86)) {
          if (ftime > 400) { 
            var a = (400+12*i)/ftime;
            ctx.globalAlpha = (a < 1) ? a : 1.0;
          }
          t2[i].drawScreen(w, h, 'drawTitle2.'+i, [phrase[i]], phrase[i]);
          ctx.drawImage(t2[i].c.canvas, 0, 0);
        }
      }

      /*Draw GSS Title again*/
      if (ftime > 640 && ftime < 768) {
        if (ftime < 680) {
          ctx.globalAlpha=0.1;
        } else if (ftime > 752) {
          ctx.globalAlpha = 256/ftime;
        } else {
          ctx.globalAlpha=1.0;
          ctx.clearRect(0,0,w,h);
        }
        gss.drawScreen(w, h);
        ctx.drawImage(gss.c.canvas, 0, 0, w, h);
      }

      /* Draw url Title */
      if (ftime > 768) {
        if (ftime < 680) {
          ctx.globalAlpha=0.1;
        } else {
          ctx.globalAlpha=1.0;
          ctx.clearRect(0,0,w,h);
        }
        if (typeof t2.p !== 'number') t2 = {drawScreen : drawTitle}; 
        t2.drawScreen(w, h, 'drawTitle3', [':GSs:'], '::GSs @ Netention.Org::');
        ctx.drawImage(t2.c.canvas, 0, 0);
        if ('ontouchmove' in document.createElement('div'))  {
          cv.bind('touchstart', function(e){
            e.preventDefault();
            window.location.replace("http://netention.org");
          });
        } else {
          cv.bind('mousedown', function(e) {
            window.location.replace("http://netention.org");  
          });
        }
      }

        /* GIF Recording */
        if (gif_time < 9) {
          if (ftime%5 <= 1) {
            //alert('Adding frame');
            Debugger.log('Adding frame');
            try {
              encoder.addFrame(gss.c);
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
          ctx.font = 'bold 44px Comfortaa';
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
      atrack.play();       
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
    });
  }

  /* Initialize draw loop */
  try {
    var videos = $('video').toArray();
    var numVids = videos.length;
    ptime = rtime();
     /* Display initial time props */
    //Debugger.log("Start time: "+ ptime);
    drawLoop = setInterval(draw,frate,context,canvas.width,canvas.height,videos);
    Debugger.log('drawLoop started');
  } catch(e) { 
    Debugger.log('drawLoop failed to start'); 
  }  

});
