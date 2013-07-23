"use strict";

/* Debugger Function */
var Debugger = function Debugger() {};

Debugger.on = false;

Debugger.log = function (m) {
  if(Debugger.on)
	try {
		console.log(m +"\n"); 
	} catch (e) {
		//alert(m);
	}
};

Debugger.typeOf = function (v) {
  return typeof v;
};

Debugger.profile = {
	time1: 0,
	time2: 0
};

Debugger.profile.start = function() {
	this.time1 = (new Date).getTime();	
	return this.time1;
};

Debugger.profile.stop = function() {
	this.time2 = (new Date).getTime();	
	return ( this.time2 - this.time1 );
};


/* BEWARE USE of the following function because it
 * WILL CLEAR user editable values like form inputs....
 * function inspect(obj) by Ariel Tapia 
 * http://www.codeproject.com/Articles/24549/How-to-Inspect-a-JavaScript-Object
 */
Debugger.inspect = function inspect(obj, maxLevels, level) { 

  var str = '', type, msg;

  // Start Input Validations 
  // Don't touch, we start iterating at level zero 
  if (level == null) {
    level = 0;
  }

  // At least you want to show the first level 
  if(maxLevels == null) {
    maxLevels = 1; 
  }
  if (maxLevels < 1) {
    return '<font color="red">Error: Levels number must be > 0</font>';
  }

  // We start with a non null object 
  if (obj == null) {
    return '<font color="red">Error: Object <b>NULL</b></font>'; 
  }
  // End Input Validations

  // Each Iteration must be indented 
  str += '<ul>';

  // Start iterations for all objects in obj 
  for(property in obj) { 
    try { 
      // Show "property" and "type property" 
      type = typeof(obj[property]); 
      str += '<li>(' + type + ') ' + property + ( (obj[property]==null)?(' : <b>null</b>'):(' : '+ obj[property])) + '</li>';

      // We keep iterating if this property is an Object, non null 
      // and we are inside the required number of levels 
      if ((type == 'object') && (obj[property] != null) && (level+1 < maxLevels)) {
        str += inspect(obj[property], maxLevels, level+1); 
      }
    } catch(err) { 
      // Is there some properties in obj we cannot access? Print it red. 
      if (typeof(err) == 'string' ) {
        msg = err; 
      } else if (err.message) {
        msg = err.message; 
      } else if (err.description) { 
        msg = err.description; 
      } else {
        msg = 'Unknown';
      }
      str += '<li><font color="red">(Error) ' + property + ': ' + msg +'</font></li>'; 
    } 
  }
  // Close indent 
  str += '</ul>';
  return str; 

};
