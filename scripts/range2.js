/* range2.js
 * Quoted from 'JavaScript Pocket Reference' by David Flanagan, O'Reilly 2012
 *
 * This is a contructor function that initializes new Range objects. Note that the  
 * function does not create or return an object. It just initializes 'this'
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
	 * There are some inconsistencies with using properties of 'this'
	 * within the class methods defined below, so instead duplicate
	 * variables are defined, which will be directly accessible in the 
	 * methods without resorting to the 'this.var' form.
	 * END EDIT
	 */
	var from = this.from = from,
		to = this.to = to;
	
	/* All Range objects inherit methods & props from Range.prototype. */
	Range.prototype.includes = function(x) {
		/* Return true if x is in the range, false otherwise */
		return ( from <= x && x <= to );
	};
	Range.prototype.foreach = function( f, a ) {
		/* Invoke f once for each integer in the range */
		for(var x=Math.ceil(from); x<=to; x++) f(x,a);
	};
	Range.prototype.toString = function() {
		/* Retrun a string representation of the range */
		return "("+ from +"..."+ to +")";
	};
}

1;