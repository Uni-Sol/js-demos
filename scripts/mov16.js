var data=0, pc=0;

var value = function v() {
  var p = 32 -(v.pc*8+16);
  return ( ( data<<p )>>>( p ) )>>>( v.pc*8 );
};

var result = function r(d) {
  var p = 32 -(r.pc*8+16);
  if (d) data = ( data<<(r.pc*8)>>>(r.pc*8) ) + ( d<<(r.pc*8) );
  return ( ( data<<p )>>>( p ) )>>>( r.pc*8 );
};

if ( (process) && (process.argv[2]) ) {
  data=( (data<<16) + process.argv[2] );
  console.log("Value: "+ value()  +"\n");
  pc = mov16( pc, value, result );
  console.log("Result: "+ result() +"\n");
  console.log("Program Counter: "+ pc +"\n");
}

function mov16( pc, value, result ) {

  value.pc = pc;
  pc += 2;

  result.pc = pc;
  pc += 2;

  result(value());
  
  return pc;
}
