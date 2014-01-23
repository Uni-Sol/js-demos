/* range2.js
 * Quoted from 'JavaScript Pocket Reference' by David Flanagan, O'Reilly 2012
 *
 * This is a contructor function that initializes new Range objects. Note that the  
 * function does not create or return an object. It just initializes 'this'
 *
 * REV EDIT:
 * I'm defining the prototype property from within the Range function declaration,
 * just to make sure that works. If so, it seems like a cleaner class definition.
 * DOES NOT WORK, so apparently, defining a prototype prop is a bad idea because 
 * this object ALREADY exists and the constructor process overwrites any prototype 
 * that is defined within the constructor funciton. Rather, I will attempt to add
 * methods/properties to this previously generated prototype object... WORKS
 * END EDIT
 *
 */

function Range( from, to ) {
	
	/* Store the start and end points (state) of this new range object.
     * These are non-inherited properties that are unique to this object.
	 * REV EDIT:
	 * Be sure to use 'this' in all var references within prototype
	 * methods because without that term, the method/function may
	 * use the value that is stored in a property of the prototype 
	 * (CLASS) rather than the value stored in the INSTANCE property
	 * END EDIT
	 */
	this.from = from;
	this.to = to;
	
	/* All Range objects inherit methods & props from Range.prototype. */
	Range.prototype.includes = function(x) {
		/* Return true if x is in the range, false otherwise */
		return ( this.from <= x && x <= this.to );
	};
	Range.prototype.foreach = function( func, arg1 ) {
		/* Invoke func once for each integer in the range */
		for(var val=Math.ceil(this.from); val<=this.to; val++) 
			func(val, arg1);
	};
	/* 'this' refers to Range.prototype in this context */
	this.toString = function() {
		/* Retrun a string representation of the range */
		return "("+ this.from +"..."+ this.to +")";
	};
}

1;