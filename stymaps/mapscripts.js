/* mapscripts.js
 *
 * General functions for scripting the Stylogical Map
 * http://stymaps.blogspot.com
 *
 * Code by Revlin John 
 * stylogicalmaps@gmail.com
 */

/* If not present,import jQuery */
(function () { 
  if (typeof jQuery === "function") { 
    //alert('jQuery is present in src');
    return; 
  }
  try {
    var docbody = document.body;
    var jqscript = document.createElement("script") ;
    //alert('jQuery not linked in src. Now adding reference');
    jqscript.setAttribute("src", "http://universalsoldier.ca/stymaps/jquery.min.js");
    jqscript.setAttribute("type","text/javascript");
    //alert('script attributes set');
    docbody.setAttribute("style", "display:none;");
    //alert('body hidden');
    docbody.appendChild(jqscript);
    //alert('script added');
    docbody.setAttribute("style", "display:block;");
    //alert('body visible');
    setTimeout(function() {
      if (typeof jQuery === "function") { 
        //alert('jQuery is present in src');
        return; 
      } else {
        //alert('jQuery failed to load');
      }
    }, 3333);
  } catch(e) {
    //alert('jQuery failed to load');
  }
  return;
}());

/* If not present,  import Debugger */
(function () { 
  if (typeof Debugger === "function") { 
    //alert('Debugger is present in src');
    return; 
  }
  try {
    var docbody = document.body;
    var dscript = document.createElement("script") ;
    //alert('Debugger not linked in src. Now adding reference');
    dscript.setAttribute("src", "http://universalsoldier.ca/scripts/debugger.js");
    dscript.setAttribute("type","text/javascript");
    //alert('script attributes set');
    docbody.setAttribute("style", "display:none;");
    //alert('body hidden');
    docbody.appendChild(dscript);
    //alert('script added');
    docbody.setAttribute("style", "display:block;");
    //alert('body visible');
    setTimeout(function() {
      if (typeof Debugger === "function") { 
        //alert('Debugger is present in src');
        return; 
      } else {
        //alert('Debugger failed to load');
      }
    }, 3333);
  } catch(e) {
    //alert('Debugger failed to load');
  }
  return;
}());

/* GIF Encoder Variables */
var encoded = false;
var gif_time = 32;
if(typeof GIFEncoder === "function") {
  var encoder = new GIFEncoder();
  encoder.setRepeat(0);   //0  -> loop forever //1+ -> loop n times then stop
  encoder.setDelay(150);  //go to next frame every n milliseconds
  encoder.start();
}

function canvasSupport () {
    return document.createElement('canvas').getContext;
}

(function() {
if (typeof canvasApp !== 'function' && (typeof canvasApp !== 'object' || typeof canvasApp[0] === 'undefined') ) {

canvasApp = function canvasApp () {
//alert('Running default canvasApp');
  var time = 0;

  /* Get canvas properties */
  var canvas = $("canvas#cv")[0];
  var can23;
  if (typeof processing !== 'undefined') {
    can23 = $("canvas#can23").css({marginTop: p_offset+"px", marginLeft: "186px",display: "block"}).insertAfter(canvas)[0];
    $(can23).after( $('#click_div').css("margin-top", "-196px") );
  }

  /* Draw main function */
  var draw = function draw(ctx,w,h,v) {
      var t = time%32;

      ctx.globalAlpha = 1.0;
      //Draw video input
      if (typeof v !== 'undefined' && typeof v.length === 'number') {
        if (gif_time > 31 ) {
          drawVideo(v, ctx, 0, 0, w, h);
        }
      }

      if (vdrawing === true) {
        vplayed += 1;
        if (time < 3000) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#fff';
          ctx.font = 'bold 44px Verdana';
          ctx.strokeText('The Stylogical Map', 8, 128);
        }
      } else if (vdrawing === false) {
        
        if ((time < 3000) && (typeof processing === 'undefined')) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#fff";
          ctx.font = "bold 52px Verdana";
          var p = time;
          if (p > 256) p = 32;
          ctx.strokeText("The Stylogical Map", 272-8*p, 128);
          ctx.font = "normal 16px Verdana";
          ctx.fillStyle = "#000";
          ctx.fillText("A presentation of various works-in-progress,", 272, 514 - 2*time);
          ctx.fillText("exploring the omni-media vortex of space,", 294, 530 - 2*time);
          ctx.fillText("time, love, and perception.", 328, 546 - 2*time);
          ctx.fillStyle = "#fff";
          ctx.fillText("A presentation of various works-in-progress,", 270, 512 - 2*time);
          ctx.fillText("exploring the omni-media vortex of space,", 292, 528 - 2*time);
          ctx.fillText("time, love, and perception.", 326, 544 - 2*time);
          ctx.globalAlpha = 0.1;

        } else {
          //ctx.globalAlpha = 0.5;
          ctx.drawImage(can23, 0, 0, canvas.width, canvas.height);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#fff";
          ctx.font = "bold 52px Verdana";
          ctx.strokeText("The Stylogical Map", 24, 128);
        }
        
        /* GIF Recording */
        if (typeof GIFEncoder === "function") {
          /* GIF Recording */
          if (gif_time < 29) {
            if (time%6 <= 1) {
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
        }
      }

      if (gif_time < 32 && (time%6 === 0)) {
        gif_time +=  1;
        Debugger.log("GIF record time is: "+ gif_time);
      } else if (gif_time > 32) {
        gif_time = 32;
      }

      time += 1;
      if (time == "undefined") {
        time = 0;
      }
  };

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


  /* Begin draw loop */
  try {
    var context = canvas.getContext('2d');
    var videos = $('video').toArray();
    var numVids = videos.length;
    drawLoop = setInterval(draw,33,context,canvas.width,canvas.height,videos);
    Debugger.log("Draw loop started");
  } catch(e) { 
    Debugger.log("drawLoop failed to start"); 
    return;
  }
};

}}());

