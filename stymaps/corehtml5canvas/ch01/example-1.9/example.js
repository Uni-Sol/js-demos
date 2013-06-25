/*
 * Copyright (C) 2012 David Geary. This code is from the book
 * Core HTML5 Canvas, published by Prentice-Hall in 2012.
 *
 * Edits by Revlin John
 * Contact: stylogicalmaps@gmail.com
 * Website: stymaps.universalsoldier.ca
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
    rubberbandDiv = document.getElementById('rubberbandDiv'),
    resetButton = document.getElementById('resetButton'),
    image = new Image(),
    mousedown = {},
    rubberbandRectangle = {},
    dragging = false;

  /* REV EDIT:
   * Get canvas properties 
   */
  var win = window,
      mouse_x, mouse_y,
      cv = canvas,
      context = canvas.getContext('2d'),
      bb = canvas.getBoundingClientRect(),
      cv_w = (canvas.width/bb.width),
      cv_h = (canvas.height/bb.height),
      cv_pos = { top: bb.top, left: bb.left };
  win.scrollTo(bb.left, bb.top);
  /* END EDIT */

// Functions.....................................................

function rubberbandStart(x, y) {
	mousedown.x = x;
	mousedown.y = y;

	rubberbandRectangle.left = mousedown.x;
	rubberbandRectangle.top = mousedown.y;

   moveRubberbandDiv();
   showRubberbandDiv();

	dragging = true;
}

function rubberbandStretch(x, y) {
   rubberbandRectangle.left = x < mousedown.x ? x : mousedown.x;
   rubberbandRectangle.top  = y < mousedown.y ? y : mousedown.y;

   rubberbandRectangle.width  = Math.abs(x - mousedown.x),
   rubberbandRectangle.height = Math.abs(y - mousedown.y);

   moveRubberbandDiv();
   resizeRubberbandDiv();
};

function rubberbandEnd() {
   var bbox = canvas.getBoundingClientRect();

   try {
      context.drawImage(canvas,
                        rubberbandRectangle.left - bbox.left,
                        rubberbandRectangle.top - bbox.top,
                        rubberbandRectangle.width,
                        rubberbandRectangle.height,
                        0, 0, canvas.width, canvas.height);
   }
   catch (e) {
     /* REV EDIT:
      * Optional alert shows stats when rubberband redraw fails
      */
     //alert( " Redraw failed: "+ e.message +"\n Rubberband dimensions: \n"+ JSON.stringify(rubberbandRectangle) );
     /* END EDIT */
    
      // suppress error message when mouse is released
      // outside the canvas
   }

   resetRubberbandRectangle();

   rubberbandDiv.style.width = 0;
   rubberbandDiv.style.height = 0;

   hideRubberbandDiv();

   dragging = false;
}

function moveRubberbandDiv() {
   rubberbandDiv.style.top  = rubberbandRectangle.top  + 'px';
   rubberbandDiv.style.left = rubberbandRectangle.left + 'px';
}

function resizeRubberbandDiv() {
   rubberbandDiv.style.width  = rubberbandRectangle.width  + 'px';
   rubberbandDiv.style.height = rubberbandRectangle.height + 'px';
}

function showRubberbandDiv() {
   rubberbandDiv.style.display = 'inline';
}

function hideRubberbandDiv() {
   rubberbandDiv.style.display = 'none';
}

function resetRubberbandRectangle() {
   rubberbandRectangle = { top: 0, left: 0, width: 0, height: 0 };
}

// Event handlers...............................................

/* REV EDIT:
 * Added event handlers for devices with touch screens
 */

if ('ontouchend' in document.createElement('div'))  {
  canvas.ontouchstart = function(e){
    mouse_x = (event.touches[0].clientX + win.pageXOffset) * cv_w;
    mouse_y = (event.touches[0].clientY + win.pageYOffset) * cv_h;
  
    var x = mouse_x,
         y = mouse_y;

    e.preventDefault();
    rubberbandStart(x, y);
  };

  canvas.ontouchmove = function (e) { 
    mouse_x = (event.touches[0].clientX + win.pageXOffset) * cv_w;
    mouse_y = (event.touches[0].clientY + win.pageYOffset) * cv_h;
  
    var x = mouse_x,
         y = mouse_y;

    e.preventDefault();
    if (dragging) {
      rubberbandStretch(x, y);
    }
  };

  canvas.ontouchend = function (e) {
    e.preventDefault();
    rubberbandEnd();
  };

}
/* END EDIT */

  canvas.onmousedown = function (e) { 
    var x = e.x || e.clientX,
         y = e.y || e.clientY;

    e.preventDefault();
    rubberbandStart(x, y);
  };

  window.onmousemove = function (e) { 
    var x = e.x || e.clientX,
           y = e.y || e.clientY;

    e.preventDefault();
    if (dragging) {
      rubberbandStretch(x, y);
    }
  };

  window.onmouseup = function (e) {
    e.preventDefault();
    rubberbandEnd();
  };

// Event handlers..............................................
   
image.onload = function () { 
	context.drawImage(image, 0, 0, canvas.width, canvas.height); 
};

resetButton.onclick = function(e) {
   context.clearRect(0, 0, context.canvas.width,
                            context.canvas.height);
   context.drawImage(image, 0, 0, canvas.width, canvas.height);
};

// Initialization..............................................

image.src = '../../shared/images/arch.png';
