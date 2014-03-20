var DEG = Math.PI/180;
var b1, b2, c1, c2,     // colors
    bg1, cg1, cg2;      // CanvasGradients

var a1=255, a2=0, a3=204, a4=102, a5=153; // for some animated fun later...
var bg2, cg3, cg4,
    bg3, cg5, cg6;
    
function setGradients( grad ) { 
    /* @grad is a hash, keys are gradient object names and each
     * value is an array list of offsets and color values (stops)
     */
    for( var g in grad  ){
        for( var i=0, z=grad[g].length; i<z; i+=2 ) {
            window[g].addColorStop( grad[g][i], grad[g][i+1] );
        }
    } 
}

function canvasApp1( ctx ) {
    /* First canvas */
    ctx.id = "layer1";
    ctx.alt = "Canvas Gradient Example";
    var w = ctx.width = "640";
    var h = ctx.height = "360";
    ctx = ctx.getContext("2d");
    
    b1 = 'rgb(255, 255, 255)';
    b2 = 'rgb(0, 0, 0)';
    c1 = 'rgb(204, 102, 0)';
    c2 = 'rgb(0, 102, 153)';
    
    // Background Gradient
    bg1 = ctx.createLinearGradient(0.0, 0.0, w, 0.0);
    // Foreground Gradient for box1
    cg1 = ctx.createLinearGradient(0.0, 90.0, 0.0, 180.0);
    // Foreground Gradient for box2
    cg2 = ctx.createLinearGradient(50.0, 0.0, 540.0, 0.0);
    // Set gradient colorStops all at once
    setGradients({ 
        bg1: [ 0.0, b1, 0.5, b2, 1.0, b1 ],
        cg1: [ 0.0, c1, 1.0, c2 ],
        cg2: [ 0.0, c1, 1.0, c2 ]
    });
    
    // Draw background
    ctx.fillStyle = bg1;
    ctx.fillRect( 0, 0, 640, 360); 
    // Draw box1
    ctx.fillStyle = cg1;
    ctx.fillRect( 50, 90, 540, 80); 
    // Draw box2
    ctx.fillStyle = cg2;
    ctx.fillRect( 50, 190, 540, 80);
    
}

function canvasApp2( ctx ) {
    /* Second canvas */
    ctx.id = "layer2";
    ctx.alt = "Canvas Gradient Example";
    var w = ctx.width = "640";
    var h = ctx.height = "360";
    ctx = ctx.getContext("2d");
    
    setInterval( function() {
        
        a1++; a2--; a3++; a4--; a5++;
        b1 = 'rgb('+(a1&255)+', '+(a1&255)+', '+(a1&255)+')';
        c1 = 'rgb('+(a3&255)+', '+(a4&255)+', '+(a2&255)+')';
        c2 = 'rgb('+(a2&255)+', '+(a4&255)+', '+(a5&255)+')';
    
        // Background Gradient
        bg2 = ctx.createLinearGradient(0.0, 0.0, w, 0.0);
        // Foreground Gradient for box1
        cg3 = ctx.createLinearGradient(0.0, 90.0, 0.0, 180.0);
        // Foreground Gradient for box2
        cg4 = ctx.createLinearGradient(50.0, 0.0, 540.0, 0.0);
        
        // Set gradient colorStops all at once
        setGradients({ 
            bg2: [ 0.0, b1, 0.5, b2, 1.0, b1 ],
            cg3: [ 0.0, c1, 1.0, c2 ],
            cg4: [ 0.0, c1, 1.0, c2 ]
        });
    
        // Draw background
        ctx.fillStyle = bg2;
        ctx.fillRect( 0, 0, 640, 360); 
        // Draw box1
        ctx.fillStyle = cg3;
        ctx.fillRect( 50, 90, 540, 80); 
        // Draw box2
        ctx.fillStyle = cg4;
        ctx.fillRect( 50, 190, 540, 80); 
    }, 66 );
}

function canvasApp3( ctx ) {
    /* Second canvas */
    ctx.id = "layer2";
    ctx.alt = "Canvas Gradient Example";
    var w = ctx.width = "640";
    var h = ctx.height = "360";
    ctx = ctx.getContext("2d");
    
    setInterval( function() {
        a1++; a2++; a3++; a4++; a5++;
        b1 = 'rgb('+(a1&255)+', '+(a1&255)+', '+(a1&255)+')';
        c1 = 'rgb('+(a3&255)+', '+(a4&255)+', '+(a2&255)+')';
        c2 = 'rgb('+(a2&255)+', '+(a4&255)+', '+(a5&255)+')';
    
        // Background Gradient
        bg3 = ctx.createRadialGradient(w/2, h/4, w/4, 
                                       3*w/4, h/2, w);
        // Foreground Gradient for box1
        cg5 = ctx.createRadialGradient(w/2, h/4, w/4, 
                                        3*w/4, h/2, w);
        // Foreground Gradient for box2
        cg6 = ctx.createRadialGradient(w/2, h/4, w/4, 
                                       3*w/4, h/2, w);
        
        // Set gradient colorStops all at once
        setGradients({ 
            bg3: [ 0.0, b1, 0.5, b2, 1.0, b1 ],
            cg5: [ 0.0, c1, 1.0, c2 ],
            cg6: [ 0.0, c2, 1.0, c1 ]
        });
    
        // Draw background
        ctx.fillStyle = bg3;
        ctx.fillRect( 0, 0, 640, 360); 
        // Draw box1
        ctx.fillStyle = cg5;
        ctx.fillRect( 50, 90, 540, 80); 
        // Draw box2
        ctx.fillStyle = cg6;
        ctx.fillRect( 50, 190, 540, 80); 
    }, 66 );
    
}