/* Video Playback and Draw functions */
var curr_vid = '';
var vid1w=100, vid1h=100;
var rx=3, ry=2;
var volume = 1.0;

var pause_video = function pause_video(video_id) {
  var videoA = document.getElementById(video_id);
  if (typeof videoA.pause === "function") {
    curr_vid = videoA.id;
    var vol = videoA.volume;
    vPause = setInterval(function() {
        try {
          videoA.volume = vol;
        } catch (err) {}
        if (vol > 0.0001) {
          vol -= 0.001;
          if (vol > 0.02) {
            vol -= 0.01
          }
        } else {
          videoA.volume = 0;
          if (typeof videoA.pause === "function") {
            if (typeof processing !== 'undefined') {
              processing.loop();
            }
            videoA.pause();
            vdrawing = false;
          }
          clearInterval(vPause);  
        }
      }, 33);
  }
};

var loop_video = function loop_video(video_id, loop) {
  volume_video(video_id, 1.0);
  var videoA = document.getElementById(video_id);
  var bloop = loop;
  try {
    if(curr_vid !== video_id) {
      var videoB = document.getElementById(curr_vid);
      if (typeof videoB.pause === "function") {
        videoB.pause();
     } 
    } 
  } catch(err) {}
  if (typeof videoA.play === "function") {
    curr_vid = videoA.id;
    videoA.volume = 0.0;
    var vol = 0.0001;
    vResume = setInterval(function() {
        try {
          videoA.volume = vol;
        } catch (err) {}
        if (vol < volume) {
          vol *= 2;
        } else {
          clearInterval(vResume);
        }
      }, 66);
    videoA.play();
    videoA.addEventListener('ended', function(){ 
      if (bloop !== 'true') {
        this.volume = 0;
        resumeSong();
        $("a","#player").attr({"href":"javascript:playerPause()",
                         "style":"font-variant:inherit"})[0].innerHTML = "PAUSE";
      }
      this.currentTime = 0;
    }, false);
    if (typeof processing !== 'undefined') {
      processing.noLoop();
    }
  }
};

var loop_AB = function loop_AB(video_id, t1, t2) {
  volume_video(video_id, 1.0);
  var videoA = document.getElementById(video_id); 
  if (typeof videoA.currentTime === "number") {
    curr_vid = videoA.id;
    videoA.volume = 0.0;
    var vol = 0.0001;
    vResume = setInterval(function() {
        try {
          videoA.volume = vol;
        } catch (err) {}
        if (vol < volume) {
          vol *= 2;
        } else {
          clearInterval(vResume);
        }
      }, 66);
    videoA.play();
    if (typeof processing !== 'undefined') {
      processing.noLoop();
    }
    videoA.addEventListener('ended', function(){ 
      this.volume = 0;
      this.currentTime = 0;
    }, false);
  }   
};

