function canvasApp( canvas ) {
try {
    var buffer = document.createElement("canvas");
    var ctx = buffer.getContext("2d");
    
    buffer.width = canvas.width;
    buffer.height = canvas.height;
    alert( buffer );
    
} catch(e) { alert( e.stack ); }
}
