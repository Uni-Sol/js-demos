/*
 * Copyright (C) 2012 David Geary. This code is from the book
 * Core HTML5 Canvas, published by Prentice-Hall in 2012.
 *
 * License:
 *
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * The Software may not be used to create training material of any sort,
 * including courses, books, instructional videos, presentations, etc.
 * without the express written consent of David Geary.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
*/

var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    snapshotButton = document.getElementById('snapshotButton'),
    snapshotImageElement = document.getElementById('snapshotImageElement'),
    FONT_HEIGHT = 15,
    MARGIN = 35,
    HAND_TRUNCATION = canvas.width/25,
    HOUR_HAND_TRUNCATION = canvas.width/10,
    NUMERAL_SPACING = 20,
    RADIUS = canvas.width/2 - MARGIN,
    HAND_RADIUS = RADIUS + NUMERAL_SPACING,
    loop;

  /* REV EDIT:
   * Get canvas properties 
   * Scroll canvas into full view
   */
  var win = window,
      mouse_x, mouse_y,
      cv = canvas,
      context = canvas.getContext('2d'),
      bb = canvas.getBoundingClientRect(),
      ib = snapshotImageElement.getBoundingClientRect(),
      cv_w = (canvas.width/bb.width),
      cv_h = (canvas.height/bb.height),
      cv_pos = { top: bb.top, left: bb.left },  
      spinner = document.getElementById('spinner');
  win.scrollTo(bb.left, bb.top);
  /* The next 2 lines are a js spinning loader by fgnass : https://gist.github.com/998900 */ 
  document.head.insertAdjacentHTML( 'afterbegin', '<style type="text/css"> #spinner { position: relative; font-size: 22px; display: none; } #spinner b { position:absolute } #spinner b.b0 { top:00px; left:20px } #spinner b.b1 { top:03px; left:27px } #spinner b.b2 { top:10px; left:30px } #spinner b.b3 { top:17px; left:27px } #spinner b.b4 { top:20px; left:20px } #spinner b.b5 { top:17px; left:13px } #spinner b.b6 { top:10px; left:09px } #spinner b.b7 { top:03px; left:13px } #spinner b.o0 { opacity: 0.8 } #spinner b.o1 { opacity: 0.7 } #spinner b.o2 { opacity: 0.6 } #spinner b.o3 { opacity: 0.5 } #spinner b.o4 { opacity: 0.4 } #spinner b.o5 { opacity: 0.3 } #spinner b.o6 { opacity: 0.2 } #spinner b.o7 { opacity: 0.1 } </style> <!--[if lte IE 8]> <style type="text/css"> #spinner .o0 { color: #666 } #spinner .o1 { color: #777 } #spinner .o2 { color: #888 } #spinner .o3 { color: #999 } #spinner .o4 { color: #aaa } #spinner .o5 { color: #ccc } #spinner .o6 { color: #ddd } #spinner .o7 { color: #eee } </style> <![endif]-->');
  ( function(a,b,c){ setInterval( function(){for(b=0;b<8;c||(a.innerHTML+='<b>•'),a.childNodes[b].className='b'+b+' o'+(++b-~c)%8);c=-~c}, 99 ); })( spinner );
  /* END EDIT */

// Functions.....................................................

function drawCircle() {
   context.beginPath();
   context.arc(canvas.width/2, canvas.height/2, RADIUS, 0, Math.PI*2, true);
   context.stroke();
}
   
function drawNumerals() {
   var numerals = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
       angle = 0,
       numeralWidth = 0;

   numerals.forEach(function(numeral) {
      angle = Math.PI/6 * (numeral-3);
      numeralWidth = context.measureText(numeral).width;
      context.fillText(numeral, 
         canvas.width/2  + Math.cos(angle)*(HAND_RADIUS) - numeralWidth/2,
         canvas.height/2 + Math.sin(angle)*(HAND_RADIUS) + FONT_HEIGHT/3);
   });
}

function drawCenter() {
   context.beginPath();
   context.arc(canvas.width/2, canvas.height/2, 5, 0, Math.PI*2, true);
   context.fill();
}

function drawHand(loc, isHour) {
   var angle = (Math.PI*2) * (loc/60) - Math.PI/2,
       handRadius = isHour ? RADIUS-HAND_TRUNCATION-HOUR_HAND_TRUNCATION 
                           : RADIUS-HAND_TRUNCATION;

   context.moveTo(canvas.width/2, canvas.height/2);
   context.lineTo(canvas.width/2  + Math.cos(angle)*handRadius, 
                  canvas.height/2 + Math.sin(angle)*handRadius);
   context.stroke();
}

function drawHands() {
   var date = new Date,
       hour = date.getHours();
   hour = hour > 12 ? hour - 12 : hour;
   drawHand(hour*5 + (date.getMinutes()/60)*5, true, 0.5);
   drawHand(date.getMinutes(), false, 0.5);
   drawHand(date.getSeconds(), false, 0.2);
}

function drawClock() {
   context.clearRect(0,0,canvas.width,canvas.height);

   context.save();

   context.fillStyle = 'rgba(255,255,255,0.8)';
   context.fillRect(0, 0, canvas.width, canvas.height);

   drawCircle();
   drawCenter();
   drawHands();

   context.restore();

   drawNumerals();
}

// Event handlers................................................

snapshotButton.onclick = function (e) {
  var dataUrl;

  /* REV EDIT:
   * Integrate browser history so we can use Back and Forward.
   * Many versions of Android browser do not support toDataURL()
   * so we need to use an external library to encode canvas to an
   * image file format. We have some options here, so in this app we 
   * will use a png exporter library, called todataurl-png-js ( by Hans 
   * Schmucker - http://code.google.com/p/todataurl-png-js/ ).
   */
  if (snapshotButton.value === 'Take snapshot') {
      spinner.style.display = 'block';
      /* Save the app's current state */
      win.location = "#snapshotImageElement";
      /* toDataURL() is implemented with todataurl-png-js */
      dataUrl = canvas.toDataURL();
      snapshotImageElement.src = dataUrl;
      setTimeout( function () {
        spinner.style.display = 'none';
        ib = snapshotImageElement.getBoundingClientRect();
        win.scrollTo( ib.left, ib.top);
      }, 100);

  } else {
      /* Return app's to previous state */
      win.history.back();
      setTimeout( function () {
        win.scrollTo(bb.left, bb.top);
      }, 100);

  }
};

window.onhashchange = function(e) {

  if (! location.hash ) {
    loop = setInterval(drawClock, 1000); 
    snapshotImageElement.style.display = 'none';
    canvas.style.display = 'block';
    snapshotButton.value = 'Take snapshot';
    e.preventDefault();

  } else if ( location.hash === '#snapshotImageElement' ) {
    clearInterval(loop);
    canvas.style.display = 'none';
    snapshotImageElement.style.display = 'block';
    snapshotButton.value = 'Return to Canvas';
    e.preventDefault();

  }
};
/* END EDIT */

// Initialization................................................

context.font = FONT_HEIGHT + 'px Arial';
loop = setInterval(drawClock, 1000);