var mute_video = function mute_video(video_id) {
  var vid;
  volume = 0.0;

  setTimeout(function() {
    try {
      vid = document.getElementById(video_id);
      vid.volume = 0.0;
    } catch(err) {}
  }, 1000);
};

var volume_video = function volume_video(video_id, vol) {
  var vid;
  volume = vol;

  try {
    vid = document.getElementById(video_id);
    vid.volume = volume;
  } catch(err) {}
};

var set_aspect = function set_aspect(rx, ry) {
  var cv;
  try {
    cv =   $("canvas")[0];
    vid1w = cv.height * rx/ry;
    vid1h = cv.height;
    Debugger.log("Aspect set to :"+ vid1w +" x "+ vid1h);
  } catch (e) {
    Debugger.log(e);
  }
  drawVideo = function drawVideo(v,c,x,y,w,h) {
    for (var vi=0, vn=v.length; vi < vn; vi++) {
    
      if (typeof v[vi] != 'undefined') {
        if ((v[vi].readyState > 2) && (!v[vi].paused)) {
          try {
            var vx = (w/2 - vid1w/2);
            c.drawImage(v[i], vx, y, vid1w, vid1h);
            vdrawing = true;
          } catch (err) {
            Debugger.log("Failed to draw " + v[vi].id);
          } 
        } else if (!(vi > 0)) {
          c.clearRect(0, 0, w, h);
        }
      } else {
        c.fillStyle = "#000";
        c.fillRect(0, 0, w, h);
        vdrawing = false;
      }
    }
  };

};

var drawVideo = function drawVideo(v,c,x,y,w,h) {
  for (var vi=0, vn=v.length; vi < vn; vi++) {
    
    if (typeof v[vi] != 'undefined') {
      if ((v[vi].readyState > 2) && (!v[vi].paused)) {
        try {
          c.drawImage(v[vi],x,y,w,h);
          vdrawing = true;
        } catch (err) {
          Debugger.log("Failed to draw " + v[vi].id);
          vdrawing = false;
        } 
      } else if (!(vi > 0)) {
        c.clearRect(0, 0, w, h);
        vdrawing = false;
      }
    } else {
      c.fillStyle = "#000";
      c.fillRect(0, 0, w, h);
      vdrawing = false;
    }

  }
};

/* Function to link camera stream to video input */
var capVideo = function capVideo(vid_id) {

  var myVideo = document.getElementById(vid_id);

  if(navigator.getUserMedia) {
   navigator.getUserMedia("video", successCallback, errorCallback);
   return true;
  } else {
   Debugger.log("Your browser does not support Camera!");
  }
  
  function successCallback( stream ) {
   myVideo.src = stream;
  }
  
  function errorCallback( error ) {
   Debugger.log("Error: " + error.code + " !");
  }
  
   return false;
};

/* Audio Playback functions */
var start_song = "invisible10";
var curr_song = "";

function check_playSong(song_id0) {

  //stop the other songs
  if(curr_song != song_id0)
    stopAll();

  //stop video
  try {
    if (typeof document.getElementById('vid1') === "object") {
    	mute_video('vid1');
    }
    if (typeof document.getElementById('vid2') === "object") {
      mute_video('vid2');
    }
  } catch (e) {}

  if (playSong(song_id0)) {
   return true;
  } else {
    //alert("playSong did not work");
    return false;
  }
}

function stopAll() {
  stopSong(curr_song);
}

function stopSong(song_id1) {
  var songX;
  var song_lnk;

  try {
    songX = document.getElementById(song_id1);
    songX.currentTime = 0;
    songX.pause();

    song_lnk = document.getElementById(("lnk_"+song_id1));
    song_lnk.style.fontStyle = "normal";
  } catch(err) {}
}

function pauseSong() {
  var songX;

  try {
    songX = document.getElementById(curr_song);
    songX.pause();
  } catch(err) {}
}

function resumeSong() {
  var songX;
  
  try {
    songX = document.getElementById(curr_song);
    if (songX == null) {
      songX = document.getElementById('invisible01');
    }
    songX.play();
    if (songX.volume == 0) {
      for (var i = 10; i -= 1;) {
        setTimeout(raiseVolume, 30, songX);
      }
    }
  } catch(err) {  
    //var msg = "Volume stuck at " + songX.volume + "";
  }
}

