canvasApp = function canvasApp () {

  var time = 0, no_selection=true, mouse_down = false, mouse_x=0, mouse_y=0, hXY;

  /* Get canvas properties */
  var cv = $("canvas#cv");
  var canvas = cv[0];
  var context = canvas.getContext('2d');
  var bb = canvas.getBoundingClientRect();
  var cv_x = canvas.width/bb.width;
  var cv_y = canvas.height/bb.height;

  /* Define Linear Gradient */
  var bgfade = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  bgfade.addColorStop(0.0, '#00f');
  bgfade.addColorStop(1.0, '#fff');

  /* Declare Points for vector drawing */
  var PIm2 = Math.PI*2;
  var a = [0, 20, 20],
        b = [0, 40, 20],
        c = [0, 40, 40],
        d = [0, 20, 40];
  var vpoints = [a, b, c, d];


  /* Draw main function */
  var draw = function draw(ctx,w,h,v) {
      var t = time%10;
      var h1 = ['T','h','e',' ','S','t','y','l','o','g','i','c','a','l',' ','M','a','p'];

      /* Draw video input */
      if (typeof v !== 'undefined') {
        /* Check if a GIF is being created before drawing video */
        if (gif_time > 31 ) {
          drawVideo(v, ctx, 0, 0, w, h);
        }
      }

      ctx.globalAlpha = 1.0;
      ctx.fillStyle = bgfade;

      if (vdrawing === false) {

           /* Draw Title */
          var p = time;
          if (p < 92) {
            var fade = "rgb( 0%, 0%, "+ p +"%)";
            bgfade.addColorStop(0.0, fade);
            ctx.fillRect(0,0,w,h);

            for(var i=0, z=h1.length; i<z; i++) {
              var f = .038*(p*p) - 8.42*p + 512;
              ctx.font = 'bold '+ f +'px Verdana';
              ctx.strokeText(h1[i], 27*i, 224-p);
              ctx.fillStyle = "#000";
              ctx.fillText(h1[i], 27*i, 224-p);
            }

          } else {
               ctx.fillRect(0,0,w,h);

              ctx.font = "bold 52px Verdana";
              ctx.strokeStyle = "#f33";
              ctx.fillStyle = '#000';
              ctx.strokeText('The Stylogical Map', 16, 128);
              ctx.fillText('The Stylogical Map', 16, 128);
          }

          /* Draw Geometry */
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#fff";
          ctx.beginPath();
          ctx.moveTo(0,0);
          for (var p=0, endp=vpoints.length; p<endp; p++) { 
             ctx.lineTo(vpoints[p][1],vpoints[p][2]);
          }
          ctx.stroke();

          /* Draw control points */
          ctx.fillStyle = '#ff0';
          for (var p=0, endp=vpoints.length; p<endp; p++) {
             //Debugger.log(("Current point is "+ vpoints[p][1] +", "+ vpoints[p][2]));
             ctx.beginPath();
             ctx.moveTo(vpoints[p][1],vpoints[p][2]);
             ctx.arc(vpoints[p][1],vpoints[p][2],10,0,PIm2,false);
             ctx.fill();
             if (vpoints[p][0] !== 0) {
               if (mouse_down) {
                 vpoints[p][1] = mouse_x;
                 vpoints[p][2] = mouse_y; 
                 vpoints[p][0] = 0;
               } 
             }
             if (mouse_down) {
               var hit = context.isPointInPath(mouse_x,mouse_y);
               if (hit) {
                 hXY = [1, mouse_x, mouse_y];
                 Debugger.log(("Mouse hit at "+ hXY));
                 vpoints[p] = hXY;
               } else {
                 hXY = [0, mouse_x, mouse_y];
                 Debugger.log(("No mouse hit at "+ hXY));
               }
               if (p === (endp - 1)) {
                 mouse_down = false;
               }
            }
          }


        /* GIF Recording */
        if (gif_time < 29) {
          if (time%6 <= 1) {
            //alert("Adding frame");
            Debugger.log("Adding frame");
            try {
              encoder.addFrame(ctx);
            } catch (e) {
              //alert(typeof encoder.addFrame);
            }
          }
        } else if ((!encoded) && (gif_time < 31)) {
          //alert("GIF complete");
          Debugger.log("GIF complete");
          encoder.finish();
          var binary_gif = encoder.stream().getData();
          var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
          Debugger.log(data_url);
          $("#license").after("<img src=\'"+ data_url +"\' width='768' height='432'/>");
          window.location.hash = "#license";
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
        if (time < 3000) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#fff";
          ctx.font = "bold 52px Verdana";
          ctx.strokeText("The Stylogical Map", 24, 128);
        }
      }

      if (gif_time < 32) {
        gif_time += 1;
        Debugger.log("GIF record time is: "+ gif_time);
      } else if (gif_time > 32) {
        gif_time = 32;
      }

      time += 1;
      if (time == "undefined") {
        time = 0;
      }
  };

  var mouseHit = function mouseHit(event) {
    mouse_x = (event.clientX - bb.left) * cv_x;
    mouse_y = (event.clientY - bb.top) * cv_y;
    mouse_down = true;
  }
  cv.mousedown(mouseHit);

  /* Initialize draw loop */
  try {
    var videos = $('video').toArray();
    var numVids = videos.length;
    drawLoop = setInterval(draw,33,context,canvas.width,canvas.height,videos);
    Debugger.log("Draw loop started");
  } catch(e) { 
    Debugger.log("drawLoop failed to start"); 
  }  

};
