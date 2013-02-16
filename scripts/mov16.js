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

if ( (typeof process !== 'undefined') && (process.argv[2]) ) {
  data=( (data<<16) + process.argv[2] );
  console.log( "DATA: "+ data +"\n" );
  pc = mov16( pc, value, result );
  console.log( "DATA: "+ data +"\n" );
} else if (typeof process !== 'undefined') { 
  console.log( "Please provide an int argument as input data.\n" );
} else if (typeof window !== 'undefined') {
  data = prompt( "Please provide an int argument as input data.\n" );
  if (typeof console === "undefined")
    window.console = {
	    log: function(msg) {
			alert(msg);
		}
	};
  console.log( "DATA: "+ data +"\n" );
  pc = mov16( pc, value, result );
  console.log( "DATA: "+ data +"\n" );
}


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