function raiseVolume(song) {
  var songX = song;
  if (typeof songX.volume === "number") {
    songX.volume = songX.volume + 0.1;
  }
}

function muteSong() {
  var songX;

  try {
    songX = document.getElementById(curr_song);
    songX.volume = 0;
  } catch(err) {}
}

function playSong(song_id2) {
  if(curr_song == song_id2) { 
    var songA = document.getElementById(song_id2);
    if (typeof songA.currentTime === "number" ) {
      songA.currentTime = 0;
      songA.play();
      return true;
    }
    //alert("curr_song could not start");
    return false;
  }
  else {
    curr_song = song_id2;
    var songA = document.getElementById(song_id2);
    if (typeof songA.play === "function") {
      songA.play();
      return true;
    }
    return false;
  }
}

function jogSong(song_id3, stime) { 
  var songJ = document.getElementById(song_id3);
  ct = songJ.currentTime;
  try {
    songJ.currentTime = stime;
    curr_song = songJ.id;
  } catch (err) {
    songJ.currentTime = ct;
  }
}

/* Audio/Video Interface (player) */
function playerPause() {
  pauseSong();
  $("a","#player").attr({"href":"javascript:playerResume()",
                         "style":"font-variant:inherit"})[0].innerHTML = "PLAY";
}

function playerResume() {
  resumeSong();
  $("a","#player").attr({"href":"javascript:playerPause()",
                         "style":"font-variant:inherit"})[0].innerHTML = "PAUSE";
}

function playerPauseVid() {
  pause_video(curr_vid);
  pauseSong();
  $("a","#player").attr({"href":"javascript:playerResumeVid()",
                         "style":"font-variant:inherit"})[0].innerHTML = "PLAY";
}

function playerResumeVid() {
  loop_video(curr_vid,'false');
  pauseSong();
  $("a","#player").attr({"href":"javascript:playerPauseVid()",
                         "style":"font-variant:inherit"})[0].innerHTML = "PAUSE";
}

/* Scroller functions */
var ie_period = "";

