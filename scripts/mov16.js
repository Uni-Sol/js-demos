var data=0, pc=0;

var value = function r(d) {
 	var p = 32 -(r.pc*8+16);
	if (d) data = ( data<<(r.pc*8)>>>(r.pc*8) ) + ( d<<(r.pc*8) );
 	return ( ( data<<p )>>>( p ) )>>>( r.pc*8 );
};

var result = function r(d) {
	var p = 32 -(r.pc*8+16);
	if (d) data = ( data<<(r.pc*8)>>>(r.pc*8) ) + ( d<<(r.pc*8) );
	return ( ( data<<p )>>>( p ) )>>>( r.pc*8 );
};

function mov16( pc, value, result ) {
	console.log("Program Counter: "+ pc +"\n");

	value.pc = pc;
	pc += 2;
  
	console.log("VALUE: "+ value()  +" at Offset:"+ value.pc +"\n");
	console.log("Program Counter: "+ pc +"\n");

	result.pc = pc;
	pc += 2;
  
	console.log("RESULT: "+ result() +" at Offset:"+ result.pc +"\n");
	console.log("Program Counter: "+ pc +"\n");

	console.log("Moving 16b value \n");
	result(value());
  
	console.log("VALUE: "+ value()  +" at Offset:"+ value.pc +"\n");
	console.log("RESULT: "+ result() +" at Offset:"+ result.pc +"\n");
  
	return pc;
}

/* Initiliaze based on whether in Node of Cliet-sided JS environment */
if ( (typeof process !== 'undefined') && (process.argv[2]) ) {
	/* The process object is Node specific */
	data=( (data<<16) + process.argv[2] );
	console.log( "DATA: "+ data +"\n" );
	pc = mov16( pc, value, result );
	console.log( "DATA: "+ data +"\n" );

} else if (typeof process !== 'undefined') { 
	/* If in Node, but no argument was provided */
	console.log( "Please provide an int argument as input data.\n" );

} else if (typeof window !== 'undefined') {
	/* Not in Node, but in browser, with Client-side methods */
    var prev = getCookie( 'mov16' );
	if( prev ) {
		data = confirm("Use previous data?")? prev : prompt( "Please provide an int argument as input data.\n" );
	} else data = prompt( "Please provide an int argument as input data.\n" );
	if (typeof console === "undefined")
      window.console = {
	    log: function(msg) {
			document.write( msg +"<br />");
		}
	};
 	console.log( "DATA: "+ data +"\n" );
  	pc = mov16( pc, value, result );
  	console.log( "DATA: "+ data +"\n" );
	storeToCookie( data );
}

function storeToCookie( d ) {
	/* Try cookies only if in Client-side browser environment */
	var name = 'mov16',
		value = d,
		days = 1,
		expires = '',
		date = new Date();

	date.setTime( date.getTime() + (days*24*60*60*1000) );
	expires = '; expires='+ date.toGMTString();
	document.cookie = name +'='+ value + expires +'; path=/js-demos';
}

function getCookie() {
	var results = document.cookie.match( 'mov16=(.*?)(;|$)' );
	if( results ) {
		return( unescape( results[1] ) );
	} else return null; 
}