var post_scroller = {
    post_head : document.createElement("h1"),
    post_body : document.createElement("div"),
    link_next: "",
    link_prev: "",
    head_cache: "",
    post_span: "",
    t_margin: -260,
    s_margin: -76,
    s_indent: 644,
    s_delta: 3,
    s_period: 33,
    click_div: $("<div id='click_div'><span>Click Post title to activate Viewer</span></div>"),

    scrollAux: function (cdv) {
      cdv.fadeIn().fadeTo(1000, 1).fadeOut();
    },

    scrollInterval: function() {
      this.s_indent = this.s_indent;
    },

    pauseScroll: function() {
      this.t_margin = this.t_margin;
    },

    startScroll: function() {
    window.location.hash = "#header-canvas";
    clearInterval(this.scrollAux);
    $('#click_div').css('display','none');
    this.startScroll = function () {
      if (typeof processing !== 'undefined') {
        this.t_margin = 0;
        this.s_margin = 184;
      }
      this.post_head.children[0].href = "javascript:post_scroller.stopScroll()";
      var main_div = document.getElementById("main");
      var main_doc = document.getElementById("main");
      //main_doc.style.overflow = "hidden";
      var aspan = document.createElement("span");
      aspan.innerHTML = this.post_span;
      aspan.style.marginLeft = (post_scroller.s_indent+"px");
      aspan.style.fontWeight = "600";
      aspan.style.fontSize = "1em";
      aspan.style.position = "relative";
      this.post_head.appendChild(aspan);
      var m = post_scroller.t_margin-1;
      this.scrollInterval = setInterval(function() {
        aspan.style.marginLeft = (post_scroller.s_indent+"px");
        post_scroller.s_indent -= post_scroller.s_delta;
        if ((post_scroller.s_indent/12) < -post_scroller.post_span.length) {
          post_scroller.s_indent = 644;
        }
        if (m < post_scroller.s_margin-56) {
          m += 2;
          main_div.style.marginTop = m+"px";
          main_doc.style.height = (-32-m)*4+"px";
        }
        else {
          if (typeof processing !== 'undefined') {
            main_div.style.marginTop = (post_scroller.s_margin-64)+"px";
            main_doc.style.height = "64px";
          } else {
            main_div.style.marginTop = post_scroller.s_margin+"px";
            main_doc.style.height = -post_scroller.s_margin+"px";
          }
        }
      }, post_scroller.s_period);
      if (typeof processing !== 'undefined' && typeof processing.mousePressed === "function") {
        processing.mousePressed();
      }
      if (typeof $('#vid1')[0] === "object") {
        if ( !('ontouchmove' in document.createElement('div')))  {
          loop_video('vid1','false');
          pauseSong();
          $("a","#player").attr({"href":"javascript:playerPauseVid()",
                         "style":"font-variant:inherit"})[0].innerHTML = "PAUSE";
        } else {
          $('#canvas_iframe').css('display','block');
          playerPause();
        }
      }
    };
    this.startScroll();
    },

    stopScroll: function() {
      if (typeof processing !== 'undefined') {
        this.t_margin = 0;
        this.s_margin = -56;
      }
      this.post_head.children[0].href = "javascript:post_scroller.startScroll()";
      var main_div = document.getElementById("main");
      var main_doc = document.getElementById("main");
      this.post_head.removeChild(this.post_head.children[1]);
      clearInterval(this.scrollInterval);
      var m = post_scroller.s_margin;
      this.pauseScroll = setInterval(function() {
        if (m > post_scroller.t_margin) {
          m -= 4;
          main_div.style.marginTop = m+"px";
          main_doc.style.height = -m+"px";
        }
        else {
          main_div.style.marginTop = post_scroller.t_margin+"px";
          main_doc.style.height = "";
          clearInterval(post_scroller.pauseScroll);
        }
      }, post_scroller.s_period/2);
      if (typeof processing !== 'undefined' && typeof processing.mousePressed === "function") {
        processing.mousePressed();
      }
      if (typeof $('#vid1')[0] === "object") {
        if ( !('ontouchmove' in document.createElement('div')))  {
          pause_video('vid1');
          resumeSong();
          $("a","#player").attr({"href":"javascript:playerPause()",
                         "style":"font-variant:inherit"})[0].innerHTML = "PAUSE";
        }
      }
    },

    getDivText: function (adiv) {
      var span_text = "";

      if (typeof adiv.children.length != "number") {
        span_text = span_text + adiv.innerHTML;
        return span_text.replace(/(\r\n|\n|\r)/gm," ");
      }

      var spc = document.createElement('span');
      spc.innerHTML="&nbsp;/&nbsp;";
      var arep = document.createElement('span');
      var elp = document.createElement('span');
      elp.innerHTML="&nbsp;...&nbsp;";
        
      for (var i = adiv.children.length; i > 0; i -= 1) {
        var child = adiv.children[(i-1)];
        try {
          switch (child.tagName) {
          case "BR":
            adiv.replaceChild(spc.cloneNode(true),child);
            break;
          case "br":
            adiv.replaceChild(spc.cloneNode(true),child);
            break;
          case "TABLE":
            adiv.replaceChild(elp.cloneNode(true),child);
            break;
          case "table":
            adiv.replaceChild(elp.cloneNode(true),child);
            break;
          case "DIV":
            if (child.id === "stream") {
              adiv.removeChild(child);
            } else {
              var innerdiv = this.getDivText(child);
              span_text = "&nbsp;" + innerdiv + "&nbsp;" + span_text;
              adiv.removeChild(child);
            }
            break;
          case "div":
            if (child.id === "stream") {
              adiv.removeChild(child);
            } else {
              var innerdiv = this.getDivText(child);
              //console.log(innerdiv);
              span_text = "&nbsp;" + innerdiv + "&nbsp;" + span_text;
              adiv.removeChild(child);
            }
            break;
          case "H1":
            child.appendChild(spc.cloneNode(true));
            var innerdiv = this.getDivText(child);
            //console.log(innerdiv);
            span_text = "&nbsp;" + innerdiv + span_text;
            adiv.removeChild(child);
            break;
          case "h1":
            child.appendChild(spc.cloneNode(true));
            var innerdiv = this.getDivText(child);
            //console.log(innerdiv);
            //span_text = "&nbsp;" + innerdiv + span_text;
            adiv.removeChild(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild( arep.cloneNode(true) );
            break;
          case "H2":
            child.appendChild(spc.cloneNode(true));
            var innerdiv = this.getDivText(child);
            //console.log(innerdiv);
            //span_text = "&nbsp;" + innerdiv + span_text;
            adiv.removeChild(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild( arep.cloneNode(true) );
            break;
          case "h2":
            child.appendChild(spc.cloneNode(true));
            var innerdiv = this.getDivText(child);
            //console.log(innerdiv);
            //span_text = "&nbsp;" + innerdiv + span_text;
            adiv.removeChild(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild( arep.cloneNode(true) );
            break;
          case "H3":
            child.appendChild(spc.cloneNode(true));
            var innerdiv = this.getDivText(child);
            //console.log(innerdiv);
            //span_text = "&nbsp;" + innerdiv + span_text;
            adiv.removeChild(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild( arep.cloneNode(true) );
            break;
          case "h3":
            child.appendChild(spc.cloneNode(true));
            var innerdiv = this.getDivText(child);
            //console.log(innerdiv);
            //span_text = "&nbsp;" + innerdiv + span_text;
            adiv.removeChild(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild( arep.cloneNode(true) );
            break;
          case "H4":
            child.appendChild(spc.cloneNode(true));
            var innerdiv = this.getDivText(child);
            //span_text = "&nbsp;" + innerdiv + span_text;
            adiv.removeChild(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild( arep.cloneNode(true) );
            break;
          case "h4":
            child.appendChild(spc.cloneNode(true));
            var innerdiv = this.getDivText(child);
            //console.log(innerdiv);
            //span_text = "&nbsp;" + innerdiv + span_text;
            adiv.removeChild(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild( arep.cloneNode(true) );
            break;
          case "H5":
            child.appendChild(spc.cloneNode(true));
            var innerdiv = this.getDivText(child);
            //console.log(innerdiv);
            //span_text = "&nbsp;" + innerdiv + span_text;
            adiv.removeChild(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild( arep.cloneNode(true) );
            break;
          case "h5":
            child.appendChild(spc.cloneNode(true));
            var innerdiv = this.getDivText(child);
            //console.log(innerdiv);
            //span_text = "&nbsp;" + innerdiv + span_text;
            adiv.removeChild(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild( arep.cloneNode(true) );
            break;
          case "P":
            child.appendChild(spc.cloneNode(true));
            var innerdiv = this.getDivText(child);
            //console.log(innerdiv);
            span_text = "&nbsp;" + innerdiv + span_text;
            adiv.removeChild(child);
            break;
          case "p":
            child.appendChild(spc.cloneNode(true));
            var innerdiv = this.getDivText(child);
            //console.log(innerdiv);
            span_text = "&nbsp;" + innerdiv + span_text;
            adiv.removeChild(child);
            break;
          case "EM":
            child.appendChild(spc.cloneNode(true));
            var innerdiv = this.getDivText(child);
            //console.log(innerdiv);
            span_text = "&nbsp;" + innerdiv + span_text;
            adiv.removeChild(child);
            break;
          case "em":
            child.appendChild(spc.cloneNode(true));
            var innerdiv = this.getDivText(child);
            //console.log(innerdiv);
            span_text = "&nbsp;" + innerdiv + span_text;
            adiv.removeChild(child);
            break;
          case "A":
            var innerdiv = this.getDivText(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild($(arep.cloneNode(true)).css({color:"#FFF",fontSize:"1.2em"})[0],child);
            break;
          case "a":
            var innerdiv = this.getDivText(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild($(arep.cloneNode(true)).css({color:"#FFF",fontSize:"1.2em"})[0],child);
            break;
          case "EM":
            var innerdiv = this.getDivText(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild($(arep.cloneNode(true)).css({color:"#FFF",fontSize:"1.2em"})[0],child);
            break;
          case "em":
            var innerdiv = this.getDivText(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild($(arep.cloneNode(true)).css({color:"#FFF",fontSize:"1.2em"})[0],child);
            break;
          case "BLOCKQUOTE":
            var innerdiv = this.getDivText(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild($(arep.cloneNode(true)).css({color:"#FA3",fontSize:"1.2em"})[0],child);
            break;
          case "blockquote":
            var innerdiv = this.getDivText(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild($(arep.cloneNode(true)).css({color:"#FA3",fontSize:"1.2em"})[0],child);
            break;
          case "CODE":
            var innerdiv = this.getDivText(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild($(arep.cloneNode(true)).css("color","#FF3")[0],child);
            break;
          case "code":
            var innerdiv = this.getDivText(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild($(arep.cloneNode(true)).css("color","#FF3")[0],child);
            break;
          case "PRE":
            var innerdiv = this.getDivText(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild($(arep.cloneNode(true)).css("color","#FF3")[0],child);
            break;
          case "pre":
            var innerdiv = this.getDivText(child);
            arep.innerHTML = innerdiv;
            adiv.replaceChild($(arep.cloneNode(true)).css("color","#FF3")[0],child);
            break;
          case "SCRIPT":
            adiv.removeChild(child);
            break;
          case "script":
            adiv.removeChild(child);
            break;
          case "IMG":
            adiv.removeChild(child);
            break;
          case "img":
            adiv.removeChild(child);
            break;
          case "OBJECT":
            adiv.removeChild(child);
            break;
          case "object":
            adiv.removeChild(child);
            break;
          case "EMBED":
            adiv.removeChild(child);
            break;
          case "embed":
            adiv.removeChild(child);
            break;
          case "AUDIO":
            adiv.removeChild(child);
            break;
          case "audio":
            adiv.removeChild(child);
            break;
          case "VIDEO":
            adiv.removeChild(child);
            break;
          case "video":
            adiv.removeChild(child);
            break;
          default:
            adiv.removeChild(child);
            break;
          }
        } catch (e) {};
      }
      if ( adiv.innerHTML != "" ) {
        span_text = span_text + adiv.innerHTML;
      }
      var nr = /\n\r/gm;
      var rn = /\r\n/gm;
      var r = /\r/gm;
      var n = /\n/gm;
      span_text = span_text.replace(nr,"&nbsp;");
      span_text = span_text.replace(rn,"&nbsp;");
      span_text = span_text.replace(r,"&nbsp;");
      span_text = span_text.replace(n,"&nbsp;");
      return span_text;
    },
    
    init: function (shead, sbody) {
      if (typeof shead !== "string")
        shead = '.post-title, .entry-title';
      if (typeof sbody !== "srting")
        sbody = '.post-body, .entry-content';
      this.post_head = $(shead)[0];
      this.post_body = $(sbody)[0].cloneNode(true);
      this.head_cache = this.post_head.innerHTML;
      this.post_head.style.whiteSpace = "nowrap";
      this.post_head.id = "scroll-head";
      if (typeof this.post_head.children[0] !== "object") {
        var temp_title = this.post_head.innerHTML;
        this.post_head.innerHTML = "";
        this.post_head.appendChild(document.createElement("a"));
        this.post_head.children[0].innerHTML = temp_title;
      }
      this.post_head.children[0].href = "javascript:post_scroller.startScroll()";
      this.post_span = this.getDivText(this.post_body);
      var post_nav = $("div#postnavlinks")[0];
      if (typeof ie_period === "number")
        this.s_period = ie_period;
      if (typeof $('.blog-pager-newer-link')[0] === "object") {
        this.link_next = ($('.blog-pager-newer-link')[0].href);
        var p = document.createElement("p");
        var a = document.createElement("a");
        p.setAttribute("class","menulinkleft");
        a.href = this.link_next;
        a.innerHTML = "&lt;";
        a.setAttribute("font-weight", "bold");
        a.setAttribute("font-size","1em");
        p.appendChild(a);
        $(post_nav).append(p);
      }
      if (typeof $('.blog-pager-older-link')[0] === "object") {
        this.link_prev = ($('.blog-pager-older-link')[0].href);
        var p = document.createElement("p");
        var a = document.createElement("a");
        p.setAttribute("class","menulinkright");
        a.href = this.link_prev;
        a.innerHTML = "&gt;";
        a.setAttribute("font-weight", "bold");
        a.setAttribute("font-size","1em");
        p.appendChild(a);
        $(post_nav).append(p);
      }
      $('canvas#cv').after(this.click_div);
       var cdv = $('#click_div');
      this.scrollAux = setInterval(this.scrollAux, 3000, cdv);
      return this;
    }
};
